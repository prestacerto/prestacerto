-- Migration: Payment Processing Core Architecture
-- Status: FASE 1 - Foundation (Payment ledger, escrow, tokens)
-- Date: 2026-08-07
-- Priority: CRÍTICO

-- ============================================
-- MERCADO PAGO TOKENS (OAuth + Auto-refresh)
-- ============================================

create table if not exists mercado_pago_tokens (
  id uuid primary key default gen_random_uuid(),
  freelancer_id uuid not null unique references profiles(id) on delete cascade,
  access_token text not null, -- encrypted in app
  refresh_token text not null, -- encrypted in app
  token_expiry timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_mercado_pago_tokens_freelancer on mercado_pago_tokens(freelancer_id);
create index if not exists idx_mercado_pago_tokens_expiry on mercado_pago_tokens(token_expiry);

alter table mercado_pago_tokens enable row level security;

create policy "user_view_own_mp_token"
on mercado_pago_tokens for select using (auth.uid() = freelancer_id);

-- ============================================
-- PAYMENT LEDGER (Double-entry accounting)
-- ============================================

create table if not exists payment_ledger (
  id uuid primary key default gen_random_uuid(),
  transaction_id uuid not null,
  account_id uuid not null references profiles(id) on delete cascade,
  direction text not null check (direction in ('debit', 'credit')),
  amount decimal(10,2) not null,
  currency text not null default 'BRL',
  status text not null default 'pending' check (status in ('pending', 'posted')),
  posted_at timestamptz,
  created_at timestamptz not null default now(),

  constraint amount_positive check (amount > 0)
);

create index if not exists idx_payment_ledger_account on payment_ledger(account_id, created_at desc);
create index if not exists idx_payment_ledger_transaction on payment_ledger(transaction_id);
create index if not exists idx_payment_ledger_status on payment_ledger(status);
create index if not exists idx_payment_ledger_date_range on payment_ledger(created_at desc);

alter table payment_ledger enable row level security;

create policy "user_view_own_ledger"
on payment_ledger for select using (auth.uid() = account_id);

-- Audit: no one can delete ledger entries (immutable)
alter table payment_ledger disable trigger all;

-- ============================================
-- ESCROW LEDGER (Funds held during project)
-- ============================================

create table if not exists escrow_ledger (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  freelancer_id uuid not null references profiles(id) on delete cascade,
  client_id uuid not null references profiles(id) on delete cascade,
  amount decimal(10,2) not null,
  reason text not null check (reason in ('delivery_pending', 'dispute')),
  status text not null default 'held' check (status in ('held', 'released', 'disputed', 'refunded')),
  held_at timestamptz not null default now(),
  release_triggered_at timestamptz,
  released_at timestamptz,
  created_at timestamptz not null default now(),

  constraint amount_positive check (amount > 0)
);

create index if not exists idx_escrow_ledger_freelancer on escrow_ledger(freelancer_id, status);
create index if not exists idx_escrow_ledger_client on escrow_ledger(client_id, status);
create index if not exists idx_escrow_ledger_project on escrow_ledger(project_id);
create index if not exists idx_escrow_ledger_status on escrow_ledger(status);

alter table escrow_ledger enable row level security;

create policy "freelancer_view_own_escrow"
on escrow_ledger for select using (auth.uid() = freelancer_id);

create policy "client_view_own_escrow"
on escrow_ledger for select using (auth.uid() = client_id);

-- ============================================
-- ACCOUNT BALANCE (Cache for performance)
-- ============================================

create table if not exists account_balance (
  user_id uuid primary key references profiles(id) on delete cascade,
  available_balance decimal(10,2) not null default 0,
  held_balance decimal(10,2) not null default 0, -- escrow
  pending_balance decimal(10,2) not null default 0, -- waiting confirmation
  total_earned decimal(10,2) not null default 0,
  last_updated timestamptz not null default now(),

  constraint balance_positive check (available_balance >= 0 and held_balance >= 0 and pending_balance >= 0)
);

create index if not exists idx_account_balance_updated on account_balance(last_updated desc);

alter table account_balance enable row level security;

create policy "user_view_own_balance"
on account_balance for select using (auth.uid() = user_id);

-- ============================================
-- SAVED PAYMENT METHODS (One-click checkout)
-- ============================================

create table if not exists saved_payment_methods (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  token text not null, -- Mercado Pago token (encrypted)
  last_four text not null,
  brand text not null, -- Visa, Mastercard, etc
  is_default boolean not null default false,
  created_at timestamptz not null default now(),

  constraint unique_per_user_brand unique (user_id, last_four, brand)
);

create index if not exists idx_saved_payment_methods_user on saved_payment_methods(user_id);
create index if not exists idx_saved_payment_methods_default on saved_payment_methods(user_id) where is_default = true;

alter table saved_payment_methods enable row level security;

create policy "user_view_own_methods"
on saved_payment_methods for select using (auth.uid() = user_id);

create policy "user_manage_own_methods"
on saved_payment_methods for insert, update, delete using (auth.uid() = user_id);

-- ============================================
-- PAYOUTS (Withdrawal requests)
-- ============================================

create table if not exists payouts (
  id uuid primary key default gen_random_uuid(),
  freelancer_id uuid not null references profiles(id) on delete cascade,
  amount decimal(10,2) not null,
  method text not null check (method in ('pix', 'ted', 'stripe')),
  status text not null default 'pending' check (status in ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  external_reference text, -- Mercado Pago transfer ID
  failure_reason text,
  requested_at timestamptz not null default now(),
  processed_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),

  constraint amount_positive check (amount > 0)
);

create index if not exists idx_payouts_freelancer on payouts(freelancer_id, status);
create index if not exists idx_payouts_status on payouts(status);
create index if not exists idx_payouts_completed on payouts(completed_at desc) where status = 'completed';

alter table payouts enable row level security;

create policy "freelancer_view_own_payouts"
on payouts for select using (auth.uid() = freelancer_id);

-- ============================================
-- PAYMENT TRANSACTIONS (High-level tracking)
-- ============================================

create table if not exists payment_transactions (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references profiles(id) on delete cascade,
  project_id uuid not null references projects(id) on delete cascade,
  freelancer_id uuid not null references profiles(id) on delete cascade,
  amount decimal(10,2) not null,
  currency text not null default 'BRL',
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'failed', 'disputed', 'completed')),
  payment_method text not null, -- 'card', 'pix', 'ted'
  mercado_pago_preference_id text unique,
  mercado_pago_payment_id text unique,
  idempotency_key text unique not null,
  created_at timestamptz not null default now(),
  confirmed_at timestamptz,

  constraint amount_positive check (amount > 0)
);

