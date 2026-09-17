-- Certo Oportunidades uses existing projects/services. This table stores only
-- one opaque event per browser, freelancer and São Paulo calendar day.
create table if not exists public.profile_views (
  id uuid primary key default gen_random_uuid(),
  freelancer_id uuid not null references public.profiles(id) on delete cascade,
  viewer_ip_hash text not null check (viewer_ip_hash ~ '^[0-9a-f]{32}$'),
  viewed_at timestamptz not null default now()
);

alter table public.profile_views enable row level security;
revoke all on public.profile_views from anon, authenticated;
grant insert (freelancer_id, viewer_ip_hash) on public.profile_views to anon, authenticated;
grant all on public.profile_views to service_role;
grant select on public.profile_views to authenticated;

drop policy if exists "profile_views_public_insert" on public.profile_views;
create policy "profile_views_public_insert" on public.profile_views for insert to anon, authenticated with check (true);
drop policy if exists "profile_views_owner_read" on public.profile_views;
create policy "profile_views_owner_read" on public.profile_views for select to authenticated using (freelancer_id = auth.uid());

create index if not exists idx_profile_views_freelancer_date on public.profile_views(freelancer_id, viewed_at desc);
create unique index if not exists idx_profile_views_daily_visitor on public.profile_views(freelancer_id, viewer_ip_hash);

NOTIFY pgrst, 'reload schema';
