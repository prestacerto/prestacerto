-- AJUSTES AGRESSIVOS DE MONETIZAÇÃO
-- 3 streams de receita ADICIONAIS para maximizar faturamento

-- 1. SISTEMA DE CRÉDITOS (Pay-per-proposal)
-- Permite cobrar por proposta sem quebrar "sem comissão"

create table if not exists user_credits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references profiles(id) on delete cascade,
  balance int not null default 0,
  plan text not null default 'free' check (plan in ('free', 'starter', 'pro', 'unlimited')),
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_user_credits_user_id on user_credits(user_id);
create index if not exists idx_user_credits_plan on user_credits(plan);

-- 2. CONTESTS/CHALLENGES (25-40% comissão)
-- Novo modelo de receita: cliente cria competition, PrestaCerto fica com comissão

create table if not exists contests (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references profiles(id) on delete cascade,
  type text not null check (type in ('design', 'copy', 'dev', 'content')),
  title text not null,
  description text not null,
  prize_amount numeric(10,2) not null,
  status text not null default 'pending_payment' check (status in ('pending_payment', 'active', 'closed', 'cancelled')),
  mp_preference_id text,
  submissions_count int not null default 0,
  winner_id uuid references profiles(id),
  created_at timestamptz not null default now(),
  ends_at timestamptz
);

create index if not exists idx_contests_creator_id on contests(creator_id);
create index if not exists idx_contests_status on contests(status);
create index if not exists idx_contests_type on contests(type);

