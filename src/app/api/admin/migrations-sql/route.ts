import { NextResponse } from "next/server";

export async function GET() {
  const sql = `create extension if not exists "pgcrypto";

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('freelancer', 'client', 'both')),
  full_name text not null,
  city text,
  state text,
  bio text,
  avatar_url text,
  contact_email text,
  contact_phone text,
  plan text not null default 'free' check (plan in ('free', 'pro', 'business')),
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy if not exists "perfis são publicamente visíveis"
on profiles for select using (true);

create policy if not exists "usuário cria seu próprio perfil"
on profiles for insert with check (id = auth.uid());

create policy if not exists "usuário edita seu próprio perfil"
on profiles for update using (id = auth.uid());

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'role', 'client'),
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email)
  )
  on conflict do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create table if not exists categories (
  id serial primary key,
  slug text unique not null,
  name text not null,
  sort_order int not null default 0
);

alter table categories enable row level security;

create policy if not exists "categorias são publicamente visíveis"
on categories for select using (true);

insert into categories (slug, name, sort_order) values
  ('desenvolvimento-web', 'Desenvolvimento Web', 1),
  ('mobile', 'Mobile', 2),
  ('design-grafico', 'Design Gráfico', 3),
  ('redacao-conteudo', 'Redação & Conteúdo', 4),
  ('traducao', 'Tradução', 5),
  ('marketing-digital', 'Marketing Digital', 6)
on conflict (slug) do nothing;

create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  freelancer_id uuid not null references profiles(id) on delete cascade,
  category_id int references categories(id),
  title text not null,
  description text not null,
  skills text[] not null default '{}',
  price_hour numeric(10, 2),
  delivery_days int,
  rating numeric(2, 1),
  rating_count int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table services enable row level security;

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references profiles(id) on delete cascade,
  category_id int references categories(id),
  title text not null,
  description text not null,
  skills text[] not null default '{}',
  budget_min numeric(10, 2),
  budget_max numeric(10, 2),
  deadline_days int,
  status text not null default 'open' check (status in ('open', 'in_progress', 'closed', 'cancelled')),
  created_at timestamptz not null default now()
);

alter table projects enable row level security;

create table if not exists proposals (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  freelancer_id uuid not null references profiles(id) on delete cascade,
  message text not null,
  proposed_price numeric(10, 2),
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  unique (project_id, freelancer_id)
);

alter table proposals enable row level security;

create table if not exists project_contacts (
  project_id uuid primary key references projects(id) on delete cascade,
  contact_email text,
  contact_phone text
);

alter table project_contacts enable row level security;

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references proposals(id) on delete cascade,
  sender_id uuid not null references profiles(id),
  body text not null,
  created_at timestamptz not null default now()
);

alter table messages enable row level security;`;

  return NextResponse.json({
    sql,
    instructions: "Copy this SQL and paste it into Supabase Console > SQL Editor > Run",
  });
}
