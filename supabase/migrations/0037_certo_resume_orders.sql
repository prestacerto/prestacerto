-- Pedidos do Certo Currículo. O pagamento só é marcado como pago pelo webhook
-- Stripe validado no servidor; a sessão é única para manter idempotência.
create table if not exists public.certo_resume_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  stripe_session_id text unique,
  stripe_payment_intent_id text unique,
  amount_cents integer not null default 1990 check (amount_cents = 1990),
  currency text not null default 'brl',
  status text not null default 'created' check (status in ('created', 'checkout_created', 'paid', 'failed', 'expired')),
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists certo_resume_orders_user_id_idx on public.certo_resume_orders(user_id, created_at desc);
alter table public.certo_resume_orders enable row level security;

create policy "users can view their resume orders"
  on public.certo_resume_orders for select
  using (auth.uid() = user_id);
