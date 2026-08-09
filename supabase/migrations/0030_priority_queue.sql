-- Migration: Priority Queue (Visibilidade Premium)
-- R$ 150k/ano revenue

create table if not exists priority_queue_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  status text not null default 'active' check (status in ('active', 'expired', 'cancelled')),
  tier text not null default 'gold' check (tier in ('gold', 'platinum', 'diamond')),
  starts_at timestamptz not null default now(),
  expires_at timestamptz not null,
  price numeric(10,2) not null,
  mp_order_id text,
  auto_renew boolean default false,
  created_at timestamptz not null default now()
);

alter table priority_queue_subscriptions add column if not exists user_id uuid;
alter table priority_queue_subscriptions add column if not exists tier text;

-- Índices pra performance
create index if not exists idx_priority_queue_user on priority_queue_subscriptions(user_id);
create index if not exists idx_priority_queue_status on priority_queue_subscriptions(status);
create index if not exists idx_priority_queue_expires on priority_queue_subscriptions(expires_at desc);

alter table priority_queue_subscriptions enable row level security;

create policy "user_view_own_priority"
on priority_queue_subscriptions for select using (user_id = auth.uid());

-- Adicionar coluna em profiles e services pra tracking
alter table profiles add column if not exists priority_queue_active boolean default false;
alter table profiles add column if not exists priority_queue_expires timestamptz;
alter table profiles add column if not exists priority_queue_tier text;

alter table services add column if not exists priority_boost_active boolean default false;
alter table services add column if not exists priority_boost_expires timestamptz;

-- Função pra ativar priority queue
create or replace function activate_priority_queue(p_user_id uuid, p_tier text, p_expires_at timestamptz)
returns void as $$
begin
  update profiles
  set
    priority_queue_active = true,
    priority_queue_expires = p_expires_at,
    priority_queue_tier = p_tier
  where id = p_user_id;
end;
$$ language plpgsql;

-- Função pra listar projetos COM ordenação por priority
create or replace function get_projects_with_priority(
  p_search text default null,
  p_category_id int default null
)
returns table (
  id uuid,
  title text,
  description text,
  budget_min numeric,
  budget_max numeric,
  skills text[],
  created_at timestamptz,
  priority_tier text,
  is_priority_boosted boolean
) as $$
begin
  return query
  select
    p.id,
    p.title,
    p.description,
    p.budget_min,
    p.budget_max,
    p.skills,
    p.created_at,
    coalesce(pr.priority_queue_tier, 'normal') as priority_tier,
    coalesce(pq.status = 'active' and pq.expires_at > now(), false) as is_priority_boosted
  from projects p
  left join profiles pr on p.client_id = pr.id
  left join priority_queue_subscriptions pq on pr.id = pq.user_id and pq.status = 'active'
  where p.status = 'open'
    and (p_search is null or (p.title ilike '%' || p_search || '%' or p.description ilike '%' || p_search || '%'))
    and (p_category_id is null or p.category_id = p_category_id)
  order by
    case when pq.status = 'active' and pq.expires_at > now() then
      case pq.tier
        when 'diamond' then 1
        when 'platinum' then 2
        when 'gold' then 3
        else 4
      end
    else 4
    end asc,
    p.created_at desc;
end;
$$ language plpgsql;

-- Função pra listar serviços COM ordenação por priority
create or replace function get_services_with_priority(
  p_search text default null,
  p_category_id int default null
)
returns table (
  id uuid,
  title text,
  description text,
  price_hour numeric,
  skills text[],
  created_at timestamptz,
  priority_tier text,
  is_priority_boosted boolean
) as $$
begin
  return query
  select
    s.id,
    s.title,
    s.description,
    s.price_hour,
    s.skills,
    s.created_at,
    coalesce(pr.priority_queue_tier, 'normal') as priority_tier,
    coalesce(pq.status = 'active' and pq.expires_at > now(), false) as is_priority_boosted
  from services s
  join profiles pr on s.freelancer_id = pr.id
  left join priority_queue_subscriptions pq on pr.id = pq.user_id and pq.status = 'active'
  where s.is_active = true
    and (p_search is null or (s.title ilike '%' || p_search || '%' or s.description ilike '%' || p_search || '%'))
    and (p_category_id is null or s.category_id = p_category_id)
  order by
    case when pq.status = 'active' and pq.expires_at > now() then
      case pq.tier
        when 'diamond' then 1
        when 'platinum' then 2
        when 'gold' then 3
        else 4
      end
    else 4
    end asc,
    s.rating desc nulls last,
    s.created_at desc;
end;
$$ language plpgsql;

-- Tabela pra registrar compras de priority queue
create table if not exists priority_queue_purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  tier text not null check (tier in ('gold', 'platinum', 'diamond')),
  duration_days int not null default 7,
  price numeric(10,2) not null,
  mp_order_id text,
  status text not null default 'pending' check (status in ('pending', 'completed', 'refunded')),
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists idx_priority_purchases_user on priority_queue_purchases(user_id);
create index if not exists idx_priority_purchases_status on priority_queue_purchases(status);

alter table priority_queue_purchases enable row level security;

create policy "user_view_own_purchases"
on priority_queue_purchases for select using (user_id = auth.uid());
