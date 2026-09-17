-- Migration: Urgent Request Priority Feature
-- Date: 2026-08-07

-- ============================================
-- URGENT REQUESTS (projects com prioridade)
-- ============================================

alter table projects add column if not exists urgency text default 'normal' check (urgency in ('normal', 'urgent', 'critical'));
alter table projects add column if not exists urgent_fee numeric(10,2) default 0;
alter table projects add column if not exists urgent_fee_paid boolean default false;

-- Index pra filtrar urgentes rápido
create index if not exists idx_projects_urgency on projects(urgency, created_at desc) where urgency != 'normal';

-- ============================================
-- GUARANTEE BADGE (cliente com garantia)
-- ============================================

alter table projects add column if not exists has_guarantee boolean default false;
alter table projects add column if not exists guarantee_fee numeric(10,2) default 0;
alter table projects add column if not exists guarantee_fee_paid boolean default false;

create index if not exists idx_projects_guarantee on projects(has_guarantee) where has_guarantee = true;

-- ============================================
-- ESCROW MILESTONES (pagamento em etapas)
-- ============================================

create table if not exists project_milestones (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  title text not null,
  description text,
  amount numeric(10,2) not null,
  status text not null default 'pending' check (status in ('pending', 'released', 'disputed', 'refunded')),
  order_num int not null,
  due_date timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_milestones_project on project_milestones(project_id);
create index if not exists idx_milestones_status on project_milestones(status);

alter table project_milestones enable row level security;

-- Client vê seus milestones
create policy "client_view_own_milestones"
on project_milestones for select using (
  exists (
    select 1 from projects
    where projects.id = project_milestones.project_id
      and projects.client_id = auth.uid()
  )
);

-- Freelancer aceito vê milestones do projeto
create policy "freelancer_view_accepted_milestones"
on project_milestones for select using (
  exists (
    select 1 from proposals
    join projects on projects.id = proposals.project_id
    where proposals.project_id = project_milestones.project_id
      and proposals.freelancer_id = auth.uid()
      and proposals.status = 'accepted'
  )
);

-- ============================================
-- MONETIZATION LOG (track todas as taxas extras)
-- ============================================

create table if not exists monetization_transactions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id),
  transaction_type text not null check (transaction_type in ('urgent_fee', 'guarantee_fee', 'milestone_release')),
  amount numeric(10,2) not null,
  status text not null default 'pending' check (status in ('pending', 'completed', 'refunded')),
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists idx_monetization_project on monetization_transactions(project_id);
create index if not exists idx_monetization_type on monetization_transactions(transaction_type);
create index if not exists idx_monetization_status on monetization_transactions(status);

alter table monetization_transactions enable row level security;

-- Admin vê tudo
create policy "admin_view_monetization"
on monetization_transactions for select using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
