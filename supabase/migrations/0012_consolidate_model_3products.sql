-- Migration: Consolidate to 3 Strong Products Model
-- Remove: Créditos, Contest, 4-tier badges
-- Keep: PRO, SELECT, EXTRAS
-- Date: 2026-08-07
-- Impact: Simplify from 6 confusing products to 3 clear ones

-- ============================================
-- PHASE 1: Deprecate weak products
-- ============================================

-- 1. Consolidate credits_subscriptions into single PRO tier
-- Anyone on Starter/Business → migra pro PRO com benefício maior

alter table credits_subscriptions add column if not exists migrated_to_pro boolean default false;

-- 2. Rename user_badges → consolidate to SELECT only
-- Remove badge_type tiers, keep only "select" (passed test)

alter table if exists user_badges rename to user_select_status;

-- Normalize structure
alter table user_select_status drop constraint if exists user_badges_badge_type_check;
alter table user_select_status add column if not exists test_type text check (test_type in ('dev', 'design', 'copywriting', 'marketing'));
alter table user_select_status add column if not exists test_score numeric(5,2);
alter table user_select_status add column if not exists passed_at timestamptz;

-- 3. Kill contest (it's dead weight)
-- Keep table but mark as deprecated
alter table if exists contests add column if not exists deprecated boolean default false;

-- ============================================
-- NEW: PRO Subscription (Single strong tier)
-- ============================================

create table if not exists pro_subscription (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references profiles(id) on delete cascade,
  tier text not null default 'pro' check (tier in ('pro')), -- future-proof
  billing_cycle text not null check (billing_cycle in ('monthly', 'annual')),
  price numeric(10,2) not null,
  status text not null default 'active' check (status in ('active', 'cancelled', 'paused')),
  started_at timestamptz not null default now(),
  cancelled_at timestamptz,
  created_at timestamptz not null default now(),

  -- Auto-include benefits (no separate feature table)
  has_portfolio_public boolean default true,
  has_top_search boolean default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_pro_subscription_user on pro_subscription(user_id);
create index if not exists idx_pro_subscription_status on pro_subscription(status);

alter table pro_subscription enable row level security;

create policy "user_view_own_pro"
on pro_subscription for select using (auth.uid() = user_id);

-- ============================================
-- NEW: SELECT (Verified quality via test)
-- ============================================

-- Rename what we have, then enhance
create table if not exists freelancer_select (
  id uuid primary key default gen_random_uuid(),
  freelancer_id uuid not null unique references profiles(id) on delete cascade,
  test_type text not null check (test_type in ('dev', 'design', 'copywriting', 'marketing', 'general')),
  test_score numeric(5,2) not null,
  test_passed_at timestamptz not null,
  status text not null default 'active' check (status in ('active', 'expired', 'revoked')),
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),

  constraint score_range check (test_score >= 0 and test_score <= 100)
);

create index if not exists idx_freelancer_select_status on freelancer_select(status);
create index if not exists idx_freelancer_select_test_type on freelancer_select(test_type);
create index if not exists idx_freelancer_select_active on freelancer_select(status) where status = 'active';

alter table freelancer_select enable row level security;

create policy "user_view_own_select"
on freelancer_select for select using (auth.uid() = freelancer_id);

create policy "client_view_select_freelancers"
on freelancer_select for select using (status = 'active');

-- ============================================
-- NEW: Gig Extras (Upsell in transaction)
-- ============================================

create table if not exists gig_extras (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references proposals(id) on delete cascade,
  extra_type text not null check (extra_type in ('express_delivery', 'extra_revision', 'source_files', 'priority_support')),
  price_extra numeric(10,2) not null,
  quantity int not null default 1,
  added_at timestamptz not null default now(),

  constraint price_positive check (price_extra > 0)
);

create index if not exists idx_gig_extras_proposal on gig_extras(proposal_id);
create index if not exists idx_gig_extras_type on gig_extras(extra_type);

alter table gig_extras enable row level security;

create policy "client_view_own_extras"
on gig_extras for select using (
  exists (
    select 1 from proposals p
    where p.id = proposal_id and p.freelancer_id = auth.uid()
  )
);

-- ============================================
-- NEW: Portfolio Public (Tool beyond marketplace)
-- ============================================

create table if not exists portfolio_public (
  id uuid primary key default gen_random_uuid(),
  freelancer_id uuid not null unique references profiles(id) on delete cascade,
  url_slug text not null unique, -- @username
  headline text not null,
  bio text,
  featured_projects uuid[] default '{}', -- array of project IDs to display
  social_links jsonb, -- {instagram, linkedin, twitter}
  is_active boolean default true,
  theme text default 'minimal' check (theme in ('minimal', 'bold', 'dark')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_portfolio_public_slug on portfolio_public(url_slug);
create index if not exists idx_portfolio_public_active on portfolio_public(is_active);

alter table portfolio_public enable row level security;

create policy "user_manage_own_portfolio"
on portfolio_public for all using (auth.uid() = freelancer_id);

create policy "public_view_active_portfolio"
on portfolio_public for select using (is_active = true);

-- ============================================
-- NEW: SELECT Pricing (Client-side monetization)
-- ============================================

create table if not exists select_pricing (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  price_monthly numeric(10,2),
  price_per_project numeric(10,2),
  features jsonb, -- array of features included
  active boolean default true,
  created_at timestamptz not null default now()
);

-- INSERT default SELECT tiers
insert into select_pricing (name, description, price_monthly, price_per_project, features, active) values
  ('SELECT Access', 'Filter candidates by SELECT status', 199.00, null, '["Filter by test type", "See test scores", "Priority matching"]'::jsonb, true),
  ('SELECT Project', 'Pre-select 3 SELECT candidates', null, 5000.00, '["Expert curation", "Pre-screened", "Guaranteed quality"]'::jsonb, true);

-- ============================================
-- MIGRATION: Existing users to PRO
-- ============================================

-- Migrate all Starter/Pro/Business subscriptions to PRO with annual option
with migrated as (
  insert into pro_subscription (user_id, tier, billing_cycle, price, status, started_at)
  select
    user_id,
    'pro',
    case when billing_cycle = 'annual' then 'annual' else 'monthly' end,
    case when billing_cycle = 'annual' then 490.00 else 49.00 end, -- R$ 49/mês, R$ 490/ano
    'active',
    now()
  from credits_subscriptions
  where status = 'active'
  on conflict do nothing
  returning user_id
)
update credits_subscriptions
set migrated_to_pro = true
where user_id in (select user_id from migrated);

-- ============================================
-- CLEANUP: Deprecate old tables (keep for audit)
-- ============================================

alter table credits_subscriptions add column if not exists deprecated_at timestamptz;
update credits_subscriptions set deprecated_at = now() where migrated_to_pro = true;

-- Keep user_select_status but mark as deprecated
alter table user_select_status add column if not exists migrated_to_freelancer_select boolean default false;

-- ============================================
-- AUDIT & LOGGING
-- ============================================

create table if not exists model_consolidation_log (
  id uuid primary key default gen_random_uuid(),
  action text not null,
  user_id uuid references profiles(id),
  old_product text,
  new_product text,
  details jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_consolidation_log_user on model_consolidation_log(user_id);
create index if not exists idx_consolidation_log_date on model_consolidation_log(created_at desc);

-- ============================================
-- VIEWS: Simplified dashboard queries
-- ============================================

create or replace view freelancer_profile_complete as
select
  p.id,
  p.full_name,
  p.bio,
  p.avatar_url,
  pro.status as pro_status,
  fs.id as select_status_id,
  fs.test_type,
  fs.test_score,
  pp.url_slug as portfolio_url,
  case when pro.status = 'active' then true else false end as has_pro,
  case when fs.status = 'active' then true else false end as has_select,
  case when pp.is_active = true then true else false end as has_public_portfolio
from profiles p
left join pro_subscription pro on p.id = pro.user_id
left join freelancer_select fs on p.id = fs.freelancer_id and fs.status = 'active'
left join portfolio_public pp on p.id = pp.freelancer_id and pp.is_active = true;

-- ============================================
-- PERFORMANCE: Key indexes for new model
-- ============================================

create index idx_pro_sub_user_status on pro_subscription(user_id, status);
create index idx_freelancer_select_active_type on freelancer_select(status, test_type) where status = 'active';
create index idx_portfolio_slug_active on portfolio_public(url_slug, is_active);
create index idx_gig_extras_proposal_type on gig_extras(proposal_id, extra_type);

-- ============================================
-- MIGRATION SUCCESS LOG
-- ============================================

insert into model_consolidation_log (action, details) values
  ('migration_complete', jsonb_build_object(
    'timestamp', now(),
    'tables_created', 5,
    'users_migrated_to_pro', (select count(*) from pro_subscription),
    'legacy_products_deprecated', 3,
    'status', 'ready_for_deployment'
  ));

-- ============================================
-- READY FOR DEPLOYMENT
-- ============================================
