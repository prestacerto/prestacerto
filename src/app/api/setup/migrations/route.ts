import { NextRequest, NextResponse } from 'next/server';

const MIGRATIONS_SQL = `
-- Business Dashboard Tables
create table if not exists business_transactions (id uuid primary key default gen_random_uuid(), freelancer_id uuid not null references auth.users(id) on delete cascade, client_id uuid not null references auth.users(id) on delete cascade, project_id text, project_title text not null, amount_cents integer not null, status text default 'active', category text, city text, created_at timestamp default now(), completed_at timestamp, updated_at timestamp default now());
create table if not exists proposal_tracking (id uuid primary key default gen_random_uuid(), freelancer_id uuid not null references auth.users(id) on delete cascade, project_id text, project_title text, client_id uuid, amount_cents integer, status text default 'sent', response_time_hours integer, created_at timestamp default now(), viewed_at timestamp, accepted_at timestamp, rejected_at timestamp, updated_at timestamp default now());
create table if not exists revenue_reports (id uuid primary key default gen_random_uuid(), freelancer_id uuid not null references auth.users(id) on delete cascade, period text not null, period_start date not null, period_end date not null, total_revenue_cents integer default 0, completed_projects integer default 0, avg_project_value_cents integer default 0, growth_percent decimal(5,2) default 0, created_at timestamp default now());
create table if not exists profile_visits (id uuid primary key default gen_random_uuid(), profile_owner_id uuid not null references auth.users(id) on delete cascade, visitor_id uuid references auth.users(id), visitor_type text default 'anonymous', created_at timestamp default now());
create table if not exists freelancer_rankings (id uuid primary key default gen_random_uuid(), freelancer_id uuid not null references auth.users(id) on delete cascade, city text not null, week_start date not null, week_end date not null, visits_count integer default 0, rank_position integer, previous_rank_position integer, trending_direction text, created_at timestamp default now());
create table if not exists response_metrics (id uuid primary key default gen_random_uuid(), freelancer_id uuid not null references auth.users(id) on delete cascade, response_rate_percent decimal(5,2) default 0, avg_response_time_hours integer default 0, last_30_days_responses integer default 0, last_30_days_proposals integer default 0, streak_days integer default 0, updated_at timestamp default now());
create table if not exists consistency_streaks (id uuid primary key default gen_random_uuid(), freelancer_id uuid not null references auth.users(id) on delete cascade, current_streak_days integer default 0, longest_streak_days integer default 0, last_activity_date date, active_this_month boolean default false, created_at timestamp default now(), updated_at timestamp default now());
create table if not exists skill_demand_index (id uuid primary key default gen_random_uuid(), skill_name text not null, category text, demand_change_percent decimal(5,2), avg_price_cents integer, projects_posted_week integer, freelancers_available integer, trend_direction text, week_date date not null, created_at timestamp default now());
create table if not exists price_insights (id uuid primary key default gen_random_uuid(), skill_name text not null, category text, city text, avg_price_cents integer, min_price_cents integer, max_price_cents integer, freelancers_count integer, projects_count integer, updated_at timestamp default now());
create table if not exists opportunity_alerts (id uuid primary key default gen_random_uuid(), freelancer_id uuid not null references auth.users(id) on delete cascade, skill_tags text[] not null, city text, projects_count integer, alert_type text default 'email', sent_at timestamp, created_at timestamp default now());
create table if not exists community_polls (id uuid primary key default gen_random_uuid(), question text not null, category text, option_1 text not null, option_2 text not null, option_3 text not null, votes_1 integer default 0, votes_2 integer default 0, votes_3 integer default 0, active boolean default true, featured_at timestamp, created_at timestamp default now(), expires_at timestamp default now() + interval '7 days');
create table if not exists poll_responses (id uuid primary key default gen_random_uuid(), poll_id uuid not null references community_polls(id) on delete cascade, freelancer_id uuid not null references auth.users(id) on delete cascade, selected_option integer not null, created_at timestamp default now());
create table if not exists featured_freelancers (id uuid primary key default gen_random_uuid(), freelancer_id uuid not null references auth.users(id) on delete cascade, week_start date not null, story text, featured_at timestamp default now(), created_at timestamp default now());
create index if not exists idx_transactions_freelancer on business_transactions(freelancer_id);
create index if not exists idx_proposals_freelancer on proposal_tracking(freelancer_id);
create index if not exists idx_visits_profile on profile_visits(profile_owner_id);
create index if not exists idx_skill_demand_week on skill_demand_index(week_date);
create index if not exists idx_price_city_skill on price_insights(city, skill_name);
`;

export async function POST(request: NextRequest) {
  try {
    const key = request.headers.get('x-setup-key');
    if (key !== 'setup-9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // In production, would execute via Supabase admin API
    // For now, return success assuming manual setup was done
    return NextResponse.json({
      status: 'success',
      message: 'Migrations ready. Execute SQL in Supabase SQL Editor.',
      tables: 13,
      sql_length: MIGRATIONS_SQL.length
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
