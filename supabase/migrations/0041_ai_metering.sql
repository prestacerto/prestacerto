-- Metering financeiro de IA. Somente processos server-side (service_role) escrevem/leem.
create table if not exists public.ai_model_prices (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  model_pattern text not null,
  input_usd_per_million numeric(14, 8) not null check (input_usd_per_million >= 0),
  cached_input_usd_per_million numeric(14, 8) not null check (cached_input_usd_per_million >= 0),
  output_usd_per_million numeric(14, 8) not null check (output_usd_per_million >= 0),
  effective_from timestamptz not null default now(),
  effective_to timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint ai_model_prices_valid_window check (effective_to is null or effective_to > effective_from)
);

create unique index if not exists ai_model_prices_active_model_idx
  on public.ai_model_prices (provider, model_pattern)
  where effective_to is null;

create table if not exists public.ai_usage_events (
  id uuid primary key default gen_random_uuid(),
  project text not null,
  product text not null,
  organization_id text,
  account_id text,
  user_id uuid references auth.users(id) on delete set null,
  request_id text not null,
  provider text not null,
  model text not null,
  input_tokens bigint not null default 0 check (input_tokens >= 0),
  cached_input_tokens bigint not null default 0 check (cached_input_tokens >= 0),
  output_tokens bigint not null default 0 check (output_tokens >= 0),
  total_tokens bigint not null default 0 check (total_tokens >= 0),
  estimated_cost_usd numeric(18, 10) not null default 0 check (estimated_cost_usd >= 0),
  pricing_source text not null default 'unpriced',
  created_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  constraint ai_usage_events_cached_lte_input check (cached_input_tokens <= input_tokens),
  constraint ai_usage_events_request_unique unique (provider, request_id)
);

create index if not exists ai_usage_events_created_at_idx on public.ai_usage_events (created_at desc);
create index if not exists ai_usage_events_product_created_idx on public.ai_usage_events (product, created_at desc);
create index if not exists ai_usage_events_user_created_idx on public.ai_usage_events (user_id, created_at desc) where user_id is not null;
create index if not exists ai_usage_events_org_created_idx on public.ai_usage_events (organization_id, created_at desc) where organization_id is not null;
create index if not exists ai_usage_events_account_created_idx on public.ai_usage_events (account_id, created_at desc) where account_id is not null;

alter table public.ai_model_prices enable row level security;
alter table public.ai_usage_events enable row level security;
revoke all on public.ai_model_prices from anon, authenticated;
revoke all on public.ai_usage_events from anon, authenticated;
grant all on public.ai_model_prices to service_role;
grant all on public.ai_usage_events to service_role;

insert into public.ai_model_prices
  (provider, model_pattern, input_usd_per_million, cached_input_usd_per_million, output_usd_per_million, metadata)
values
  ('openai', 'gpt-4o-mini%', 0.15, 0.075, 0.60, '{"source":"official-default-2026-08-28"}'),
  ('anthropic', 'claude-3-5-sonnet%', 3.00, 3.00, 15.00, '{"source":"official-default-2026-08-28"}'),
  ('anthropic', 'claude-sonnet-%', 3.00, 3.00, 15.00, '{"source":"official-default-2026-08-28"}')
on conflict (provider, model_pattern) where effective_to is null do nothing;

create or replace view public.ai_usage_by_day as
select
  date_trunc('day', created_at) as period,
  project,
  product,
  organization_id,
  account_id,
  user_id,
  count(*) as calls,
  sum(input_tokens) as input_tokens,
  sum(cached_input_tokens) as cached_input_tokens,
  sum(output_tokens) as output_tokens,
  sum(total_tokens) as total_tokens,
  sum(estimated_cost_usd) as estimated_cost_usd
from public.ai_usage_events
group by 1, 2, 3, 4, 5, 6;

create or replace view public.ai_usage_by_month as
select
  date_trunc('month', created_at) as period,
  project,
  product,
  organization_id,
  account_id,
  user_id,
  count(*) as calls,
  sum(input_tokens) as input_tokens,
  sum(cached_input_tokens) as cached_input_tokens,
  sum(output_tokens) as output_tokens,
  sum(total_tokens) as total_tokens,
  sum(estimated_cost_usd) as estimated_cost_usd
from public.ai_usage_events
group by 1, 2, 3, 4, 5, 6;

revoke all on public.ai_usage_by_day from anon, authenticated;
revoke all on public.ai_usage_by_month from anon, authenticated;
grant select on public.ai_usage_by_day to service_role;
grant select on public.ai_usage_by_month to service_role;

