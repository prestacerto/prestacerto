-- Migration: Certo AI Proposal Rewriter
-- Date: 2026-08-07

-- Histórico de propostas reescritas
create table if not exists proposal_rewrites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  original_text text not null,
  rewritten_text text not null,
  category text,
  budget numeric(10,2),
  tokens_used int,
  feedback text,          -- "improved" | "not_better" | null
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_proposal_rewrites_user on proposal_rewrites(user_id);
create index if not exists idx_proposal_rewrites_created on proposal_rewrites(created_at);

alter table proposal_rewrites enable row level security;

create policy "user_view_own_rewrites"
on proposal_rewrites for select using (auth.uid() = user_id);

create policy "user_insert_own_rewrites"
on proposal_rewrites for insert with check (auth.uid() = user_id);

-- Tabela de uso (rate limiting + analytics)
create table if not exists certo_ai_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  action text not null check (action in ('rewrite', 'analyze', 'suggest')),
  tokens_used int,
  cost numeric(10,4),     -- R$ cost
  success boolean default true,
  error_message text,
  created_at timestamptz not null default now()
);

create index if not exists idx_certo_ai_usage_user on certo_ai_usage(user_id);
create index if not exists idx_certo_ai_usage_date on certo_ai_usage(created_at);

alter table certo_ai_usage enable row level security;

create policy "user_view_own_usage"
on certo_ai_usage for select using (auth.uid() = user_id);

-- View: User stats pra dashboard
create or replace view user_certo_ai_stats as
select
  user_id,
  count(*) as total_rewrites,
  count(*) filter (where feedback = 'improved') as improved_count,
  count(*) filter (where feedback = 'not_better') as not_better_count,
  sum(tokens_used) as total_tokens,
  max(created_at) as last_rewrite,
  count(distinct date(created_at)) as days_active
from proposal_rewrites
group by user_id;

alter table user_certo_ai_stats enable row level security;
