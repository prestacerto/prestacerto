-- Migration: TOP 3 Monetization Upgrades
-- Tables: credits_subscriptions, user_badges, company_verifications
-- Created: 2026-08-07
-- Purpose: Add tiered pricing for credits, 4-tier badge system, and company verification

-- ============================================
-- COMPANY VERIFICATIONS (Selo Empresa Verificada)
-- ============================================

create table if not exists company_verifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references profiles(id) on delete cascade,
  cnpj text not null unique,
  company_name text not null,
  status text not null default 'active' check (status in ('active', 'expired', 'cancelled', 'pending_payment')),
  valid_from timestamptz not null default now(),
  valid_until timestamptz not null,
  metadata jsonb,
  created_at timestamptz not null default now(),
  renewed_at timestamptz
);

create index if not exists idx_company_verifications_user_id on company_verifications(user_id);
create index if not exists idx_company_verifications_cnpj on company_verifications(cnpj);
create index if not exists idx_company_verifications_status on company_verifications(status);

-- ============================================
-- CREDITS SUBSCRIPTIONS (Assinatura mensal/anual)
-- ============================================

create table if not exists credits_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references profiles(id) on delete cascade,
  plan text not null check (plan in ('starter', 'pro', 'unlimited')),
  billing_cycle text not null check (billing_cycle in ('monthly', 'annual')),
  credits_per_month int not null,
  price numeric(10,2) not null,
  status text not null default 'active' check (status in ('active', 'cancelled', 'paused')),
  stripe_subscription_id text,
  billing_cycle_start timestamptz not null,
  billing_cycle_end timestamptz not null,
  created_at timestamptz not null default now(),
  cancelled_at timestamptz
);

create index if not exists idx_credits_subscriptions_user_id on credits_subscriptions(user_id);
create index if not exists idx_credits_subscriptions_status on credits_subscriptions(status);

-- ============================================
-- USER BADGES (Selos de verificação com 4 tiers)
-- ============================================

create table if not exists user_badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references profiles(id) on delete cascade,
  badge_type text not null check (badge_type in ('verified', 'top-rated', 'expert', 'vip')),
  status text not null default 'active' check (status in ('active', 'expired', 'cancelled')),
  valid_from timestamptz not null default now(),
  valid_until timestamptz not null,
  created_at timestamptz not null default now(),
  renewed_at timestamptz
);

create index if not exists idx_user_badges_user_id on user_badges(user_id);
create index if not exists idx_user_badges_status on user_badges(status);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

alter table company_verifications enable row level security;
alter table credits_subscriptions enable row level security;
alter table user_badges enable row level security;

create policy "user_view_own_company" on company_verifications
  for select using (auth.uid() = user_id);

create policy "public_view_verified_companies" on company_verifications
  for select using (status = 'active');

create policy "user_view_own_subscription" on credits_subscriptions
  for select using (auth.uid() = user_id);

create policy "user_view_own_badge" on user_badges
  for select using (auth.uid() = user_id);

-- ============================================
-- REVENUE TRACKING
-- ============================================

-- Atualizar view de revenue para incluir subscriptions
--
-- security_invoker=on: sem isso a view roda com o privilégio de quem criou
-- e ignora a RLS das tabelas por trás dela — qualquer usuário logado veria
-- a receita estimada da plataforma inteira. Revoke abaixo é defesa extra:
-- isso é relatório interno, não é pra usuário final ver de jeito nenhum.
drop view if exists revenue_by_source cascade;

create or replace view revenue_by_source with (security_invoker = on) as
select 'credits' as source, count(distinct user_id) as customer_count, sum(balance * 2.98)::numeric(10,2) as estimated_revenue
from user_credits
where balance > 0
union all
select 'credits_subscription' as source, count(distinct user_id) as customer_count, sum(price * 12)::numeric(10,2) as estimated_revenue
from credits_subscriptions
where status = 'active'
union all
select 'badges' as source, count(distinct user_id) as customer_count, sum(
  case
    when badge_type = 'verified' then 9.90
    when badge_type = 'top-rated' then 29.90
    when badge_type = 'expert' then 59.90
    when badge_type = 'vip' then 99.90
    else 0
  end
)::numeric(10,2) as estimated_revenue
from user_badges
where status = 'active'
union all
select 'contests' as source, count(distinct creator_id) as customer_count, sum(prize_amount * 0.35)::numeric(10,2) as estimated_revenue
from contests
where status = 'active'
union all
select 'referrals' as source, count(distinct referrer_id) as customer_count, sum(reward)::numeric(10,2) as estimated_revenue
from referrals
where status = 'paid';

revoke all on revenue_by_source from anon, authenticated;
