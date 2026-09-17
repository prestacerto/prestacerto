-- Migration: 5 Revenue Streams Features
-- Date: 2026-08-07

-- ============================================
-- FEATURED PROJECTS (destaque por 7 dias)
-- ============================================

alter table projects add column if not exists is_featured boolean default false;
alter table projects add column if not exists featured_until timestamptz;
alter table projects add column if not exists featured_fee numeric(10,2) default 0;

create index if not exists idx_projects_featured on projects(is_featured, created_at desc) where is_featured = true;

-- ============================================
-- VERIFIED FREELANCER BADGE (subscription)
-- ============================================

alter table profiles add column if not exists is_verified boolean default false;
alter table profiles add column if not exists verified_badge_active boolean default false;
alter table profiles add column if not exists verified_badge_expires timestamptz;
alter table profiles add column if not exists verified_badge_fee numeric(10,2) default 5.00; -- R$ 5/mês

create index if not exists idx_profiles_verified on profiles(is_verified) where is_verified = true;

-- ============================================
-- PRIORITY SUPPORT (chat prioritário)
-- ============================================

alter table profiles add column if not exists has_priority_support boolean default false;
alter table profiles add column if not exists priority_support_expires timestamptz;
alter table profiles add column if not exists priority_support_fee numeric(10,2) default 20.00; -- R$ 20/mês

-- ============================================
-- PORTFOLIO PREMIUM (customização)
-- ============================================

alter table profiles add column if not exists has_premium_portfolio boolean default false;
alter table profiles add column if not exists custom_username text;
alter table profiles add column if not exists portfolio_analytics_active boolean default false;
alter table profiles add column if not exists portfolio_premium_expires timestamptz;
alter table profiles add column if not exists portfolio_premium_fee numeric(10,2) default 10.00; -- R$ 10/mês

create unique index if not exists idx_custom_username on profiles(custom_username) where custom_username is not null;

-- ============================================
-- API MARKETPLACE (integração)
-- ============================================

create table if not exists api_keys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  key_name text not null,
  secret_key text not null unique,
  is_active boolean default true,
  last_used_at timestamptz,
  monthly_requests int default 0,
  request_limit int default 10000,
  plan text default 'free' check (plan in ('free', 'starter', 'pro', 'enterprise')),
  subscription_expires timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_api_keys_user on api_keys(user_id);
create index if not exists idx_api_keys_secret on api_keys(secret_key);

alter table api_keys enable row level security;

create policy "user_view_own_api_keys"
on api_keys for select using (user_id = auth.uid());

create table if not exists api_usage (
  id uuid primary key default gen_random_uuid(),
  api_key_id uuid not null references api_keys(id) on delete cascade,
  endpoint text not null,
  method text not null,
  status_code int,
  response_time_ms int,
  created_at timestamptz not null default now()
);

create index if not exists idx_api_usage_key on api_usage(api_key_id);
create index if not exists idx_api_usage_created on api_usage(created_at desc);

-- ============================================
-- SUBSCRIPTION MANAGEMENT
-- ============================================

create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  subscription_type text not null check (subscription_type in ('verified_badge', 'priority_support', 'portfolio_premium', 'api_starter', 'api_pro', 'api_enterprise')),
  status text not null default 'active' check (status in ('active', 'canceled', 'expired')),
  price numeric(10,2) not null,
  billing_cycle int default 30, -- dias
  started_at timestamptz not null default now(),
  expires_at timestamptz not null,
  auto_renew boolean default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_subscriptions_user on subscriptions(user_id);
create index if not exists idx_subscriptions_type on subscriptions(subscription_type);
create index if not exists idx_subscriptions_status on subscriptions(status);

alter table subscriptions enable row level security;

create policy "user_view_own_subscriptions"
on subscriptions for select using (user_id = auth.uid());

-- ============================================
-- REVENUE TRACKING (dashboard admin)
-- ============================================

create table if not exists revenue_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  project_id uuid references projects(id),
  event_type text not null check (event_type in ('featured_project', 'verified_badge', 'priority_support', 'portfolio_premium', 'api_plan', 'urgent_fee', 'guarantee_fee', 'milestone_release')),
  amount numeric(10,2) not null,
  status text default 'pending' check (status in ('pending', 'completed', 'refunded')),
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists idx_revenue_events_user on revenue_events(user_id);
create index if not exists idx_revenue_events_type on revenue_events(event_type);
create index if not exists idx_revenue_events_status on revenue_events(status);
create index if not exists idx_revenue_events_date on revenue_events(created_at desc);

alter table revenue_events enable row level security;

create policy "admin_view_all_revenue"
on revenue_events for select using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
