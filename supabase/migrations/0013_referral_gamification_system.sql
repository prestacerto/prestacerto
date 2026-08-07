-- Migration: Referral + Gamification System
-- No pyramid: only direct referrals count, not network
-- Model: Dropbox/Uber/Nubank style
-- Date: 2026-08-07

-- ============================================
-- REFERRAL SYSTEM (Simple, direct-only)
-- ============================================

create table if not exists referral_invites (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid not null references profiles(id) on delete cascade,
  referee_email text not null,
  referral_code text not null unique,
  status text not null default 'pending' check (status in ('pending', 'converted', 'expired')),
  bonus_tier int default 0, -- 1=1mo, 5=3mo, 10=1yr
  created_at timestamptz not null default now(),
  converted_at timestamptz,
  expires_at timestamptz not null default (now() + interval '90 days')
);

create index if not exists idx_referral_invites_referrer on referral_invites(referrer_id, status);
create index if not exists idx_referral_invites_code on referral_invites(referral_code);
create index if not exists idx_referral_invites_email on referral_invites(referee_email);

alter table referral_invites enable row level security;

create policy "referrer_view_own_invites"
on referral_invites for select using (auth.uid() = referrer_id);

-- ============================================
-- REFERRAL TRACKING (Who referred who)
-- ============================================

create table if not exists referral_conversions (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid not null references profiles(id) on delete cascade,
  referee_id uuid not null unique references profiles(id) on delete cascade,
  referral_code text not null references referral_invites(referral_code),
  converted_at timestamptz not null default now(),
  bonus_awarded text, -- '1_month' | '3_months' | '1_year'
  created_at timestamptz not null default now()
);

create index if not exists idx_referral_conversions_referrer on referral_conversions(referrer_id);
create index if not exists idx_referral_conversions_referee on referral_conversions(referee_id);

alter table referral_conversions enable row level security;

create policy "referrer_view_own_conversions"
on referral_conversions for select using (auth.uid() = referrer_id);

-- ============================================
-- GAMIFICATION: Badges & Streaks
-- ============================================

create table if not exists gamification_badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references profiles(id) on delete cascade,
  badge_type text not null check (badge_type in (
    'top_referrer_month',  -- "Top Indicador do Mês"
    'consistent_responder', -- "Respostas Consistentes"
    'expert_certified',    -- "Especialista Certificado"
    'master_builder'       -- "Construtor Master"
  )),
  badge_tier int default 1, -- 1-5 (top 5 referrers, etc)
  achievement_date timestamptz not null default now(),
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_gamification_badges_user on gamification_badges(user_id);
create index if not exists idx_gamification_badges_type on gamification_badges(badge_type);

alter table gamification_badges enable row level security;

create policy "user_view_own_badges"
on gamification_badges for select using (auth.uid() = user_id);

create policy "public_view_badges"
on gamification_badges for select using (true);

-- ============================================
-- STREAK TRACKING (Weekly consistency)
-- ============================================

create table if not exists user_streaks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references profiles(id) on delete cascade,
  streak_type text not null check (streak_type in ('response_time', 'project_completion', 'rating')),
  current_streak int not null default 0,
  longest_streak int not null default 0,
  last_activity timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_user_streaks_user on user_streaks(user_id);
create index if not exists idx_user_streaks_type on user_streaks(streak_type);

alter table user_streaks enable row level security;

create policy "user_view_own_streaks"
on user_streaks for select using (auth.uid() = user_id);

-- ============================================
-- REFERRAL MONTHLY RANKINGS (Leaderboard)
-- ============================================

create table if not exists referral_rankings (
  id uuid primary key default gen_random_uuid(),
  month text not null, -- '2026-08'
  user_id uuid not null references profiles(id) on delete cascade,
  referral_count int not null default 0,
  ranking_position int,
  bonus_awarded text,
  created_at timestamptz not null default now(),

  constraint unique_month_user unique (month, user_id)
);

create index if not exists idx_referral_rankings_month on referral_rankings(month);
create index if not exists idx_referral_rankings_position on referral_rankings(month, ranking_position);

alter table referral_rankings enable row level security;

create policy "public_view_rankings"
on referral_rankings for select using (true);

-- ============================================
-- PROGRESS TRACKER (Visual progress bars)
-- ============================================

