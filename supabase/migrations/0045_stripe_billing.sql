-- Create Stripe pricing plans table
CREATE TABLE IF NOT EXISTS stripe_plans (
  id TEXT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL, -- 'seat' or 'performance'
  base_price INTEGER NOT NULL, -- in cents
  currency VARCHAR(3) DEFAULT 'BRL',
  billing_interval VARCHAR(50) DEFAULT 'month', -- 'month' or 'year'
  features JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Stripe customer table
CREATE TABLE IF NOT EXISTS stripe_customers (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255),
  billing_name VARCHAR(255),
  billing_address JSONB,
  status VARCHAR(50) DEFAULT 'active', -- active, cancelled, past_due
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Stripe subscriptions table
CREATE TABLE IF NOT EXISTS stripe_subscriptions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_subscription_id VARCHAR(255) UNIQUE NOT NULL,
  stripe_customer_id VARCHAR(255) NOT NULL REFERENCES stripe_customers(stripe_customer_id),
  plan_id TEXT NOT NULL REFERENCES stripe_plans(id),
  status VARCHAR(50) NOT NULL, -- active, trialing, past_due, cancelled, unpaid
  seats_purchased INTEGER DEFAULT 1,
  current_period_start TIMESTAMP NOT NULL,
  current_period_end TIMESTAMP NOT NULL,
  canceled_at TIMESTAMP,
  trial_end TIMESTAMP,
  auto_renew BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Stripe invoices table
CREATE TABLE IF NOT EXISTS stripe_invoices (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_invoice_id VARCHAR(255) UNIQUE NOT NULL,
  stripe_subscription_id VARCHAR(255),
  amount_total INTEGER NOT NULL, -- in cents
  amount_paid INTEGER DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'BRL',
  status VARCHAR(50) NOT NULL, -- draft, open, paid, void, uncollectible
  due_date TIMESTAMP,
  paid_at TIMESTAMP,
  invoice_pdf_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create usage tracking table for performance-based billing
CREATE TABLE IF NOT EXISTS stripe_usage_records (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_subscription_id VARCHAR(255),
  metric_type VARCHAR(50) NOT NULL, -- 'leads_qualified', 'messages_sent', etc
  quantity INTEGER NOT NULL,
  billing_period_start DATE NOT NULL,
  billing_period_end DATE NOT NULL,
  reported_to_stripe BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE stripe_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_usage_records ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Users can view their own stripe customer"
  ON stripe_customers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own subscriptions"
  ON stripe_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own invoices"
  ON stripe_invoices FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own usage records"
  ON stripe_usage_records FOR SELECT
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_stripe_customers_user_id ON stripe_customers(user_id);
CREATE INDEX idx_stripe_customers_stripe_id ON stripe_customers(stripe_customer_id);
CREATE INDEX idx_stripe_subscriptions_user_id ON stripe_subscriptions(user_id);
CREATE INDEX idx_stripe_subscriptions_stripe_id ON stripe_subscriptions(stripe_subscription_id);
CREATE INDEX idx_stripe_subscriptions_status ON stripe_subscriptions(status);
CREATE INDEX idx_stripe_invoices_user_id ON stripe_invoices(user_id);
CREATE INDEX idx_stripe_invoices_status ON stripe_invoices(status);
CREATE INDEX idx_stripe_usage_records_user_id ON stripe_usage_records(user_id);
CREATE INDEX idx_stripe_usage_records_period ON stripe_usage_records(billing_period_start, billing_period_end);
