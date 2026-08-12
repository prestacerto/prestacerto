-- Push Subscriptions Table
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

-- RLS
alter table push_subscriptions enable row level security;

create policy "Users can view own subscriptions"
  on push_subscriptions for select
  using (auth.uid() = user_id);

create policy "Users can manage own subscriptions"
  on push_subscriptions for insert, update, delete
  using (auth.uid() = user_id);

-- Index for performance
create index idx_push_subscriptions_user_id on push_subscriptions(user_id);
