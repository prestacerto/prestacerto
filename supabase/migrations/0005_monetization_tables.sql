-- Monetization Tables Migration
-- Cria tabelas para rastrear destaques, premium, badges e pagamentos.
--
-- Substitui a abordagem de 0004 (colunas is_featured/is_verified direto em
-- projects/profiles) por tabelas próprias com histórico — um projeto pode
-- ser destacado mais de uma vez ao longo do tempo, e cada cobrança fica
-- registrada em payment_transactions. Roda antes das tabelas serem criadas
-- porque early_payment_requests (de 0004) continua sendo usada como está.

alter table projects drop column if exists is_featured;
alter table projects drop column if exists featured_until;
alter table profiles drop column if exists is_verified;
alter table profiles drop column if exists verified_at;

-- 1. Project Highlights (Destaques de projeto)
create table if not exists project_highlights (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  activated_at timestamptz not null default now(),
  valid_until timestamptz not null,
  days_purchased int not null,
  payment_id text not null unique,
  status text not null default 'active' check (status in ('active', 'expired', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_project_highlights_project_id on project_highlights(project_id);
create index if not exists idx_project_highlights_status on project_highlights(status);
create index if not exists idx_project_highlights_valid_until on project_highlights(valid_until);

-- 2. Freelancer Premium (Portfólio Premium)
create table if not exists freelancer_premium (
  id uuid primary key default gen_random_uuid(),
  freelancer_id uuid not null references profiles(id) on delete cascade,
  premium_until timestamptz not null,
  months_purchased int not null,
  payment_id text not null unique,
  status text not null default 'active' check (status in ('active', 'expired', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(freelancer_id) -- Apenas um premium ativo por freelancer
);

create index if not exists idx_freelancer_premium_freelancer_id on freelancer_premium(freelancer_id);
create index if not exists idx_freelancer_premium_status on freelancer_premium(status);
create index if not exists idx_freelancer_premium_valid_until on freelancer_premium(premium_until);

-- 3. Freelancer Badges (Badge de Verificação)
create table if not exists freelancer_badges (
  id uuid primary key default gen_random_uuid(),
  freelancer_id uuid not null references profiles(id) on delete cascade,
  badge_type text not null default 'verified' check (badge_type in ('verified', 'top_rated', 'expert')),
  valid_until timestamptz not null,
  payment_id text not null unique,
  status text not null default 'active' check (status in ('active', 'expired', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_freelancer_badges_freelancer_id on freelancer_badges(freelancer_id);
create index if not exists idx_freelancer_badges_status on freelancer_badges(status);
create index if not exists idx_freelancer_badges_badge_type on freelancer_badges(badge_type);

-- 4. Payment Transactions (Histórico geral de pagamentos)
create table if not exists payment_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  payment_type text not null check (payment_type in ('highlight', 'premium', 'badge')),
  reference_id uuid, -- project_id ou freelancer_id
  amount numeric(10,2) not null,
  currency text not null default 'BRL',
  mercado_pago_id text not null unique,
  status text not null default 'pending' check (status in ('pending', 'approved', 'failed', 'refunded')),
  metadata jsonb, -- Extra data (days, months, etc)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_payment_transactions_user_id on payment_transactions(user_id);
create index if not exists idx_payment_transactions_status on payment_transactions(status);
create index if not exists idx_payment_transactions_payment_type on payment_transactions(payment_type);
create index if not exists idx_payment_transactions_created_at on payment_transactions(created_at desc);

-- Views abaixo usam security_invoker: sem isso, uma view roda com o
-- privilégio de quem criou (o dono da tabela), o que ignora a RLS das
-- tabelas por trás dela — qualquer usuário logado veria os dados de todo
-- mundo através da view, mesmo com RLS habilitada nas tabelas.

-- 5. View: Active Highlights (Destaques ativos)
create or replace view active_highlights with (security_invoker = on) as
select
  ph.id,
  ph.project_id,
  p.title as project_title,
  ph.days_purchased,
  ph.activated_at,
  ph.valid_until,
  extract(day from ph.valid_until - now()) as days_remaining
from project_highlights ph
join projects p on ph.project_id = p.id
where ph.status = 'active' and ph.valid_until > now();

-- 6. View: Active Premium (Freelancers com premium ativo)
create or replace view active_premium with (security_invoker = on) as
select
  fp.id,
  fp.freelancer_id,
  prof.full_name,
  fp.months_purchased,
  fp.premium_until,
  extract(day from fp.premium_until - now()) as days_remaining
from freelancer_premium fp
join profiles prof on fp.freelancer_id = prof.id
where fp.status = 'active' and fp.premium_until > now();

-- 7. View: Active Badges (Badges de verificação ativa)
create or replace view active_badges with (security_invoker = on) as
select
  fb.id,
  fb.freelancer_id,
  prof.full_name,
  fb.badge_type,
  fb.valid_until,
  extract(day from fb.valid_until - now()) as days_remaining
from freelancer_badges fb
join profiles prof on fb.freelancer_id = prof.id
where fb.status = 'active' and fb.valid_until > now();

-- 8. View: Revenue Analytics (Análise de receita) — relatório interno, não
-- é pra usuário final ver. security_invoker + revoke abaixo: mesmo que
-- alguém troque a policy de payment_transactions no futuro, essa view
-- continua inacessível pra anon/authenticated por padrão.
create or replace view revenue_analytics with (security_invoker = on) as
select
  date_trunc('day', pt.created_at) as day,
  pt.payment_type,
  pt.status,
  count(*) as transaction_count,
  sum(pt.amount) as total_amount,
  avg(pt.amount) as avg_amount
from payment_transactions pt
group by date_trunc('day', pt.created_at), pt.payment_type, pt.status;

revoke all on revenue_analytics from anon, authenticated;

-- RLS (Row Level Security)
alter table project_highlights enable row level security;
alter table freelancer_premium enable row level security;
alter table freelancer_badges enable row level security;
alter table payment_transactions enable row level security;

-- RLS Policy: Usuários veem seus próprios pagamentos
create policy "users_view_own_payments"
  on payment_transactions for select
  using (auth.uid() = user_id);

-- RLS Policy: Clientes veem destaques de seus projetos
create policy "clients_view_own_highlights"
  on project_highlights for select
  using (
    exists (
      select 1 from projects p
      where p.id = project_highlights.project_id
      and p.client_id = auth.uid()
    )
  );

-- RLS Policy: Freelancers veem seu próprio premium
create policy "freelancers_view_own_premium"
  on freelancer_premium for select
  using (auth.uid() = freelancer_id);

-- RLS Policy: Freelancers veem seus próprios badges
create policy "freelancers_view_own_badges"
  on freelancer_badges for select
  using (auth.uid() = freelancer_id);
