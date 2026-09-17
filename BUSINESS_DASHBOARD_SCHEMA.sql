-- ============================================================
-- BUSINESS DASHBOARD + ENGAGEMENT FEATURES
-- Complete schema for transactions, proposals, rankings, and engagement
-- ============================================================

-- ============================================================
-- 1. BUSINESS TRACKING TABLES
-- ============================================================

-- Transactions: Every accepted project becomes a transaction
create table if not exists business_transactions (
  id uuid primary key default gen_random_uuid(),
  freelancer_id uuid not null references auth.users(id) on delete cascade,
  client_id uuid not null references auth.users(id) on delete cascade,
  project_id text,
  project_title text not null,
  amount_cents integer not null,
  status text default 'active', -- active, completed, disputed, refunded
  category text, -- web-dev, design, writing, etc
  city text,
  created_at timestamp default now(),
  completed_at timestamp,
  updated_at timestamp default now()
);

-- Proposals: Track all proposals sent and their outcomes
create table if not exists proposal_tracking (
  id uuid primary key default gen_random_uuid(),
  freelancer_id uuid not null references auth.users(id) on delete cascade,
  project_id text,
  project_title text,
  client_id uuid,
  amount_cents integer,
  status text default 'sent', -- sent, viewed, accepted, rejected, withdrawn
  response_time_hours integer,
  created_at timestamp default now(),
  viewed_at timestamp,
  accepted_at timestamp,
  rejected_at timestamp,
  updated_at timestamp default now()
);

-- Revenue Reports: Aggregated by week/month
create table if not exists revenue_reports (
  id uuid primary key default gen_random_uuid(),
  freelancer_id uuid not null references auth.users(id) on delete cascade,
  period text not null, -- 'week' or 'month'
  period_start date not null,
  period_end date not null,
  total_revenue_cents integer default 0,
  completed_projects integer default 0,
  avg_project_value_cents integer default 0,
  growth_percent decimal(5,2) default 0, -- vs previous period
  created_at timestamp default now()
);

-- ============================================================
-- 2. ENGAGEMENT TRACKING TABLES
-- ============================================================

-- Profile Visits: Track who visits and when
create table if not exists profile_visits (
  id uuid primary key default gen_random_uuid(),
  profile_owner_id uuid not null references auth.users(id) on delete cascade,
  visitor_id uuid references auth.users(id),
  visitor_type text default 'anonymous', -- authenticated or anonymous
  created_at timestamp default now()
);

-- Freelancer Rankings: Weekly ranking by city
create table if not exists freelancer_rankings (
  id uuid primary key default gen_random_uuid(),
  freelancer_id uuid not null references auth.users(id) on delete cascade,
  city text not null,
  week_start date not null,
  week_end date not null,
  visits_count integer default 0,
  rank_position integer,
  previous_rank_position integer,
  trending_direction text, -- 'up', 'down', 'stable'
  created_at timestamp default now()
);

-- Response Metrics: Track response times and rates
create table if not exists response_metrics (
  id uuid primary key default gen_random_uuid(),
  freelancer_id uuid not null references auth.users(id) on delete cascade,
  response_rate_percent decimal(5,2) default 0, -- % of proposals responded to
  avg_response_time_hours integer default 0,
  last_30_days_responses integer default 0,
  last_30_days_proposals integer default 0,
  streak_days integer default 0, -- consecutive days of activity
  updated_at timestamp default now()
);

