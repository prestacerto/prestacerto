-- Migration: WhatsApp Integration
-- Date: 2026-08-07

-- ============================================
-- WHATSAPP INTERACTIONS
-- ============================================

create table if not exists whatsapp_interactions (
  id uuid primary key default gen_random_uuid(),
  phone_number text not null,
  user_message text not null,
  scope_analysis jsonb,
  freelancers_returned int default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_whatsapp_interactions_phone on whatsapp_interactions(phone_number);
create index if not exists idx_whatsapp_interactions_created on whatsapp_interactions(created_at desc);

alter table whatsapp_interactions enable row level security;

-- Proteger: só o próprio cliente (via whatsapp_users) vê suas interações
create policy "user_view_own_interactions"
on whatsapp_interactions for select using (
  exists (
    select 1 from whatsapp_users
    where whatsapp_users.phone_number = whatsapp_interactions.phone_number
      and whatsapp_users.user_id = auth.uid()
  )
);

-- Admin pode ver tudo (role check)
create policy "admin_view_all_interactions"
on whatsapp_interactions for select using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- ============================================
-- WHATSAPP USERS (Map phone to PrestaCerto user)
-- ============================================

create table if not exists whatsapp_users (
  id uuid primary key default gen_random_uuid(),
  phone_number text not null unique,
  user_id uuid references profiles(id) on delete cascade,
  first_interaction timestamptz not null default now(),
  last_interaction timestamptz,
  interaction_count int default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_whatsapp_users_phone on whatsapp_users(phone_number);
create index if not exists idx_whatsapp_users_user on whatsapp_users(user_id);

alter table whatsapp_users enable row level security;

-- ============================================
-- WHATSAPP CONVERSATIONS (Track ongoing chats)
-- ============================================

create table if not exists whatsapp_conversations (
  id uuid primary key default gen_random_uuid(),
  phone_number text not null,
  user_id uuid references profiles(id),
  status text not null default 'active' check (status in ('active', 'completed', 'archived')),
  scope_analysis jsonb,
  selected_freelancer_id uuid references profiles(id),
  conversation_context jsonb, -- Store conversation history for context
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  closed_at timestamptz
);

create index if not exists idx_whatsapp_conversations_phone on whatsapp_conversations(phone_number);
create index if not exists idx_whatsapp_conversations_user on whatsapp_conversations(user_id);
create index if not exists idx_whatsapp_conversations_status on whatsapp_conversations(status);

alter table whatsapp_conversations enable row level security;

-- ============================================
-- WHATSAPP METRICS (For analytics)
-- ============================================

create table if not exists whatsapp_metrics (
  id uuid primary key default gen_random_uuid(),
  date date not null unique,
  total_messages int default 0,
  total_users int default 0,
  successful_matches int default 0,
  avg_response_time_ms int default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_whatsapp_metrics_date on whatsapp_metrics(date desc);

alter table whatsapp_metrics enable row level security;

-- ============================================
-- PROJECT CONTACTS (para criar projeto via WhatsApp)
-- ============================================

create table if not exists project_contacts (
  project_id uuid primary key references projects(id) on delete cascade,
  contact_email text,
  contact_phone text,
  created_at timestamptz not null default now(),
  constraint at_least_one_contact check (contact_email is not null or contact_phone is not null)
);

alter table project_contacts enable row level security;

-- Cliente vê seu próprio contato
create policy "client_view_own_contact"
on project_contacts for select using (
  exists (
    select 1 from projects
    where projects.id = project_contacts.project_id
      and projects.client_id = auth.uid()
  )
);

-- Freelancer com proposta aceita vê o contato
create policy "accepted_freelancer_view_contact"
on project_contacts for select using (
  exists (
    select 1 from proposals
    where proposals.project_id = project_contacts.project_id
      and proposals.freelancer_id = auth.uid()
      and proposals.status = 'accepted'
  )
);
