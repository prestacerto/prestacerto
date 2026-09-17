-- Campos extras no perfil pra humanização: headline (tagline curto) + currículo PDF
alter table profiles add column if not exists headline text;
alter table profiles add column if not exists resume_url text;

-- Bucket de avatars (fotos de perfil)
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "avatars_public_read"
on storage.objects for select
using (bucket_id = 'avatars');

create policy "avatars_owner_upload"
on storage.objects for insert
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "avatars_owner_update"
on storage.objects for update
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "avatars_owner_delete"
on storage.objects for delete
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Bucket de currículos PDF
insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', true)
on conflict (id) do nothing;

create policy "resumes_public_read"
on storage.objects for select
using (bucket_id = 'resumes');

create policy "resumes_owner_upload"
on storage.objects for insert
with check (
  bucket_id = 'resumes'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "resumes_owner_update"
on storage.objects for update
using (
  bucket_id = 'resumes'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "resumes_owner_delete"
on storage.objects for delete
using (
  bucket_id = 'resumes'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Contador de views no perfil público (anônimo, pra mostrar no dashboard)
create table if not exists profile_views (
  id uuid primary key default gen_random_uuid(),
  freelancer_id uuid not null references profiles(id) on delete cascade,
  viewer_ip_hash text,
  viewed_at timestamptz not null default now()
);

create index if not exists idx_profile_views_freelancer_date
  on profile_views(freelancer_id, viewed_at desc);

alter table profile_views enable row level security;

-- Freela lê só as próprias views
create policy "profile_views_owner_read"
on profile_views for select
using (freelancer_id = auth.uid());

-- Inserção pública (anon + auth) — sem auth.uid() check aqui pra permitir visitantes
create policy "profile_views_public_insert"
on profile_views for insert
with check (true);
