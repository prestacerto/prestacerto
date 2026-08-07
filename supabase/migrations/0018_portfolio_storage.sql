-- Bucket de storage pra imagens de portfólio/case do freelancer.
-- Público pra leitura (é conteúdo de vitrine, igual foto de perfil),
-- mas só o dono pode enviar/apagar a própria imagem.

insert into storage.buckets (id, name, public)
values ('portfolio-images', 'portfolio-images', true)
on conflict (id) do nothing;

create policy "portfolio_images_public_read"
on storage.objects for select
using (bucket_id = 'portfolio-images');

create policy "portfolio_images_owner_upload"
on storage.objects for insert
with check (
  bucket_id = 'portfolio-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "portfolio_images_owner_delete"
on storage.objects for delete
using (
  bucket_id = 'portfolio-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Casos/trabalhos do freelancer, com foto — alimenta tanto o portfólio
-- público (/@slug) quanto o feed de exploração visual.
create table if not exists portfolio_items (
  id uuid primary key default gen_random_uuid(),
  freelancer_id uuid not null references profiles(id) on delete cascade,
  image_url text not null,
  title text not null,
  description text,
  category_id int references categories(id),
  is_public boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_portfolio_items_freelancer on portfolio_items(freelancer_id);
create index if not exists idx_portfolio_items_public on portfolio_items(is_public, created_at desc);

alter table portfolio_items enable row level security;

create policy "portfolio_items_public_read"
on portfolio_items for select
using (is_public = true);

create policy "portfolio_items_owner_manage"
on portfolio_items for all
using (freelancer_id = auth.uid())
with check (freelancer_id = auth.uid());
