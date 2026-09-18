-- Registro financeiro por evento do Assiny (valor e forma de pagamento).
-- O ledger (assiny_events) decide acesso; esta tabela só alimenta relatórios.
create table if not exists public.assiny_payments (
  mode text not null check (mode in ('test','live')),
  event_id text not null,
  subscription_id text not null,
  event_type text not null,
  plan text not null check (plan in ('pro','business')),
  offer_id text not null,
  amount_cents integer not null check (amount_cents >= 0),
  payment_method text,
  customer_email text not null,
  occurred_at timestamptz not null,
  received_at timestamptz not null default now(),
  primary key (mode, event_id)
);
create index if not exists assiny_payments_occurred on public.assiny_payments (mode, occurred_at desc);
alter table public.assiny_payments enable row level security;
revoke all on public.assiny_payments from public, anon, authenticated;
grant select, insert on public.assiny_payments to service_role;
