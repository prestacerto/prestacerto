-- 0036_auto_create_profile.sql
-- Cria/ajusta o perfil automaticamente após INSERT em auth.users.
-- A função é SECURITY DEFINER para não depender das permissões RLS do visitante.

begin;

-- A instalação inicial de profiles não tinha email; instalações que passaram
-- pela migration 0034 podem já ter esta coluna. O IF NOT EXISTS cobre os dois casos.
alter table public.profiles
  add column if not exists email text;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  profile_role text;
  profile_name text;
  referrer_id uuid;
  raw_referrer_id text;
begin
  profile_role := case
    when new.raw_user_meta_data ->> 'role' in ('freelancer', 'client', 'both')
      then new.raw_user_meta_data ->> 'role'
    else 'freelancer'
  end;

  profile_name := coalesce(
    nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
    nullif(trim(split_part(coalesce(new.email, ''), '@', 1)), ''),
    'Novo usuário'
  );

  insert into public.profiles (id, email, role, full_name, plan)
  values (
    new.id,
    lower(nullif(trim(new.email), '')),
    profile_role,
    profile_name,
    'free'
  )
  on conflict (id) do nothing;

  -- Atribui uma indicação direta quando o cadastro veio de um link pessoal.
  -- A validação evita que metadata inválido interrompa o cadastro.
  raw_referrer_id := nullif(trim(new.raw_user_meta_data ->> 'referrer_id'), '');

  if raw_referrer_id is not null then
    -- Links normais usam um código público; UUID é aceito para compatibilidade
    -- com links antigos já distribuídos.
    select rc.user_id
      into referrer_id
      from public.referral_codes rc
     where rc.code = raw_referrer_id
     limit 1;

    if referrer_id is null and raw_referrer_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$' then
      referrer_id := raw_referrer_id::uuid;
    end if;

    if referrer_id is not null and referrer_id <> new.id then
      insert into public.referrals (
        referrer_id,
        referee_id,
        action_type,
        reward,
        status
      )
      values (
        referrer_id,
        new.id,
        'first_project',
        49.90,
        'pending'
      )
      on conflict (referee_id) do nothing;
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

-- Corrige contas criadas antes do trigger ou durante uma falha de setup.
-- Nunca sobrescreve um perfil existente.
insert into public.profiles (id, email, role, full_name, plan)
select
  u.id,
  lower(nullif(trim(u.email), '')),
  case
    when u.raw_user_meta_data ->> 'role' in ('freelancer', 'client', 'both')
      then u.raw_user_meta_data ->> 'role'
    else 'freelancer'
  end,
  coalesce(
    nullif(trim(u.raw_user_meta_data ->> 'full_name'), ''),
    nullif(trim(split_part(coalesce(u.email, ''), '@', 1)), ''),
    'Novo usuário'
  ),
  'free'
from auth.users u
where not exists (
  select 1
  from public.profiles p
  where p.id = u.id
);

commit;
