-- Migration: Conectar/Propostas Limitadas (Core Monetization)
-- R$ 600k/ano revenue

create table if not exists user_connects_quota (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  connects_available int not null default 5, -- Free tier: 5 propostas/mês
  connects_used int not null default 0,
  last_reset_date timestamptz not null default now(),
  reset_cycle_days int default 30, -- Mensal
  tier text not null default 'free' check (tier in ('free', 'pro', 'business')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id)
);

create index if not exists idx_connects_quota_user on user_connects_quota(user_id);

alter table user_connects_quota enable row level security;

create policy "user_view_own_connects"
on user_connects_quota for select using (user_id = auth.uid());

create policy "user_update_own_connects"
on user_connects_quota for update using (user_id = auth.uid());

-- Registra quando um usuário usa um conectar
create table if not exists connects_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  proposal_id uuid references proposals(id) on delete cascade,
  connects_spent int not null default 1,
  transaction_type text not null check (transaction_type in ('proposal_sent', 'refund', 'purchase')),
  reason text,
  created_at timestamptz not null default now()
);

create index if not exists idx_connects_tx_user on connects_transactions(user_id);
create index if not exists idx_connects_tx_type on connects_transactions(transaction_type);
create index if not exists idx_connects_tx_date on connects_transactions(created_at desc);

alter table connects_transactions enable row level security;

create policy "user_view_own_transactions"
on connects_transactions for select using (user_id = auth.uid());

-- Planos de conectares (compra adicional)
create table if not exists connects_packages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  connects_amount int not null,
  price numeric(10,2) not null,
  is_active boolean default true,
  created_at timestamptz not null default now()
);

insert into connects_packages (name, connects_amount, price) values
  ('10 Conectares', 10, 19.90),
  ('25 Conectares', 25, 39.90),
  ('50 Conectares', 50, 69.90),
  ('100 Conectares', 100, 129.90),
  ('Ilimitado (30d)', 9999, 199.90) -- Pseudo-ilimitado por 30 dias
on conflict do nothing;

-- Transações de compra
create table if not exists connects_purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  package_id uuid not null references connects_packages(id),
  connects_amount int not null,
  price numeric(10,2) not null,
  mp_order_id text,
  status text not null default 'pending' check (status in ('pending', 'completed', 'refunded')),
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists idx_connects_purchases_user on connects_purchases(user_id);
create index if not exists idx_connects_purchases_status on connects_purchases(status);

alter table connects_purchases enable row level security;

create policy "user_view_own_purchases"
on connects_purchases for select using (user_id = auth.uid());

-- Função pra resetar connects mensalmente
create or replace function reset_monthly_connects()
returns void as $$
begin
  update user_connects_quota
  set
    connects_available = case
      when tier = 'free' then 5
      when tier = 'pro' then 50
      when tier = 'business' then 999
      else 5
    end,
    connects_used = 0,
    last_reset_date = now()
  where
    (now() - last_reset_date) > interval '30 days'
    or last_reset_date is null;
end;
$$ language plpgsql;

-- Função pra gastar um conectar
create or replace function spend_connect(p_user_id uuid, p_proposal_id uuid = null)
returns boolean as $$
declare
  v_available int;
  v_used int;
begin
  -- Resetar se necessário
  perform reset_monthly_connects();

  -- Verificar disponibilidade
  select connects_available - connects_used into v_available
  from user_connects_quota
  where user_id = p_user_id;

  if v_available <= 0 then
    return false;
  end if;

  -- Gastar 1 conectar
  update user_connects_quota
  set
    connects_used = connects_used + 1,
    updated_at = now()
  where user_id = p_user_id;

  -- Registrar transação
  insert into connects_transactions (user_id, proposal_id, connects_spent, transaction_type)
  values (p_user_id, p_proposal_id, 1, 'proposal_sent');

  return true;
end;
$$ language plpgsql;

-- Trigger pra criar quota ao se registrar
create or replace function create_connects_quota_on_signup()
returns trigger as $$
begin
  insert into user_connects_quota (user_id, connects_available, tier)
  values (new.id, 5, 'free')
  on conflict (user_id) do nothing;
  return new;
end;
$$ language plpgsql;

drop trigger if exists on_profile_created on profiles;
create trigger on_profile_created
after insert on profiles
for each row
execute function create_connects_quota_on_signup();

-- Adicionar coluna em proposals pra rastrear se usou conectar
alter table proposals add column if not exists used_connect boolean default false;
alter table proposals add column if not exists connect_purchase_id uuid references connects_purchases(id);
