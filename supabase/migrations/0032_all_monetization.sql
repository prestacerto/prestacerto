-- Referral System
CREATE TABLE IF NOT EXISTS public.referral_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  code text NOT NULL UNIQUE,
  earnings_total numeric DEFAULT 0,
  referrals_count int DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;

-- Priority Queue
CREATE TABLE IF NOT EXISTS public.priority_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  tier text CHECK (tier IN ('gold', 'platinum', 'diamond')),
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.priority_queue ENABLE ROW LEVEL SECURITY;

-- Business Subscriptions
CREATE TABLE IF NOT EXISTS public.business_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  plan text CHECK (plan IN ('starter', 'pro', 'enterprise')),
  price numeric,
  team_limit int,
  next_billing timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.business_subscriptions ENABLE ROW LEVEL SECURITY;

-- Contests
CREATE TABLE IF NOT EXISTS public.contests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  prize numeric NOT NULL,
  presta_commission numeric,
  category text,
  deadline timestamptz,
  status text DEFAULT 'open' CHECK (status IN ('open', 'closed', 'completed')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.contests ENABLE ROW LEVEL SECURITY;

-- Ad Campaigns
CREATE TABLE IF NOT EXISTS public.ad_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  placement text,
  duration_days int,
  budget numeric,
  daily_rate numeric,
  status text DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
  starts_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.ad_campaigns ENABLE ROW LEVEL SECURITY;

-- Grant policies
CREATE POLICY "users_see_own_referrals" ON public.referral_codes FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "users_see_own_priority" ON public.priority_queue FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "users_see_own_business" ON public.business_subscriptions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "users_see_own_contests" ON public.contests FOR SELECT USING (client_id = auth.uid());
CREATE POLICY "users_see_own_campaigns" ON public.ad_campaigns FOR SELECT USING (user_id = auth.uid());
