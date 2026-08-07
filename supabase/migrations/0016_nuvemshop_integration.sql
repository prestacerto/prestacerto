-- Migration: Integração Nuvemshop (app parceiro)
-- Token da Nuvemshop não expira (só é revogado na desinstalação), então não
-- há refresh_token aqui — mesmo padrão de expiração usado pelo provedor.

create table if not exists nuvemshop_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  store_id text not null unique,
  store_name text,
  access_token text not null, -- criptografado (AES-256-GCM, ver token-cipher.ts)
  scope text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_nuvemshop_connections_user on nuvemshop_connections(user_id);

alter table nuvemshop_connections enable row level security;

create policy "user_manages_own_nuvemshop_connection"
on nuvemshop_connections for all
using (user_id = auth.uid())
with check (user_id = auth.uid());
