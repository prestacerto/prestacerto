-- Migration: Business Premium Plan + Referral Program
-- R$ 400k + R$ 300k/ano

-- BUSINESS PREMIUM PLAN
create table if not exists business_premium_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  seats int not null default 5,
  status text not null default 'active' check (status in ('active', 'cancelled', 'expired')),
  price numeric(10,2) not null,
  mp_order_id text,
  auto_renew boolean default true,
  started_at timestamptz not null default now(),
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_business_premium_user on business_premium_subscriptions(user_id);

alter table business_premium_subscriptions enable row level security;

create policy "user_view_own_business"
on business_premium_subscriptions for select using (user_id = auth.uid());

-- Team members pra Business Premium
create table if not exists business_team_members (
  id uuid primary key default gen_random_uuid(),
  subscription_id uuid not null references business_premium_subscriptions(id) on delete cascade,
  email text not null,
  role text not null default 'member' check (role in ('admin', 'member', 'viewer')),
  invited_at timestamptz not null default now(),
  accepted_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_team_members_subscription on business_team_members(subscription_id);

-- REFERRAL PROGRAM
create table if not exists referral_codes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  code text not null unique,
  commission_rate numeric(3,2) not null default 0.10, -- 10%
  is_active boolean default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_referral_user on referral_codes(user_id);
create index if not exists idx_referral_code on referral_codes(code);

create table if not exists referral_transactions (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid not null references profiles(id) on delete cascade,
  referred_id uuid not null references profiles(id) on delete cascade,
  referral_code text,
  transaction_type text not null check (transaction_type in ('signup_bonus', 'subscription_commission', 'project_commission')),
  amount numeric(10,2) not null,
  status text not null default 'pending' check (status in ('pending', 'completed', 'refunded')),
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists idx_referral_tx_referrer on referral_transactions(referrer_id);
create index if not exists idx_referral_tx_referred on referral_transactions(referred_id);
create index if not exists idx_referral_tx_status on referral_transactions(status);

alter table referral_transactions enable row level security;

create policy "user_view_own_referrals"
on referral_transactions for select using (referrer_id = auth.uid() or referred_id = auth.uid());
