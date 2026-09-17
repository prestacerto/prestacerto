-- 0042_assinify_subscriptions.sql
-- Assinaturas vindas do Assinify. A plataforma é webhook-only: não há API para
-- consultar o estado de uma assinatura, então guardamos aqui o que os eventos
-- informam.

begin;

-- Assinatura confirmada para um e-mail que ainda não tem conta. Quando a pessoa
-- se cadastrar com esse e-mail, o plano é aplicado pelo trigger abaixo.
create table if not exists public.pending_subscriptions (
  email text primary key,
  plan text not null default 'pro',
  subscription_id text,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.pending_subscriptions enable row level security;

-- Sem policies: a tabela é escrita apenas pelo webhook, que usa a service role
-- key e portanto ignora RLS. Nenhum cliente deve ler isto.

-- Ao criar o perfil, aplica uma assinatura que chegou antes do cadastro.
create or replace function public.apply_pending_subscription()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  pending public.pending_subscriptions%rowtype;
begin
  if new.email is null then
    return new;
  end if;

  select * into pending
  from public.pending_subscriptions
  where email = lower(new.email)
    and status = 'active';

  if found then
    new.plan := pending.plan;
    delete from public.pending_subscriptions where email = pending.email;
  end if;

  return new;
end;
$$;

drop trigger if exists apply_pending_subscription_on_profile on public.profiles;

create trigger apply_pending_subscription_on_profile
  before insert on public.profiles
  for each row
  execute function public.apply_pending_subscription();

commit;
