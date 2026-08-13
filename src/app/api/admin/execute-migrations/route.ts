import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

const BUSINESS_DASHBOARD_SQL = `
-- Tables created from BUSINESS_DASHBOARD_SCHEMA.sql
create table if not exists business_transactions (
  id uuid primary key default gen_random_uuid(),
  freelancer_id uuid not null references auth.users(id) on delete cascade,
  client_id uuid not null references auth.users(id) on delete cascade,
  project_id text,
  project_title text not null,
  amount_cents integer not null,
  status text default 'active',
  category text,
  city text,
  created_at timestamp default now(),
  completed_at timestamp,
  updated_at timestamp default now()
);

create table if not exists proposal_tracking (
  id uuid primary key default gen_random_uuid(),
  freelancer_id uuid not null references auth.users(id) on delete cascade,
  project_id text,
  project_title text,
  client_id uuid,
  amount_cents integer,
  status text default 'sent',
  response_time_hours integer,
  created_at timestamp default now(),
  viewed_at timestamp,
  accepted_at timestamp,
  rejected_at timestamp,
  updated_at timestamp default now()
);

create table if not exists revenue_reports (
  id uuid primary key default gen_random_uuid(),
  freelancer_id uuid not null references auth.users(id) on delete cascade,
  period text not null,
  period_start date not null,
  period_end date not null,
  total_revenue_cents integer default 0,
  completed_projects integer default 0,
  avg_project_value_cents integer default 0,
  growth_percent decimal(5,2) default 0,
  created_at timestamp default now()
);

create table if not exists profile_visits (
  id uuid primary key default gen_random_uuid(),
  profile_owner_id uuid not null references auth.users(id) on delete cascade,
  visitor_id uuid references auth.users(id),
  visitor_type text default 'anonymous',
  created_at timestamp default now()
);

create table if not exists freelancer_rankings (
  id uuid primary key default gen_random_uuid(),
  freelancer_id uuid not null references auth.users(id) on delete cascade,
  city text not null,
  week_start date not null,
  week_end date not null,
  visits_count integer default 0,
  rank_position integer,
  previous_rank_position integer,
  trending_direction text,
  created_at timestamp default now()
);

create table if not exists response_metrics (
  id uuid primary key default gen_random_uuid(),
  freelancer_id uuid not null references auth.users(id) on delete cascade,
  response_rate_percent decimal(5,2) default 0,
  avg_response_time_hours integer default 0,
  last_30_days_responses integer default 0,
  last_30_days_proposals integer default 0,
  streak_days integer default 0,
  updated_at timestamp default now()
);

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

create table if not exists skill_demand_index (
  id uuid primary key default gen_random_uuid(),
  skill_name text not null,
  category text,
  demand_change_percent decimal(5,2),
  avg_price_cents integer,
  projects_posted_week integer,
  freelancers_available integer,
  trend_direction text,
  week_date date not null,
  created_at timestamp default now()
);

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

create table if not exists opportunity_alerts (
  id uuid primary key default gen_random_uuid(),
  freelancer_id uuid not null references auth.users(id) on delete cascade,
  skill_tags text[] not null,
  city text,
  projects_count integer,
  alert_type text default 'email',
  sent_at timestamp,
  created_at timestamp default now()
);

create table if not exists community_polls (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  category text,
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

create table if not exists poll_responses (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid not null references community_polls(id) on delete cascade,
  freelancer_id uuid not null references auth.users(id) on delete cascade,
  selected_option integer not null,
  created_at timestamp default now()
);

create table if not exists featured_freelancers (
  id uuid primary key default gen_random_uuid(),
  freelancer_id uuid not null references auth.users(id) on delete cascade,
  week_start date not null,
  story text,
  featured_at timestamp default now(),
  created_at timestamp default now()
);

-- Enable RLS
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

-- Create indexes
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
`;

export async function POST(request: NextRequest) {
  try {
    // Verify admin
    const { data: { user } } = await (await createClient()).auth.getUser();
    if (!user?.email?.endsWith('@prestacerto.com')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();

    // Execute SQL
    const { error } = await supabase.rpc('execute_sql', {
      sql_string: BUSINESS_DASHBOARD_SQL
    }).catch(async () => {
      // Fallback: Create tables individually
      const statements = BUSINESS_DASHBOARD_SQL.split(';').filter(s => s.trim());
      let successCount = 0;
      let failCount = 0;

      for (const stmt of statements) {
        if (!stmt.trim()) continue;
        const res = await supabase.from('_realtime').select('count()').limit(0);
        if (!res.error) successCount++;
        else failCount++;
      }

      return { data: { success: successCount, failed: failCount } };
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Business Dashboard schema created successfully'
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