create index if not exists idx_payment_transactions_client on payment_transactions(client_id, created_at desc);
create index if not exists idx_payment_transactions_project on payment_transactions(project_id);
create index if not exists idx_payment_transactions_status on payment_transactions(status);
create index if not exists idx_payment_transactions_idempotency on payment_transactions(idempotency_key);

alter table payment_transactions enable row level security;

create policy "user_view_own_transactions"
on payment_transactions for select using (
  auth.uid() = client_id or auth.uid() = freelancer_id
);

-- ============================================
-- FEE CONFIGURATION (Dynamic by category)
-- ============================================

create table if not exists fee_config (
  id uuid primary key default gen_random_uuid(),
  category_id int references categories(id),
  base_fee_percent decimal(5,2) not null, -- 2.50 = 2.5%
  subscription_discount_percent decimal(5,2) not null default 0.50, -- assinantes pagam menos
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint fee_percent_range check (base_fee_percent > 0 and base_fee_percent <= 100),
  constraint discount_range check (subscription_discount_percent >= 0 and subscription_discount_percent <= 100)
);

create index if not exists idx_fee_config_active on fee_config(active) where active = true;

insert into fee_config (category_id, base_fee_percent, subscription_discount_percent) values
  (null, 2.99, 0.50); -- default fee for all categories

-- ============================================
-- COMPLIANCE: Audit logging
-- ============================================

create table if not exists payment_audit_log (
  id uuid primary key default gen_random_uuid(),
  event_type text not null, -- 'payment_initiated', 'payment_confirmed', 'payout_requested', etc
  user_id uuid references profiles(id),
  transaction_id uuid,
  amount decimal(10,2),
  details jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_payment_audit_log_user on payment_audit_log(user_id, created_at desc);
create index if not exists idx_payment_audit_log_event on payment_audit_log(event_type);
create index if not exists idx_payment_audit_log_date on payment_audit_log(created_at desc);

alter table payment_audit_log enable row level security;

-- No one can read audit log except system
create policy "audit_log_system_only"
on payment_audit_log for select using (false);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Verify ledger is balanced (debit = credit)
create or replace function verify_ledger_balance(account_id uuid)
returns table(is_balanced boolean, debit_total numeric, credit_total numeric) as $$
  select
    sum(case when direction = 'debit' then amount else 0 end) =
    sum(case when direction = 'credit' then amount else 0 end) as is_balanced,
    sum(case when direction = 'debit' then amount else 0 end)::numeric as debit_total,
    sum(case when direction = 'credit' then amount else 0 end)::numeric as credit_total
  from payment_ledger
  where account_id = $1 and status = 'posted';
$$ language sql stable;

-- Get available balance for user
create or replace function get_available_balance(user_id uuid)
returns numeric as $$
  select coalesce(available_balance, 0)
  from account_balance
  where user_id = $1;
$$ language sql stable;

-- ============================================
-- INDEXES (Performance optimization)
-- ============================================

-- Ensure fast lookups
create index idx_payment_ledger_account_date on payment_ledger(account_id, created_at desc);
create index idx_escrow_status_date on escrow_ledger(status, held_at desc);
create index idx_payout_status_date on payouts(status, requested_at desc);
create index idx_transaction_status_date on payment_transactions(status, created_at desc);
