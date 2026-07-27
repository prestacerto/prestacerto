-- PrestaCerto — schema inicial + RLS
-- Ver plano em .claude/plans (sessão de reconstrução saindo do Base44).

-- ============================================================
-- Extensões
-- ============================================================
create extension if not exists "pgcrypto";

-- ============================================================
-- profiles — estende auth.users (1:1)
-- ============================================================
create table profiles (
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

create policy "perfis são publicamente visíveis"
on profiles for select
using (true);

create policy "usuário cria seu próprio perfil"
on profiles for insert
with check (id = auth.uid());

create policy "usuário edita seu próprio perfil"
on profiles for update
using (id = auth.uid());

-- Cria profile automaticamente quando um usuário se registra
create function public.handle_new_user()
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
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- categories
-- ============================================================
create table categories (
  id serial primary key,
  slug text unique not null,
  name text not null,
  sort_order int not null default 0
);

alter table categories enable row level security;

create policy "categorias são publicamente visíveis"
on categories for select
using (true);

insert into categories (slug, name, sort_order) values
  ('desenvolvimento-web', 'Desenvolvimento Web', 1),
  ('mobile', 'Mobile', 2),
  ('design-grafico', 'Design Gráfico', 3),
  ('redacao-conteudo', 'Redação & Conteúdo', 4),
  ('traducao', 'Tradução', 5),
  ('marketing-digital', 'Marketing Digital', 6);

-- ============================================================
-- services — o que um freelancer oferece
-- ============================================================
create table services (
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

create policy "serviços ativos são publicamente visíveis"
on services for select
using (is_active = true or freelancer_id = auth.uid());

create policy "freelancer cria seus próprios serviços"
on services for insert
with check (freelancer_id = auth.uid());

create policy "freelancer edita seus próprios serviços"
on services for update
using (freelancer_id = auth.uid());

create policy "freelancer apaga seus próprios serviços"
on services for delete
using (freelancer_id = auth.uid());

-- ============================================================
-- projects — o que um cliente publica
-- ============================================================
create table projects (
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

create policy "projetos são publicamente visíveis"
on projects for select
using (true);

create policy "cliente cria seus próprios projetos"
on projects for insert
with check (client_id = auth.uid());

create policy "cliente edita seus próprios projetos"
on projects for update
using (client_id = auth.uid());

-- ============================================================
-- project_contacts — separada de `projects` de propósito.
-- É a peça-chave da revelação condicional de contato:
-- o SELECT público em `projects` nunca faz join com esta tabela,
-- então o dado nunca chega ao frontend de quem não tem permissão.
-- ============================================================
create table project_contacts (
  project_id uuid primary key references projects(id) on delete cascade,
  contact_email text,
  contact_phone text,
  constraint at_least_one_contact check (contact_email is not null or contact_phone is not null)
);

alter table project_contacts enable row level security;

create policy "contato visível para o dono do projeto"
on project_contacts for select
using (
  exists (
    select 1 from projects
    where projects.id = project_contacts.project_id
      and projects.client_id = auth.uid()
  )
);

create policy "contato visível para freelancer com proposta aceita"
on project_contacts for select
using (
  exists (
    select 1 from proposals
    where proposals.project_id = project_contacts.project_id
      and proposals.freelancer_id = auth.uid()
      and proposals.status = 'accepted'
  )
);

create policy "cliente cria o contato do seu próprio projeto"
on project_contacts for insert
with check (
  exists (
    select 1 from projects
    where projects.id = project_contacts.project_id
      and projects.client_id = auth.uid()
  )
);

create policy "cliente atualiza o contato do seu próprio projeto"
on project_contacts for update
using (
  exists (
    select 1 from projects
    where projects.id = project_contacts.project_id
      and projects.client_id = auth.uid()
  )
);

-- ============================================================
-- proposals — freelancer propõe pra um projeto
-- ============================================================
create table proposals (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  freelancer_id uuid not null references profiles(id) on delete cascade,
  message text not null,
  proposed_price numeric(10, 2),
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected', 'withdrawn')),
  created_at timestamptz not null default now(),
  unique (project_id, freelancer_id)
);

alter table proposals enable row level security;

create policy "freelancer vê e cria suas próprias propostas"
on proposals for select
using (freelancer_id = auth.uid());

create policy "cliente vê propostas dos seus projetos"
on proposals for select
using (
  exists (
    select 1 from projects
    where projects.id = proposals.project_id
      and projects.client_id = auth.uid()
  )
);

create policy "freelancer cria proposta em seu nome"
on proposals for insert
with check (freelancer_id = auth.uid());

create policy "freelancer retira sua própria proposta"
on proposals for update
using (freelancer_id = auth.uid())
with check (freelancer_id = auth.uid());

create policy "só o dono do projeto aceita/rejeita proposta"
on proposals for update
using (
  exists (
    select 1 from projects
    where projects.id = proposals.project_id
      and projects.client_id = auth.uid()
  )
);

-- ============================================================
-- messages — chat por proposta (não por projeto solto)
-- ============================================================
create table messages (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references proposals(id) on delete cascade,
  sender_id uuid not null references profiles(id),
  body text not null,
  created_at timestamptz not null default now(),
  read_at timestamptz
);

alter table messages enable row level security;

create policy "participantes da proposta veem as mensagens"
on messages for select
using (
  exists (
    select 1 from proposals
    where proposals.id = messages.proposal_id
      and (
        proposals.freelancer_id = auth.uid()
        or exists (
          select 1 from projects
          where projects.id = proposals.project_id
            and projects.client_id = auth.uid()
        )
      )
  )
);

create policy "participantes da proposta enviam mensagem"
on messages for insert
with check (
  sender_id = auth.uid()
  and exists (
    select 1 from proposals
    where proposals.id = messages.proposal_id
      and (
        proposals.freelancer_id = auth.uid()
        or exists (
          select 1 from projects
          where projects.id = proposals.project_id
            and projects.client_id = auth.uid()
        )
      )
  )
);

-- ============================================================
-- plan_interest_leads — captura "Avise-me" (Pro/Business "Em breve")
-- ============================================================
create table plan_interest_leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  plan text not null check (plan in ('pro', 'business')),
  created_at timestamptz not null default now()
);

alter table plan_interest_leads enable row level security;

create policy "qualquer um pode se cadastrar na lista de espera"
on plan_interest_leads for insert
with check (true);

-- ============================================================
-- contact_messages — formulário de /contato
-- ============================================================
create table contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  created_at timestamptz not null default now()
);

alter table contact_messages enable row level security;

create policy "qualquer um pode enviar mensagem de contato"
on contact_messages for insert
with check (true);

-- ============================================================
-- Índices de apoio
-- ============================================================
create index services_category_idx on services (category_id);
create index services_freelancer_idx on services (freelancer_id);
create index projects_category_idx on projects (category_id);
create index projects_client_idx on projects (client_id);
create index proposals_project_idx on proposals (project_id);
create index proposals_freelancer_idx on proposals (freelancer_id);
create index messages_proposal_idx on messages (proposal_id);
