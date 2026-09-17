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


-- Atomic reservations. All calls are server-authorized; no browser can reserve or alter usage.
-- Prices verified 2026-09-09: https://developers.openai.com/api/docs/models/gpt-4o-mini
create table public.certo_ai_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  feature text not null check (feature in ('rewrite','brief')),
  plan text not null check (plan in ('free','pro','business')),
  created_at timestamptz not null default now(),
  state text not null default 'reserved' check (state in ('reserved','completed')),
  reserved_usd numeric(16,10) not null default 0.01 check (reserved_usd = 0.01),
  actual_usd numeric(16,10) check (actual_usd >= 0),
  input_tokens integer check (input_tokens >= 0),
  output_tokens integer check (output_tokens >= 0),
  provider_request_id text unique,
  constraint completed_usage check (state <> 'completed' or (actual_usd is not null and input_tokens is not null and output_tokens is not null and provider_request_id is not null))
);
create index certo_ai_requests_month on public.certo_ai_requests(created_at,user_id);
alter table public.certo_ai_requests enable row level security;
revoke all on public.certo_ai_requests from public,anon,authenticated;
grant select,insert,update on public.certo_ai_requests to service_role;

create function public.reserve_certo_ai(p_user_id uuid,p_feature text)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare
  v_plan text; v_count int; v_user_cost numeric; v_global_cost numeric;
  v_month timestamptz := date_trunc('month',now() at time zone 'UTC') at time zone 'UTC';
  v_limit numeric; v_id uuid;
begin
  if p_feature is null or p_feature not in ('rewrite','brief') then raise exception 'invalid_feature'; end if;
  -- One short transaction serializes global and user budget checks across every app instance.
  perform pg_advisory_xact_lock(918409,1);
  select plan into v_plan from public.profiles where id=p_user_id for update;
  if v_plan is null or v_plan not in ('free','pro','business') then raise exception 'invalid_profile'; end if;
  select count(*) filter (where feature=p_feature),coalesce(sum(coalesce(actual_usd,reserved_usd)),0)
    into v_count,v_user_cost from public.certo_ai_requests where user_id=p_user_id and created_at>=v_month;
  if v_plan='free' and v_count>=3 then return jsonb_build_object('allowed',false,'reason','quota','plan',v_plan); end if;
  v_limit := case v_plan when 'pro' then 2 when 'business' then 5 else 0.30 end;
  if v_user_cost+0.01>v_limit then return jsonb_build_object('allowed',false,'reason','budget','plan',v_plan); end if;
  select coalesce(sum(coalesce(actual_usd,reserved_usd)),0) into v_global_cost from public.certo_ai_requests where created_at>=v_month;
  if v_global_cost+0.01>100 then return jsonb_build_object('allowed',false,'reason','global_budget','plan',v_plan); end if;
  insert into public.certo_ai_requests(user_id,feature,plan) values(p_user_id,p_feature,v_plan) returning id into v_id;
  return jsonb_build_object('allowed',true,'id',v_id,'plan',v_plan,'remainingFree',case when v_plan='free' then 2-v_count else null end);
end $$;
revoke all on function public.reserve_certo_ai(uuid,text) from public,anon,authenticated;
grant execute on function public.reserve_certo_ai(uuid,text) to service_role;

create function public.finish_certo_ai(p_id uuid,p_request_id text,p_input integer,p_output integer)
returns void language plpgsql security invoker set search_path = '' as $$
begin
  if p_input is null or p_output is null or p_input<0 or p_output<0 or nullif(p_request_id,'') is null then raise exception 'invalid_usage'; end if;
  -- Deliberately charge uncached input pricing: conservative, independent of cache reporting.
  -- No arbitrary model or price parameter is accepted from application callers.
  perform pg_advisory_xact_lock(918409,1);
  update public.certo_ai_requests set state='completed',provider_request_id=p_request_id,
    input_tokens=p_input,output_tokens=p_output,actual_usd=(p_input*0.15+p_output*0.60)/1000000
    where id=p_id and state='reserved';
end $$;
revoke all on function public.finish_certo_ai(uuid,text,integer,integer) from public,anon,authenticated;
grant execute on function public.finish_certo_ai(uuid,text,integer,integer) to service_role;
