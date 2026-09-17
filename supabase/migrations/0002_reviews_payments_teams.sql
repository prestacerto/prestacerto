-- PrestaCerto — avaliações, pagamento via Mercado Pago (split payment) e times do plano Business.
-- Rode depois de 0001_init.sql (SQL Editor > New query, ou `supabase db push`).

-- ============================================================
-- profiles — rating agregado do freelancer (nível de perfil, não de
-- serviço: um projeto não está ligado a um `service` específico, então a
-- avaliação de "como foi trabalhar com essa pessoa" vive no profile).
-- ============================================================
alter table profiles add column rating numeric(2, 1);
alter table profiles add column rating_count int not null default 0;

-- ============================================================
-- reviews — avaliação de uma parte sobre a outra ao final de um projeto.
-- ============================================================
create table reviews (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  author_id uuid not null references profiles(id) on delete cascade,
  target_id uuid not null references profiles(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  unique (project_id, author_id),
  constraint reviews_author_not_target check (author_id <> target_id)
);

alter table reviews enable row level security;

create policy "avaliações são publicamente visíveis"
on reviews for select
using (true);

create policy "participante do projeto encerrado avalia a outra parte"
on reviews for insert
with check (
  author_id = auth.uid()
  and exists (
    select 1 from projects
    where projects.id = reviews.project_id
      and projects.status = 'closed'
      and (
        (projects.client_id = auth.uid() and target_id in (
          select freelancer_id from proposals
          where proposals.project_id = projects.id and proposals.status = 'accepted'
        ))
        or (
          auth.uid() in (
            select freelancer_id from proposals
            where proposals.project_id = projects.id and proposals.status = 'accepted'
          )
          and target_id = projects.client_id
        )
      )
  )
);

create or replace function public.handle_new_review()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  update profiles
  set
    rating_count = rating_count + 1,
    rating = round(
      (coalesce(rating, 0) * rating_count + new.rating)::numeric / (rating_count + 1),
      1
    )
  where id = new.target_id;
  return new;
end;
$$;

create trigger on_review_created
  after insert on reviews
  for each row execute procedure public.handle_new_review();

create index reviews_target_idx on reviews (target_id);

-- ============================================================
-- mp_connections — conta Mercado Pago conectada de um freelancer (OAuth),
-- usada pra criar preferences de split payment em nome dele. O dinheiro do
-- cliente vai direto pra essa conta — a PrestaCerto nunca recebe/retém.
-- ============================================================
create table mp_connections (
  freelancer_id uuid primary key references profiles(id) on delete cascade,
  mp_user_id text not null,
  access_token text not null,
  refresh_token text not null,
  public_key text,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table mp_connections enable row level security;

create policy "freelancer vê a própria conexão MP"
on mp_connections for select
using (freelancer_id = auth.uid());

create policy "freelancer gerencia a própria conexão MP"
on mp_connections for all
using (freelancer_id = auth.uid())
with check (freelancer_id = auth.uid());

-- ============================================================
-- payments — status do pagamento (split payment MP) de uma proposta
-- aceita. Escrito pelo backend com a service role (checkout + webhook),
-- por isso não tem policy de insert/update aqui.
-- ============================================================
create table payments (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null unique references proposals(id) on delete cascade,
  project_id uuid not null references projects(id) on delete cascade,
  client_id uuid not null references profiles(id) on delete cascade,
  freelancer_id uuid not null references profiles(id) on delete cascade,
  amount numeric(10, 2) not null,
  status text not null default 'pending' check (
    status in ('pending', 'approved', 'rejected', 'in_process', 'refunded')
  ),
  mp_preference_id text,
  mp_payment_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table payments enable row level security;

create policy "pagamento visível para as partes"
on payments for select
using (client_id = auth.uid() or freelancer_id = auth.uid());

create index payments_project_idx on payments (project_id);
create index payments_mp_payment_id_idx on payments (mp_payment_id);

-- ============================================================
-- teams / team_invites — plano Business: até 5 pessoas por equipe.
-- ============================================================
create table teams (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique references profiles(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

alter table profiles add column team_id uuid references teams(id) on delete set null;

alter table teams enable row level security;

create policy "dono e membros veem a própria equipe"
on teams for select
using (
  owner_id = auth.uid()
  or id in (select team_id from profiles where profiles.id = auth.uid())
);

create policy "dono cria a própria equipe"
on teams for insert
with check (
  owner_id = auth.uid()
  and exists (select 1 from profiles where profiles.id = auth.uid() and profiles.plan = 'business')
);

create policy "dono edita a própria equipe"
on teams for update
using (owner_id = auth.uid());

create table team_invites (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references teams(id) on delete cascade,
  email text not null,
  token uuid not null default gen_random_uuid(),
  status text not null default 'pending' check (status in ('pending', 'accepted', 'revoked')),
  invited_by uuid not null references profiles(id),
  created_at timestamptz not null default now()
);

alter table team_invites enable row level security;

create policy "dono da equipe gerencia os convites"
on team_invites for all
using (
  team_id in (select id from teams where teams.owner_id = auth.uid())
)
with check (
  team_id in (select id from teams where teams.owner_id = auth.uid())
);

create index team_invites_team_idx on team_invites (team_id);
create index profiles_team_idx on profiles (team_id);
