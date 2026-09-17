-- Migration: Publicidade, White Label, Escrow
-- R$ 200k + R$ 400k + R$ 300k/ano

-- SPONSORED ADS
create table if not exists sponsored_ads (
  id uuid primary key default gen_random_uuid(),
  advertiser_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  description text,
  image_url text,
  click_url text not null,
  position text not null check (position in ('banner_top', 'feed_card', 'sidebar')),
  budget numeric(10,2) not null,
  spent numeric(10,2) default 0,
  impressions int default 0,
  clicks int default 0,
  status text not null default 'pending' check (status in ('pending', 'active', 'paused', 'completed')),
  started_at timestamptz,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_ads_advertiser on sponsored_ads(advertiser_id);
create index if not exists idx_ads_position on sponsored_ads(position);
create index if not exists idx_ads_status on sponsored_ads(status);

alter table sponsored_ads enable row level security;

create policy "user_view_own_ads"
on sponsored_ads for select using (advertiser_id = auth.uid() or status = 'active');

-- Ad analytics
create table if not exists ad_analytics (
  id uuid primary key default gen_random_uuid(),
  ad_id uuid not null references sponsored_ads(id) on delete cascade,
  date date not null,
  impressions int default 0,
  clicks int default 0,
  ctr numeric(5,2) default 0, -- click-through rate
  cpc numeric(10,2) default 0, -- cost per click
  created_at timestamptz not null default now(),
  unique (ad_id, date)
);

create index if not exists idx_ad_analytics_ad on ad_analytics(ad_id);
create index if not exists idx_ad_analytics_date on ad_analytics(date);

-- WHITE LABEL
create table if not exists whitelabel_accounts (
  id uuid primary key default gen_random_uuid(),
  account_owner_id uuid not null references profiles(id) on delete cascade,
  company_name text not null,
  custom_domain text unique,
  logo_url text,
  primary_color text,
  theme_json jsonb, -- cores, fontes, etc
  revenue_share numeric(3,2) not null default 0.20, -- 20-30%
  status text not null default 'active' check (status in ('active', 'suspended', 'cancelled')),
  api_key text not null unique,
  monthly_subscription numeric(10,2) not null,
  mp_order_id text,
  started_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists idx_whitelabel_owner on whitelabel_accounts(account_owner_id);
create index if not exists idx_whitelabel_domain on whitelabel_accounts(custom_domain);

alter table whitelabel_accounts enable row level security;

create policy "user_view_own_whitelabel"
on whitelabel_accounts for select using (account_owner_id = auth.uid());

-- Whitelabel users (sub-accounts)
create table if not exists whitelabel_users (
  id uuid primary key default gen_random_uuid(),
  whitelabel_account_id uuid not null references whitelabel_accounts(id) on delete cascade,
  original_user_id uuid not null references profiles(id) on delete cascade,
  role text not null default 'member' check (role in ('admin', 'member')),
  joined_at timestamptz not null default now()
);

create index if not exists idx_whitelabel_users_account on whitelabel_users(whitelabel_account_id);
create index if not exists idx_whitelabel_users_original on whitelabel_users(original_user_id);

-- ESCROW (Payment Hold)
create table if not exists escrow_transactions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  proposal_id uuid not null references proposals(id) on delete cascade,
  client_id uuid not null references profiles(id) on delete cascade,
  freelancer_id uuid not null references profiles(id) on delete cascade,
  amount numeric(10,2) not null,
  escrow_fee numeric(10,2) not null default 0, -- 2-3%
  status text not null default 'held' check (status in ('held', 'released', 'disputed', 'refunded')),
  held_at timestamptz not null default now(),
  released_at timestamptz,
  dispute_reason text,
  mp_order_id text,
  created_at timestamptz not null default now()
);

create index if not exists idx_escrow_project on escrow_transactions(project_id);
create index if not exists idx_escrow_proposal on escrow_transactions(proposal_id);
create index if not exists idx_escrow_client on escrow_transactions(client_id);
create index if not exists idx_escrow_freelancer on escrow_transactions(freelancer_id);
create index if not exists idx_escrow_status on escrow_transactions(status);

alter table escrow_transactions enable row level security;

create policy "user_view_own_escrow"
on escrow_transactions for select using (client_id = auth.uid() or freelancer_id = auth.uid());

-- Escrow disputes
create table if not exists escrow_disputes (
  id uuid primary key default gen_random_uuid(),
  escrow_id uuid not null references escrow_transactions(id) on delete cascade,
  initiator_id uuid not null references profiles(id) on delete cascade,
  reason text not null,
  evidence_url text,
  resolution text,
  resolved_at timestamptz,
  status text not null default 'open' check (status in ('open', 'resolved', 'appealed')),
  created_at timestamptz not null default now()
);

create index if not exists idx_disputes_escrow on escrow_disputes(escrow_id);
create index if not exists idx_disputes_initiator on escrow_disputes(initiator_id);

alter table escrow_disputes enable row level security;

create policy "user_view_own_disputes"
on escrow_disputes for select using (initiator_id = auth.uid() or escrow_id in (select id from escrow_transactions where client_id = auth.uid() or freelancer_id = auth.uid()));
