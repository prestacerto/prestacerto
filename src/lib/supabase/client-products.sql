-- Client Products Tables

-- Screening Results
create table if not exists screening_results (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references auth.users(id) on delete cascade,
  total_proposals integer,
  top_proposals jsonb, -- [{ freelancer_id, score, reason, verdict }]
  project_description text,
  time_saved_minutes integer,
  created_at timestamp default now()
);

-- Hiring Verification
create table if not exists hiring_verification (
  id uuid primary key default gen_random_uuid(),
  freelancer_id uuid not null references auth.users(id) on delete cascade,
  identity_verified boolean default false,
  projects_count integer default 0,
  win_rate decimal(5,2) default 0,
  avg_response_time integer default 0, -- em horas
  avg_rating decimal(3,2) default 0,
  complaints_count integer default 0,
  verified_status text default 'unverified', -- 'unverified' | 'verified' | 'red_flag'
  verified_at timestamp,
  created_at timestamp default now()
);

-- Client Analytics Events
create table if not exists client_analytics (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references auth.users(id) on delete cascade,
  project_id text,
  project_name text,
  completion_percentage integer default 0,
  status text, -- 'in_progress' | 'at_risk' | 'on_track' | 'completed'
  freelancer_id uuid,
  quality_score integer,
  cost_vs_budget decimal(5,2), -- % (100 = on budget)
  expected_completion_date timestamp,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Trending Projects/Skills
create table if not exists trending_data (
  id uuid primary key default gen_random_uuid(),
  skill_name text,
  category text, -- 'skill' | 'project_type'
  demand_change decimal(5,2), -- +340%, -15%
  avg_price decimal(10,2),
  projects_posted_week integer,
  freelancers_available integer,
  trend_strength text default 'moderate', -- 'low' | 'moderate' | 'high' | 'explosive'
  week_date date,
  created_at timestamp default now()
);

-- Verified Ratings
create table if not exists verified_ratings (
  id uuid primary key default gen_random_uuid(),
  freelancer_id uuid not null references auth.users(id) on delete cascade,
  rating decimal(3,2),
  reviewer_id uuid,
  project_id text,
  is_verified boolean default false,
  verification_score integer, -- 0-100 (confiança da rating)
  red_flags text[], -- ['possible_fake', 'inconsistent_with_history']
  created_at timestamp default now()
);

-- RLS
alter table screening_results enable row level security;
alter table hiring_verification enable row level security;
alter table client_analytics enable row level security;
alter table trending_data enable row level security;
alter table verified_ratings enable row level security;

-- Client Policies
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
