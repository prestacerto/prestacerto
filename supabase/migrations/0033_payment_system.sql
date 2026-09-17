-- Payment transactions table
create table payment_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item_type text not null check (item_type in ('connects', 'priority', 'business', 'contest', 'ad')),
  amount numeric(10,2) not null,
  status text not null default 'pending' check (status in ('pending', 'processing', 'completed', 'failed', 'refunded')),
  mercado_pago_id text unique,
  metadata jsonb default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS on payment_transactions
alter table payment_transactions enable row level security;

-- Only users can see their own transactions
create policy "users_view_own_payments"
on payment_transactions for select
using (user_id = auth.uid());

-- Create index for faster lookups
create index payment_transactions_user_id_idx on payment_transactions(user_id);
create index payment_transactions_mercado_pago_id_idx on payment_transactions(mercado_pago_id);
create index payment_transactions_status_idx on payment_transactions(status);
create index payment_transactions_created_at_idx on payment_transactions(created_at);

-- Revenue aggregation view (for analytics)
create view monthly_revenue as
select
  date_trunc('month', created_at)::date as month,
  item_type,
  count(*) as transaction_count,
  sum(amount) as total_revenue,
  avg(amount) as avg_transaction
from payment_transactions
where status = 'completed'
group by date_trunc('month', created_at), item_type;

-- User revenue view (for dashboard)
create view user_revenue as
select
  user_id,
  count(*) as total_purchases,
  sum(amount) as total_spent,
  max(created_at) as last_purchase
from payment_transactions
where status = 'completed'
group by user_id;
