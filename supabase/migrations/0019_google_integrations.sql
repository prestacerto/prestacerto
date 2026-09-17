-- Google OAuth connections (Calendar + Drive via mesmo escopo)
create table if not exists google_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade unique,
  encrypted_access_token text not null,
  encrypted_refresh_token text not null,
  token_expiry timestamptz not null,
  google_email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table google_connections enable row level security;

create policy "google_connections_owner"
on google_connections for all
using (user_id = auth.uid())
with check (user_id = auth.uid());

-- Dados do Google criados por projeto (pasta Drive + eventos de agenda)
create table if not exists project_google_data (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade unique,
  drive_folder_id text,
  drive_folder_url text,
  client_calendar_event_id text,
  freelancer_calendar_event_id text,
  created_at timestamptz not null default now()
);

alter table project_google_data enable row level security;

-- Apenas participantes do projeto (cliente ou freela aceito) leem os dados
create policy "project_google_data_participant_read"
on project_google_data for select
using (
  exists (
    select 1 from projects p
    where p.id = project_id
      and (
        p.client_id = auth.uid()
        or exists (
          select 1 from proposals pr
          where pr.project_id = p.id
            and pr.freelancer_id = auth.uid()
            and pr.status = 'accepted'
        )
      )
  )
);