create table if not exists contest_submissions (
  id uuid primary key default gen_random_uuid(),
  contest_id uuid not null references contests(id) on delete cascade,
  freelancer_id uuid not null references profiles(id) on delete cascade,
  submission_url text not null,
  description text,
  votes int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_contest_submissions_contest_id on contest_submissions(contest_id);
create index if not exists idx_contest_submissions_freelancer_id on contest_submissions(freelancer_id);

-- 3. PRIORITY BOOSTS (Aparecer no topo por R$ 15-40)
-- Escalabilidade: projects sempre tendo boost ativo = receita recorrente

create table if not exists priority_boosts (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  tier text not null check (tier in ('ouro', 'platina', 'diamante')),
  started_at timestamptz not null default now(),
  expires_at timestamptz not null,
  payment_id text not null,
  status text not null default 'active' check (status in ('active', 'expired', 'cancelled')),
  created_at timestamptz not null default now()
);

create index if not exists idx_priority_boosts_project_id on priority_boosts(project_id);
create index if not exists idx_priority_boosts_status on priority_boosts(status);
create index if not exists idx_priority_boosts_expires_at on priority_boosts(expires_at);

-- 4. REFERRAL PROGRAM (R$ 50-500 por referral + 10% lifetime)
-- Viral growth + comissão recorrente = crescimento exponencial

create table if not exists referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid not null references profiles(id) on delete cascade,
  referee_id uuid references profiles(id) on delete set null,
  referee_email text,
  action_type text not null check (action_type in ('signup', 'first_project', 'subscription', 'enterprise')),
  reward numeric(10,2) not null,
  status text not null default 'pending' check (status in ('pending', 'paid', 'cancelled')),
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create index if not exists idx_referrals_referrer_id on referrals(referrer_id);
create index if not exists idx_referrals_referee_id on referrals(referee_id);
create index if not exists idx_referrals_status on referrals(status);

-- 5. BUSINESS PREMIUM SUBSCRIPTIONS (R$ 299-999/mês)
-- Enterprise revenue: agências, multinacionais, uso corporativo

create table if not exists business_premium_subscriptions (
  id uuid primary key default gen_random_uuid(),
  account_owner_id uuid not null references profiles(id) on delete cascade,
  tier text not null check (tier in ('starter', 'professional', 'enterprise')),
  max_users int not null,
  status text not null default 'active' check (status in ('active', 'cancelled', 'paused')),
  stripe_subscription_id text,
  billing_cycle_start timestamptz not null,
  billing_cycle_end timestamptz not null,
  created_at timestamptz not null default now(),
  cancelled_at timestamptz
);

create index if not exists idx_business_premium_owner_id on business_premium_subscriptions(account_owner_id);
create index if not exists idx_business_premium_status on business_premium_subscriptions(status);

-- BONUS: PUBLICIDADE (Simple banner ads + programmatic)
-- Agências compram espaço pra aparecer em feeds

create table if not exists advertisements (
  id uuid primary key default gen_random_uuid(),
  advertiser_id uuid not null references profiles(id) on delete cascade,
  placement text not null check (placement in ('top_banner', 'sidebar', 'feed', 'search_results')),
  content_type text not null check (content_type in ('agency', 'freelancer_promo', 'service_promo')),
  title text not null,
  description text,
  image_url text,
  click_url text,
  budget_daily numeric(10,2) not null,
  status text not null default 'pending_review' check (status in ('pending_review', 'active', 'paused', 'expired')),
  impressions int not null default 0,
  clicks int not null default 0,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_advertisements_advertiser_id on advertisements(advertiser_id);
create index if not exists idx_advertisements_status on advertisements(status);
create index if not exists idx_advertisements_placement on advertisements(placement);

-- RLS POLICIES

alter table user_credits enable row level security;
alter table contests enable row level security;
alter table contest_submissions enable row level security;
alter table priority_boosts enable row level security;
alter table referrals enable row level security;
alter table business_premium_subscriptions enable row level security;
alter table advertisements enable row level security;

-- User Credits: Usuários veem seus próprios créditos
create policy "users_view_own_credits"
  on user_credits for select
  using (auth.uid() = user_id);

-- Contests: Criador vê seus contests, freelancers veem ativos
create policy "creator_view_own_contests"
  on contests for select
  using (auth.uid() = creator_id);

create policy "freelancers_view_active_contests"
  on contests for select
  using (status = 'active');

-- Priority Boosts: Client vê seus boosts
create policy "client_view_own_boosts"
  on priority_boosts for select
  using (
    exists (
      select 1 from projects p
      where p.id = priority_boosts.project_id
      and p.client_id = auth.uid()
    )
  );

-- Referrals: Referrer vê suas referências
create policy "referrer_view_own_referrals"
  on referrals for select
  using (auth.uid() = referrer_id);

-- Business Premium: Account owner vê sua subscription
create policy "owner_view_own_business"
  on business_premium_subscriptions for select
  using (auth.uid() = account_owner_id);

-- Advertisements: Advertiser vê seus anúncios
create policy "advertiser_view_own_ads"
  on advertisements for select
  using (auth.uid() = advertiser_id);

create policy "users_view_active_ads"
  on advertisements for select
  using (status = 'active' and now() between starts_at and ends_at);

-- VIEWS para Analytics
--
-- security_invoker=on: sem isso a view ignora a RLS das tabelas por trás e
-- vaza receita da plataforma inteira pra qualquer usuário logado (0007
-- recria essa view com a mesma proteção — deixando aqui também por
-- consistência do histórico de migrations).

create or replace view revenue_by_source with (security_invoker = on) as
select
  'credits' as source,
  count(distinct user_id) as customer_count,
  sum(balance * 2.98)::numeric(10,2) as estimated_revenue
from user_credits
where balance > 0
union all
select
  'contests' as source,
  count(distinct creator_id) as customer_count,
  sum(prize_amount * 0.35)::numeric(10,2) as estimated_revenue
from contests
where status = 'active'
union all
select
  'priority_boosts' as source,
  count(distinct project_id) as customer_count,
  sum(case
    when tier = 'ouro' then 15.90
    when tier = 'platina' then 25.90
    else 39.90
  end)::numeric(10,2) as estimated_revenue
from priority_boosts
where status = 'active'
union all
select
  'referrals' as source,
  count(distinct referrer_id) as customer_count,
  sum(reward)::numeric(10,2) as estimated_revenue
from referrals
where status = 'paid';

revoke all on revenue_by_source from anon, authenticated;

-- Índices adicionais para performance
create index if not exists idx_payment_transactions_type_status
  on payment_transactions(payment_type, status)
  where status = 'approved';

create index if not exists idx_contests_active
  on contests(status, created_at desc)
  where status = 'active';

create index if not exists idx_priority_boosts_active
  on priority_boosts(status, expires_at)
  where status = 'active';

-- Comentários de negócio (não executar, apenas documentação)
-- REVENUE BREAKDOWN (Otimista):
-- - Créditos: R$ 50k/mês (1000 users × 5 créditos médio × R$ 10 = R$ 50k)
-- - Contests: R$ 30k/mês (100 contests × R$ 1000 médio × 30% comissão)
-- - Priority Boosts: R$ 12k/mês (240 boosts/mês × R$ 50 médio)
-- - Referrals: R$ 25k/mês (500 referrals × R$ 50 médio)
-- - Business Premium: R$ 35k/mês (10 clientes × R$ 350 médio)
-- - Publicidade: R$ 17k/mês (agências pagando por visibilidade)
-- TOTAL: R$ 169k/mês = R$ 2M+/ano (SEM contar as 3 features já ativas)
