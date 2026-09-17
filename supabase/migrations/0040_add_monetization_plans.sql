-- Add monetization plan columns to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS featured_listing_expires TIMESTAMP WITH TIME ZONE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS job_alerts_premium_expires TIMESTAMP WITH TIME ZONE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS analytics_pro_expires TIMESTAMP WITH TIME ZONE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS priority_support_expires TIMESTAMP WITH TIME ZONE;

-- Create monetization_events table
CREATE TABLE IF NOT EXISTS monetization_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('plan_activated', 'plan_renewed', 'plan_expired')),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create affiliate_referrals table
CREATE TABLE IF NOT EXISTS affiliate_referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  referee_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  commission_rate NUMERIC(5,2) NOT NULL DEFAULT 10.00,
  commission_earned NUMERIC(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'paid')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  paid_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(referrer_id, referee_id)
);

-- Create featured_listings table
CREATE TABLE IF NOT EXISTS featured_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('project', 'service')),
  item_id UUID NOT NULL,
  featured_until TIMESTAMP WITH TIME ZONE NOT NULL,
  views_count INT NOT NULL DEFAULT 0,
  clicks_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_monetization_events_user ON monetization_events(user_id);
CREATE INDEX IF NOT EXISTS idx_monetization_events_created ON monetization_events(created_at);
CREATE INDEX IF NOT EXISTS idx_affiliate_referrals_referrer ON affiliate_referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_referrals_referee ON affiliate_referrals(referee_id);
CREATE INDEX IF NOT EXISTS idx_featured_listings_user ON featured_listings(user_id);
CREATE INDEX IF NOT EXISTS idx_featured_listings_expires ON featured_listings(featured_until);

-- Enable RLS
ALTER TABLE monetization_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE featured_listings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users see their own events" ON monetization_events
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users see their referrals" ON affiliate_referrals
FOR SELECT USING (referrer_id = auth.uid() OR referee_id = auth.uid());

CREATE POLICY "Users see their featured listings" ON featured_listings
FOR SELECT USING (user_id = auth.uid());

-- Helper function to check if user has active plan
CREATE OR REPLACE FUNCTION has_active_plan(user_id UUID, plan_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  CASE plan_name
    WHEN 'featured_listing' THEN
      RETURN (SELECT featured_listing_expires > NOW() FROM profiles WHERE id = user_id);
    WHEN 'job_alerts_premium' THEN
      RETURN (SELECT job_alerts_premium_expires > NOW() FROM profiles WHERE id = user_id);
    WHEN 'analytics_pro' THEN
      RETURN (SELECT analytics_pro_expires > NOW() FROM profiles WHERE id = user_id);
    WHEN 'priority_support' THEN
      RETURN (SELECT priority_support_expires > NOW() FROM profiles WHERE id = user_id);
    ELSE
      RETURN FALSE;
  END CASE;
END;
$$ LANGUAGE plpgsql;