create table if not exists user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references profiles(id) on delete cascade,
  progress_type text not null check (progress_type in (
    'projects_to_badge',    -- projects until "Top da Categoria"
    'referrals_to_bonus',   -- referrals until next bonus tier
    'responses_to_streak'   -- consistent responses this week
  )),
  current_value int not null default 0,
  target_value int not null,
  percentage int generated always as (CASE WHEN target_value = 0 THEN 0 ELSE round((current_value::float / target_value) * 100) END) stored,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists idx_user_progress_user on user_progress(user_id);
create index if not exists idx_user_progress_type on user_progress(progress_type);

alter table user_progress enable row level security;

create policy "user_view_own_progress"
on user_progress for select using (auth.uid() = user_id);

-- ============================================
-- CROSS-SELL OPPORTUNITIES (Trigger at right moment)
-- ============================================

create table if not exists upsell_moments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  trigger_type text not null check (trigger_type in (
    'payment_success',      -- after payment completes
    'project_completion',   -- after client approves delivery
    'first_review',         -- after first review received
    'milestone_achievement' -- after hitting milestone
  )),
  product_suggestion text, -- 'pro_subscription' | 'select_access' | 'boost'
  shown boolean default false,
  clicked boolean default false,
  converted boolean default false,
  triggered_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists idx_upsell_moments_user on upsell_moments(user_id, trigger_type);
create index if not exists idx_upsell_moments_shown on upsell_moments(shown);

alter table upsell_moments enable row level security;

create policy "user_view_own_upsell"
on upsell_moments for select using (auth.uid() = user_id);

-- ============================================
-- VIEW: Monthly Top Referrers (Leaderboard)
-- ============================================

create or replace view top_referrers_current_month as
select
  rr.user_id,
  p.full_name,
  p.avatar_url,
  rr.referral_count,
  rr.ranking_position,
  rr.bonus_awarded,
  row_number() over (order by rr.referral_count desc) as position,
  case
    when row_number() over (order by rr.referral_count desc) = 1 then '🥇 #1'
    when row_number() over (order by rr.referral_count desc) = 2 then '🥈 #2'
    when row_number() over (order by rr.referral_count desc) = 3 then '🥉 #3'
    when row_number() over (order by rr.referral_count desc) <= 10 then '#' || row_number() over (order by rr.referral_count desc)
    else null
  end as badge
from referral_rankings rr
join profiles p on rr.user_id = p.id
where rr.month = to_char(now(), 'YYYY-MM')
  and rr.referral_count > 0
order by rr.referral_count desc
limit 10;

alter table top_referrers_current_month enable row level security;

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Calculate next bonus tier
create or replace function get_referral_bonus_tier(referral_count int)
returns table(tier int, bonus_months int, required_count int) as $$
begin
  return query select
    case
      when referral_count >= 10 then 3
      when referral_count >= 5 then 2
      when referral_count >= 1 then 1
      else 0
    end,
    case
      when referral_count >= 10 then 12
      when referral_count >= 5 then 3
      when referral_count >= 1 then 1
      else 0
    end,
    case
      when referral_count < 1 then 1
      when referral_count < 5 then 5
      when referral_count < 10 then 10
      else 10
    end;
end;
$$ language plpgsql stable;

-- Auto-update referral rankings at month boundary
create or replace function update_monthly_referral_rankings()
returns void as $$
begin
  insert into referral_rankings (month, user_id, referral_count, ranking_position)
  select
    to_char(now(), 'YYYY-MM'),
    referrer_id,
    count(*) as referral_count,
    row_number() over (order by count(*) desc) as ranking_position
  from referral_conversions
  where to_char(converted_at, 'YYYY-MM') = to_char(now(), 'YYYY-MM')
  group by referrer_id
  on conflict (month, user_id) do update
  set referral_count = excluded.referral_count,
      ranking_position = excluded.ranking_position;
end;
$$ language plpgsql;

-- ============================================
-- AUDIT & LOGGING
-- ============================================

create table if not exists gamification_audit_log (
  id uuid primary key default gen_random_uuid(),
  event_type text not null, -- 'referral_created' | 'badge_earned' | 'streak_updated'
  user_id uuid references profiles(id),
  details jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_gamification_audit_user on gamification_audit_log(user_id);
create index if not exists idx_gamification_audit_type on gamification_audit_log(event_type);
