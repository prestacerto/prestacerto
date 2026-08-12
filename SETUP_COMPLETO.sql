-- ============================================================
-- CERTO AI SETUP COMPLETO — Copie TUDO abaixo e cole no Supabase SQL Editor
-- ============================================================

-- ============================================================
-- 1. AI PROPOSALS (Certo AI Tables)
-- ============================================================

create table if not exists ai_optimizations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  action text not null,
  original_proposal text not null,
  optimized_proposal text,
  comparison_proposal_2 text,
  score integer,
  win_rate decimal(5,2),
  issues jsonb,
  suggestions jsonb,
  analysis jsonb,
  tokens_used integer default 0,
  cost_cents integer default 0,
  plan_type text default 'free',
  usage_count integer default 0,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table if not exists ai_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_type text not null,
  optimizations_used integer default 0,
  optimizations_limit integer default 3,
  monthly_cost_cents integer default 0,
  subscription_active boolean default false,
  subscription_start timestamp,
  subscription_end timestamp,
  stripe_subscription_id text,
  last_optimization timestamp,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table if not exists ai_insights (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  metric_type text not null,
  metric_value decimal(10,2),
  trend decimal(5,2),
  compared_to_avg decimal(10,2),
  period text default 'month',
  created_at timestamp default now()
);

-- ============================================================
-- 2. PUSH SUBSCRIPTIONS (Notificações)
-- ============================================================

create table if not exists push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  enabled boolean default true,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- ============================================================
-- 3. CLIENT PRODUCTS (Lado do Cliente)
-- ============================================================

create table if not exists screening_results (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references auth.users(id) on delete cascade,
  total_proposals integer,
  top_proposals jsonb,
  project_description text,
  time_saved_minutes integer,
  created_at timestamp default now()
);

create table if not exists hiring_verification (
  id uuid primary key default gen_random_uuid(),
  freelancer_id uuid not null references auth.users(id) on delete cascade,
  identity_verified boolean default false,
  projects_count integer default 0,
  win_rate decimal(5,2) default 0,
  avg_response_time integer default 0,
  avg_rating decimal(3,2) default 0,
  complaints_count integer default 0,
  verified_status text default 'unverified',
  verified_at timestamp,
  created_at timestamp default now()
);

create table if not exists client_analytics (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references auth.users(id) on delete cascade,
  project_id text,
  project_name text,
  completion_percentage integer default 0,
  status text,
  freelancer_id uuid,
  quality_score integer,
  cost_vs_budget decimal(5,2),
  expected_completion_date timestamp,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table if not exists trending_data (
  id uuid primary key default gen_random_uuid(),
  skill_name text,
  category text,
  demand_change decimal(5,2),
  avg_price decimal(10,2),
  projects_posted_week integer,
  freelancers_available integer,
  trend_strength text default 'moderate',
  week_date date,
  created_at timestamp default now()
);

create table if not exists verified_ratings (
  id uuid primary key default gen_random_uuid(),
  freelancer_id uuid not null references auth.users(id) on delete cascade,
  rating decimal(3,2),
  reviewer_id uuid,
  project_id text,
  is_verified boolean default false,
  verification_score integer,
  red_flags text[],
  created_at timestamp default now()
);

-- ============================================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================================

alter table ai_optimizations enable row level security;
alter table ai_usage enable row level security;
alter table ai_insights enable row level security;
alter table push_subscriptions enable row level security;
alter table screening_results enable row level security;
alter table hiring_verification enable row level security;
alter table client_analytics enable row level security;
alter table trending_data enable row level security;
alter table verified_ratings enable row level security;

-- ============================================================
-- RLS POLICIES
-- ============================================================

create policy "Users can view own ai_optimizations"
  on ai_optimizations for select
  using (auth.uid() = user_id);

create policy "Users can insert own ai_optimizations"
  on ai_optimizations for insert
  with check (auth.uid() = user_id);

create policy "Users can view own ai_usage"
  on ai_usage for select
  using (auth.uid() = user_id);

create policy "Users can view own ai_insights"
  on ai_insights for select
  using (auth.uid() = user_id);

create policy "Users can view own push_subscriptions"
  on push_subscriptions for select
  using (auth.uid() = user_id);

create policy "Users can manage own push_subscriptions"
  on push_subscriptions for insert, update, delete
  using (auth.uid() = user_id);

create policy "Clients can view own screening"
  on screening_results for select
  using (auth.uid() = client_id);

create policy "Freelancers can view own verification"
  on hiring_verification for select
  using (auth.uid() = freelancer_id);

create policy "Clients can view own analytics"
  on client_analytics for select
  using (auth.uid() = client_id);

create policy "Anyone can view trending"
  on trending_data for select
  using (true);

create policy "Freelancers can view their ratings"
  on verified_ratings for select
  using (auth.uid() = freelancer_id);

-- ============================================================
-- ✅ DONE! Copie e cole TODO acima no Supabase SQL Editor
-- ============================================================
