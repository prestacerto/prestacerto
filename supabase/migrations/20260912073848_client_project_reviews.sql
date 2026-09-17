-- Isolated rollout: preflight must confirm reviews is absent and the core schema
-- and RLS match this repository. Do not apply legacy 0002 with this migration.
begin;
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  target_id uuid not null references public.profiles(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comment text check (comment is null or char_length(comment) <= 2000),
  created_at timestamptz not null default now(),
  constraint reviews_one_client_review_per_project unique (project_id),
  constraint reviews_no_self_review check (author_id <> target_id)
);
create index reviews_target_created_at_idx on public.reviews (target_id, created_at desc);
alter table public.reviews enable row level security;
revoke all on public.reviews from public, anon, authenticated, service_role;
grant select on public.reviews to authenticated, service_role;
grant insert (project_id, author_id, target_id, rating, comment) on public.reviews to authenticated;

-- Relationship IDs stay private. Public pages use a server-only projection of
-- id/rating/comment/created_at, never author/project/contact data.
create policy reviews_participants_read on public.reviews
  for select to authenticated
  using (author_id = (select auth.uid()) or target_id = (select auth.uid()));
create policy reviews_completed_client_insert on public.reviews
  for insert to authenticated
  with check (
    author_id = (select auth.uid()) and author_id <> target_id
    and exists (
      select 1 from public.projects p
      where p.id = project_id and p.client_id = (select auth.uid()) and p.status = 'closed'
    )
    and exists (
      select 1 from public.proposals p
      where p.project_id = reviews.project_id and p.freelancer_id = target_id and p.status = 'accepted'
    )
  );

-- Keep verified state stable until insertion commits. INVOKER retains core RLS.
create function public.validate_client_project_review()
returns trigger language plpgsql security invoker set search_path = '' as $$
declare
  project_client uuid;
  project_status text;
  accepted_provider uuid;
begin
  if auth.uid() is null or new.author_id <> auth.uid() then
    raise exception 'Review author must be the authenticated client' using errcode = '42501';
  end if;
  select p.client_id, p.status into project_client, project_status
    from public.projects p where p.id = new.project_id for share;
  if project_client is distinct from auth.uid() or project_status is distinct from 'closed' then
    raise exception 'Review requires a completed project owned by the client' using errcode = '42501';
  end if;
  select p.freelancer_id into accepted_provider from public.proposals p
    where p.project_id = new.project_id and p.status = 'accepted' for share;
  if accepted_provider is null or accepted_provider <> new.target_id or new.target_id = auth.uid() then
    raise exception 'Review target must be the accepted provider' using errcode = '42501';
  end if;
  new.comment := nullif(btrim(new.comment), '');
  return new;
end;
$$;
revoke all on function public.validate_client_project_review() from public, anon, authenticated, service_role;
create trigger validate_client_project_review before insert on public.reviews
  for each row execute function public.validate_client_project_review();
-- No user UPDATE/DELETE grants and no synthetic or rounded profile aggregates.
notify pgrst, 'reload schema';
commit;
