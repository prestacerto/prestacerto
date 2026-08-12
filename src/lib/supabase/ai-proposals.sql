-- AI Proposals (CERTO AI)
create table if not exists ai_optimizations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  action text not null, -- 'optimize' | 'compare' | 'tips'
  original_proposal text not null,
  optimized_proposal text,
  comparison_proposal_2 text,
  score integer, -- 0-100
  win_rate decimal(5,2), -- Taxa de ganho: 78%
  issues jsonb, -- Array de issues encontradas
  suggestions jsonb, -- Array de sugestões
  analysis jsonb, -- Analysis data (conversão, retenção, etc)
  tokens_used integer default 0,
  cost_cents integer default 0, -- Custo em centavos (19,90 = 1990)
  plan_type text default 'free', -- 'free' | 'premium' | 'enterprise'
  usage_count integer default 0, -- Quantas vezes usou
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- AI Usage/Billing
create table if not exists ai_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_type text not null, -- 'free' | 'premium' | 'enterprise'
  optimizations_used integer default 0,
  optimizations_limit integer default 3, -- Free tier: 3/mês
  monthly_cost_cents integer default 0, -- Premium: 1990 (R$ 19,90)
  subscription_active boolean default false,
  subscription_start timestamp,
  subscription_end timestamp,
  stripe_subscription_id text,
  last_optimization timestamp,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- AI Insights/Analytics
create table if not exists ai_insights (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  metric_type text not null, -- 'conversion_rate', 'retention', 'avg_score', 'win_rate'
  metric_value decimal(10,2),
  trend decimal(5,2), -- +18%, -5%, etc
  compared_to_avg decimal(10,2), -- vs média geral
  period text default 'month', -- 'week', 'month', 'all'
  created_at timestamp default now()
);

-- View: User AI Stats
create or replace view user_ai_stats as
select
  u.user_id,
  u.plan_type,
  u.optimizations_used,
  u.optimizations_limit,
  (u.optimizations_limit - u.optimizations_used) as optimizations_remaining,
  u.subscription_active,
  u.subscription_end,
  count(ao.id) as total_optimizations,
  round(avg(ao.score)::numeric, 1) as avg_score,
  max(ao.score) as best_score,
  round(avg(ao.win_rate)::numeric, 2) as avg_win_rate,
  count(distinct date(ao.created_at)) as days_active
from ai_usage u
left join ai_optimizations ao on u.user_id = ao.user_id
group by u.id, u.user_id, u.plan_type, u.optimizations_used, u.optimizations_limit, u.subscription_active, u.subscription_end;

-- Function: Log AI Usage
create or replace function log_ai_optimization(
  p_user_id uuid,
  p_action text,
  p_proposal text,
  p_optimized text,
  p_score integer,
  p_plan text
) returns json as $$
declare
  v_usage_record ai_usage%rowtype;
  v_result json;
begin
  -- Get or create usage record
  select * into v_usage_record from ai_usage
  where user_id = p_user_id
  limit 1;

  if not found then
    insert into ai_usage (user_id, plan_type)
    values (p_user_id, p_plan)
    returning * into v_usage_record;
  end if;

  -- Create optimization record
  insert into ai_optimizations (
    user_id, action, original_proposal, optimized_proposal, score, plan_type
  ) values (
    p_user_id, p_action, p_proposal, p_optimized, p_score, p_plan
  );

  -- Update usage counter
  if v_usage_record.plan_type = 'free' then
    update ai_usage
    set optimizations_used = optimizations_used + 1,
        last_optimization = now()
    where user_id = p_user_id;
  else
    update ai_usage
    set last_optimization = now()
    where user_id = p_user_id;
  end if;

  v_result := json_build_object(
    'success', true,
    'score', p_score,
    'plan', p_plan
  );
  return v_result;
end;
$$ language plpgsql;

-- RLS Policies
alter table ai_optimizations enable row level security;
alter table ai_usage enable row level security;
alter table ai_insights enable row level security;

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

create policy "Admins can view all ai data"
  on ai_optimizations for select
  using (is_admin());

create policy "Admins can view all ai usage"
  on ai_usage for select
  using (is_admin());
