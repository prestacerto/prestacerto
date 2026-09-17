-- Push Subscriptions
create table if not exists push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  endpoint text not null unique,
  subscription jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table push_subscriptions enable row level security;

create policy "push_own_subscription" on push_subscriptions
  for select using (user_id = auth.uid());

-- Daily Challenges
create table if not exists user_daily_challenges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  challenge_id text not null,
  completed_at timestamptz,
  progress int default 0,
  created_at timestamptz not null default now(),
  unique(user_id, challenge_id, created_at::date)
);

alter table user_daily_challenges enable row level security;

create policy "challenge_own" on user_daily_challenges
  for select using (user_id = auth.uid());

-- Surprise Rewards
create table if not exists surprise_rewards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount numeric(10,2) not null,
  created_at timestamptz not null default now(),
  unique(user_id, created_at::date)
);

alter table surprise_rewards enable row level security;

create policy "reward_own" on surprise_rewards
  for select using (user_id = auth.uid());

-- Email Logs
create table if not exists email_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  event_type text not null,
  recipient text not null,
  status text check (status in ('sent', 'failed', 'bounced')),
  metadata jsonb,
  created_at timestamptz not null default now()
);

alter table email_logs enable row level security;

create policy "email_own" on email_logs
  for select using (user_id = auth.uid());

-- Activity Feed
create table if not exists activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  action text not null,
  activity_type text check (activity_type in ('revenue', 'message', 'rating', 'proposal', 'challenge')),
  amount numeric(10,2),
  visibility text default 'public' check (visibility in ('public', 'private', 'friends')),
  created_at timestamptz not null default now()
);

alter table activities enable row level security;

create policy "activity_own" on activities
  for select using (user_id = auth.uid() or visibility = 'public');

-- User Gamification Stats
create table if not exists user_gamification (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  total_xp int default 0,
  level int default 1,
  badges text[] default '{}',
  streak_current int default 0,
  streak_best int default 0,
  last_activity_at timestamptz default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table user_gamification enable row level security;

create policy "gamification_own" on user_gamification
  for select using (user_id = auth.uid());

-- Indexes
create index if not exists push_subs_user on push_subscriptions(user_id);
create index if not exists challenges_user_date on user_daily_challenges(user_id, created_at::date);
create index if not exists rewards_user_date on surprise_rewards(user_id, created_at::date);
create index if not exists activities_user on activities(user_id);
create index if not exists activities_visibility on activities(visibility, created_at desc);
