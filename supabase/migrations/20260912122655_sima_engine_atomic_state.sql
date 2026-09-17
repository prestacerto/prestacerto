create table public.sima_engine_state_v1 (
  environment text not null check (environment in ('test','production')),
  path text not null check (length(path) <= 512 and path ~ '^(prestacerto|sinalmeet)/[A-Za-z0-9_./-]+$'),
  value jsonb not null check (octet_length(value::text) <= 100000),
  created_at timestamptz not null default now(),
  primary key(environment,path)
);
alter table public.sima_engine_state_v1 enable row level security;
alter table public.sima_engine_state_v1 force row level security;
revoke all on public.sima_engine_state_v1 from public, anon, authenticated;
grant select,insert,delete on public.sima_engine_state_v1 to service_role;
comment on table public.sima_engine_state_v1 is 'SimaAI engine private atomic state. Server broker only. Tenant prefix and environment are validated before access; unique key enforces at-most-one claimant.';