-- Consistency Badges: Track daily activity streaks
create table if not exists consistency_streaks (
  id uuid primary key default gen_random_uuid(),
  freelancer_id uuid not null references auth.users(id) on delete cascade,
  current_streak_days integer default 0,
  longest_streak_days integer default 0,
  last_activity_date date,
  active_this_month boolean default false,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- ============================================================
-- 3. MARKET DATA TABLES
-- ============================================================

-- Skill Demand: Track trending skills
create table if not exists skill_demand_index (
  id uuid primary key default gen_random_uuid(),
  skill_name text not null,
  category text,
  demand_change_percent decimal(5,2),
  avg_price_cents integer,
  projects_posted_week integer,
  freelancers_available integer,
  trend_direction text, -- 'rising', 'stable', 'declining'
  week_date date not null,
  created_at timestamp default now()
);

-- Price Insights: Anonymized pricing by skill/city
create table if not exists price_insights (
  id uuid primary key default gen_random_uuid(),
  skill_name text not null,
  category text,
  city text,
  avg_price_cents integer,
  min_price_cents integer,
  max_price_cents integer,
  freelancers_count integer,
  projects_count integer,
  updated_at timestamp default now()
);

-- ============================================================
-- 4. NOTIFICATIONS & ALERTS
-- ============================================================

-- Daily Opportunity Alerts
create table if not exists opportunity_alerts (
  id uuid primary key default gen_random_uuid(),
  freelancer_id uuid not null references auth.users(id) on delete cascade,
  skill_tags text[] not null, -- skills they want alerts for
  city text,
  projects_count integer,
  alert_type text default 'email', -- email, push, both
  sent_at timestamp,
  created_at timestamp default now()
);

-- ============================================================
-- 5. COMMUNITY FEATURES
-- ============================================================

-- Quick Polls: Community Q&A
create table if not exists community_polls (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  category text, -- freelancer-tips, pricing, negotiation, etc
  option_1 text not null,
  option_2 text not null,
  option_3 text not null,
  votes_1 integer default 0,
  votes_2 integer default 0,
  votes_3 integer default 0,
  active boolean default true,
  featured_at timestamp,
  created_at timestamp default now(),
  expires_at timestamp default now() + interval '7 days'
);

-- Poll Responses: Track who voted what
create table if not exists poll_responses (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid not null references community_polls(id) on delete cascade,
  freelancer_id uuid not null references auth.users(id) on delete cascade,
  selected_option integer not null, -- 1, 2, or 3
  created_at timestamp default now()
);

-- Featured Freelancers: Weekly curation
create table if not exists featured_freelancers (
  id uuid primary key default gen_random_uuid(),
  freelancer_id uuid not null references auth.users(id) on delete cascade,
  week_start date not null,
  story text, -- why they're featured
  featured_at timestamp default now(),
  created_at timestamp default now()
);

-- ============================================================
-- 6. ROW LEVEL SECURITY
-- ============================================================

alter table business_transactions enable row level security;
alter table proposal_tracking enable row level security;
alter table revenue_reports enable row level security;
alter table profile_visits enable row level security;
alter table freelancer_rankings enable row level security;
alter table response_metrics enable row level security;
alter table consistency_streaks enable row level security;
alter table skill_demand_index enable row level security;
alter table price_insights enable row level security;
alter table opportunity_alerts enable row level security;
alter table community_polls enable row level security;
alter table poll_responses enable row level security;
alter table featured_freelancers enable row level security;

-- Transactions: Freelancers see their own, clients see theirs
create policy "Users can view own transactions" on business_transactions
  for select using (auth.uid() = freelancer_id or auth.uid() = client_id);

-- Proposals: Freelancers see their sent, clients see received
create policy "Freelancers can view own proposals" on proposal_tracking
  for select using (auth.uid() = freelancer_id);

create policy "Clients can view proposals on their projects" on proposal_tracking
  for select using (auth.uid() = client_id);

-- Revenue: Users see their own only
create policy "Users can view own revenue" on revenue_reports
  for select using (auth.uid() = freelancer_id);

-- Profile Visits: Profile owner sees all visits
create policy "Users can view visits to own profile" on profile_visits
  for select using (auth.uid() = profile_owner_id);

-- Rankings: Everyone can view (public leaderboard)
create policy "Everyone can view rankings" on freelancer_rankings
  for select using (true);

-- Response Metrics: User sees own, admins see all
create policy "Users can view own response metrics" on response_metrics
  for select using (auth.uid() = freelancer_id);

-- Streaks: User sees own
create policy "Users can view own streaks" on consistency_streaks
  for select using (auth.uid() = freelancer_id);

-- Skill Demand: Everyone can view (market data)
create policy "Everyone can view skill demand" on skill_demand_index
  for select using (true);

-- Price Insights: Everyone can view
create policy "Everyone can view price insights" on price_insights
  for select using (true);

-- Alerts: User manages own
create policy "Users can manage own alerts" on opportunity_alerts
  for all using (auth.uid() = freelancer_id);

-- Polls: Everyone can view
create policy "Everyone can view polls" on community_polls
  for select using (true);

-- Poll Responses: Users can respond
create policy "Users can create own responses" on poll_responses
  for insert with check (auth.uid() = freelancer_id);

create policy "Users can view own responses" on poll_responses
  for select using (auth.uid() = freelancer_id);

-- Featured: Everyone can view
create policy "Everyone can view featured freelancers" on featured_freelancers
  for select using (true);

-- ============================================================
-- 7. INDEXES FOR PERFORMANCE
-- ============================================================

create index if not exists idx_transactions_freelancer on business_transactions(freelancer_id);
create index if not exists idx_transactions_created on business_transactions(created_at);
create index if not exists idx_proposals_freelancer on proposal_tracking(freelancer_id);
create index if not exists idx_proposals_status on proposal_tracking(status);
create index if not exists idx_visits_profile on profile_visits(profile_owner_id);
create index if not exists idx_rankings_city_week on freelancer_rankings(city, week_start);
create index if not exists idx_metrics_freelancer on response_metrics(freelancer_id);
create index if not exists idx_streaks_freelancer on consistency_streaks(freelancer_id);
create index if not exists idx_skill_demand_week on skill_demand_index(week_date);
create index if not exists idx_price_city_skill on price_insights(city, skill_name);
create index if not exists idx_alerts_freelancer on opportunity_alerts(freelancer_id);
create index if not exists idx_poll_responses_poll on poll_responses(poll_id);
create index if not exists idx_featured_week on featured_freelancers(week_start);
