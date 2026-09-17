-- Garante leitura pública (role anon) nas tabelas que têm RLS "using (true)".
-- Sem isso o Supabase bloqueia queries de usuários não autenticados mesmo
-- com a política existindo.
grant select on public.categories to anon;
grant select on public.services to anon;
grant select on public.projects to anon;
grant select on public.profiles to anon;
grant select on public.reviews to anon;
grant select on public.portfolio_public to anon;
