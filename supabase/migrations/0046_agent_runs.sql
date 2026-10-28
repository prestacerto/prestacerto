-- Migration: 0043_agent_runs.sql
-- Purpose: Create tables for tracking scheduled agent runs and their execution history

create type agent_run_status as enum ('pending', 'running', 'completed', 'failed');

create table agent_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  config_id uuid not null references sales_agent_configs(id) on delete cascade,
  status agent_run_status default 'pending',
  started_at timestamp with time zone,
  completed_at timestamp with time zone,
  error_message text,
  leads_discovered integer default 0,
  leads_qualified integer default 0,
  messages_sent integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table agent_run_logs (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references agent_runs(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  log_type text not null, -- 'prospect_found', 'message_sent', 'error', 'info'
  message text not null,
  prospect_id uuid references sales_agent_leads(id),
  created_at timestamp with time zone default now()
);

create table agent_schedules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  config_id uuid not null references sales_agent_configs(id) on delete cascade,
  frequency text not null, -- 'daily', 'weekly', 'twice-weekly'
  day_of_week integer, -- 0-6 for weekly (0 = Sunday)
  time_of_day time not null,
  is_active boolean default true,
  last_run_at timestamp with time zone,
  next_run_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Indexes for performance
create index idx_agent_runs_user_id on agent_runs(user_id);
create index idx_agent_runs_status on agent_runs(status);
create index idx_agent_run_logs_run_id on agent_run_logs(run_id);
create index idx_agent_schedules_user_id on agent_schedules(user_id);
create index idx_agent_schedules_next_run on agent_schedules(next_run_at);

-- RLS Policies
alter table agent_runs enable row level security;
alter table agent_run_logs enable row level security;
alter table agent_schedules enable row level security;

-- Users can only view/manage their own runs
create policy "Users can view own agent runs"
  on agent_runs for select
  using (auth.uid() = user_id);

create policy "Users can insert own agent runs"
  on agent_runs for insert
  with check (auth.uid() = user_id);

create policy "Users can update own agent runs"
  on agent_runs for update
  using (auth.uid() = user_id);

-- Users can only view/manage their own run logs
create policy "Users can view own run logs"
  on agent_run_logs for select
  using (auth.uid() = user_id);

create policy "Users can insert own run logs"
  on agent_run_logs for insert
  with check (auth.uid() = user_id);

-- Users can only view/manage their own schedules
create policy "Users can view own schedules"
  on agent_schedules for select
  using (auth.uid() = user_id);

create policy "Users can insert own schedules"
  on agent_schedules for insert
  with check (auth.uid() = user_id);

create policy "Users can update own schedules"
  on agent_schedules for update
  using (auth.uid() = user_id);

create policy "Users can delete own schedules"
  on agent_schedules for delete
  using (auth.uid() = user_id);
