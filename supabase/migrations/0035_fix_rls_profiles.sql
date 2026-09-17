-- Migration: Corrigir RLS de profiles pra permitir login
-- Problema: Permission denied on profiles table

-- 1. Adicionar coluna is_active se não existir
alter table profiles add column if not exists is_active boolean default true;

-- 2. Remover políticas antigas que podem estar quebradas
drop policy if exists "Users can read own profile" on profiles;
drop policy if exists "Users can update own profile" on profiles;
drop policy if exists "Users can insert own profile" on profiles;
drop policy if exists "Public profiles are readable" on profiles;

-- 3. Criar novas políticas mais permissivas
create policy "authenticated_read_own_profile"
on profiles for select
to authenticated
using (auth.uid() = id);

create policy "authenticated_update_own_profile"
on profiles for update
to authenticated
using (auth.uid() = id);

create policy "authenticated_insert_own_profile"
on profiles for insert
to authenticated
with check (auth.uid() = id);

-- 4. Permitir leitura pública de perfis ativos
create policy "public_read_active_profiles"
on profiles for select
to public, authenticated
using (is_active = true);

-- 5. Garantir que todos os perfis existentes estão como is_active = true
update profiles set is_active = true where is_active is null or is_active = false;

-- 6. Verificar estrutura
-- select count(*) from profiles;
-- select is_active, count(*) from profiles group by is_active;
