// Activity Feed System
// Real-time social proof + FOMO engagement

export type ActivityType =
  | "project_completed"
  | "earning_milestone"
  | "profile_upgraded"
  | "badge_unlocked"
  | "referral_bonus"
  | "top_rated";

export interface Activity {
  id: string;
  type: ActivityType;
  userId: string;
  userName: string;
  avatarUrl?: string;
  title: string;
  description: string;
  icon: string;
  timestamp: Date;
  amount?: number; // R$ earnings
  metadata?: Record<string, any>;
}

export const ACTIVITY_MESSAGES: Record<ActivityType, (data: any) => string> = {
  project_completed: (data) => `${data.userName} completou um projeto e ganhou R$ ${data.amount}`,
  earning_milestone: (data) => `${data.userName} atingiu R$ ${data.amount} este mês! 🎉`,
  profile_upgraded: (data) => `${data.userName} completou seu perfil e ganhou badge ⭐`,
  badge_unlocked: (data) => `${data.userName} desbloqueou ${data.badge}`,
  referral_bonus: (data) => `${data.userName} ganhou R$ ${data.amount} com indicações 🚀`,
  top_rated: (data) => `${data.userName} ficou entre os top 10 melhores avaliados!`,
};

export const ACTIVITY_ICONS: Record<ActivityType, string> = {
  project_completed: "✅",
  earning_milestone: "💰",
  profile_upgraded: "👤",
  badge_unlocked: "🏆",
  referral_bonus: "🚀",
  top_rated: "⭐",
};

// Database schema
export const ACTIVITY_FEED_MIGRATION = `
create table if not exists activity_feed (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('project_completed', 'earning_milestone', 'profile_upgraded', 'badge_unlocked', 'referral_bonus', 'top_rated')),
  user_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  description text,
  icon text,
  amount numeric(10,2),
  metadata jsonb default '{}',
  created_at timestamptz not null default now()
);

create index if not exists idx_activity_feed_type on activity_feed(type);
create index if not exists idx_activity_feed_user on activity_feed(user_id);
create index if not exists idx_activity_feed_created on activity_feed(created_at desc);

alter table activity_feed enable row level security;

create policy "public_view_activity"
on activity_feed for select using (true);

-- View: Recent activities for feed
create or replace view recent_activities as
select
  af.id,
  af.type,
  p.full_name,
  p.avatar_url,
  af.title,
  af.description,
  af.icon,
  af.amount,
  af.created_at,
  now() - af.created_at as time_ago
from activity_feed af
join profiles p on af.user_id = p.id
order by af.created_at desc
limit 50;

alter table recent_activities enable row level security;
`;

// RPC to log activity
export const LOG_ACTIVITY_RPC = `
create or replace function log_activity(
  p_user_id uuid,
  p_type text,
  p_title text,
  p_description text,
  p_icon text,
  p_amount numeric default null,
  p_metadata jsonb default '{}'
)
returns void as $$
begin
  insert into activity_feed (user_id, type, title, description, icon, amount, metadata)
  values (p_user_id, p_type, p_title, p_description, p_icon, p_amount, p_metadata);
end;
$$ language plpgsql security definer;
`;
