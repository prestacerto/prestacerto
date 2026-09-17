-- Migration: Partner Program + Marketplace
-- Monetization through integrations, affiliate, and B2B partnerships
-- Date: 2026-08-07

-- ============================================
-- PARTNER PROGRAM (B2B Integration Partners)
-- ============================================

create table if not exists partners (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  logo_url text,
  description text,
  category text not null check (category in (
    'education',      -- Hotmart, Coursera
    'tools',          -- ChatGPT, Figma, Canva
    'insurance',      -- Seguros, SaaS
    'fintech',        -- Bancos, empréstimo
    'accounting',     -- Contadores automáticos
    'integrations',   -- Zapier, Make
    'marketplace'     -- Nuvemshop, etc
  )),
  commission_rate numeric(5,2) not null check (commission_rate between 0 and 100),
  commission_model text not null check (commission_model in (
    'percentage',    -- % da venda
    'flat_fee',      -- valor fixo por referral
    'revenue_share'  -- split de subscription
  )),
  website_url text,
  contact_email text,
  api_key text,      -- pra trackear conversões
  status text not null default 'active' check (status in ('active', 'inactive', 'pending')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_partners_category on partners(category);
create index if not exists idx_partners_status on partners(status);

alter table partners enable row level security;

create policy "public_view_active_partners"
on partners for select using (status = 'active');

-- ============================================
-- PARTNER PLACEMENTS (Where/how partners appear)
-- ============================================

create table if not exists partner_placements (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references partners(id) on delete cascade,
  placement_type text not null check (placement_type in (
    'dashboard_card',     -- Cards no dashboard
    'email_banner',       -- Nos emails
    'notification',       -- Nas notificações
    'profile_recommendation'  -- No perfil público
  )),
  position int,           -- Ordem de aparição
  monthly_cost numeric(10,2),  -- Se cobrar pra aparecer
  monthly_impressions int default 0,
  monthly_clicks int default 0,
  monthly_conversions int default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_partner_placements_partner on partner_placements(partner_id);
create index if not exists idx_partner_placements_type on partner_placements(placement_type);

alter table partner_placements enable row level security;

create policy "public_view_active_placements"
on partner_placements for select using (
  exists (
    select 1 from partners p
    where p.id = partner_placements.partner_id
    and p.status = 'active'
  )
);

-- ============================================
-- AFFILIATE TRACKING (User clicks & conversions)
-- ============================================

create table if not exists affiliate_links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  partner_id uuid not null references partners(id) on delete cascade,
  affiliate_code text not null unique,
  utm_source text generated always as ('prestacerto_' || partner_id::text) stored,
  clicks int default 0,
  conversions int default 0,
  revenue numeric(10,2) default 0,
  earned_commission numeric(10,2) default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint unique_user_partner unique (user_id, partner_id)
);

create index if not exists idx_affiliate_links_user on affiliate_links(user_id);
create index if not exists idx_affiliate_links_partner on affiliate_links(partner_id);
create index if not exists idx_affiliate_links_code on affiliate_links(affiliate_code);

alter table affiliate_links enable row level security;

create policy "user_view_own_affiliate"
on affiliate_links for select using (auth.uid() = user_id);

-- ============================================
-- AFFILIATE TRANSACTIONS (Revenue tracking)
-- ============================================

create table if not exists affiliate_transactions (
  id uuid primary key default gen_random_uuid(),
  affiliate_link_id uuid not null references affiliate_links(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  partner_id uuid not null references partners(id) on delete cascade,
  transaction_type text not null check (transaction_type in (
    'click',
    'conversion',
    'subscription_created',
    'subscription_renewed',
    'product_purchased'
  )),
  external_transaction_id text,
  sale_amount numeric(10,2),
  commission_amount numeric(10,2),
  status text not null default 'pending' check (status in ('pending', 'approved', 'paid', 'disputed', 'reversed')),
  payout_date timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_affiliate_trans_link on affiliate_transactions(affiliate_link_id);
create index if not exists idx_affiliate_trans_user on affiliate_transactions(user_id);
create index if not exists idx_affiliate_trans_partner on affiliate_transactions(partner_id);
create index if not exists idx_affiliate_trans_type on affiliate_transactions(transaction_type);
create index if not exists idx_affiliate_trans_status on affiliate_transactions(status);

alter table affiliate_transactions enable row level security;

create policy "user_view_own_transactions"
on affiliate_transactions for select using (auth.uid() = user_id);

-- ============================================
-- PARTNER DASHBOARD (User earnings summary)
-- ============================================

create table if not exists partner_earnings_summary (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  partner_id uuid not null references partners(id) on delete cascade,
  month text not null, -- '2026-08'
  total_clicks int default 0,
  total_conversions int default 0,
  total_revenue numeric(10,2) default 0,
  total_commission numeric(10,2) default 0,
  status text not null default 'pending' check (status in ('pending', 'approved', 'paid')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint unique_user_partner_month unique (user_id, partner_id, month)
);

create index if not exists idx_earnings_summary_user on partner_earnings_summary(user_id);
create index if not exists idx_earnings_summary_partner on partner_earnings_summary(partner_id);
create index if not exists idx_earnings_summary_month on partner_earnings_summary(month);

alter table partner_earnings_summary enable row level security;

create policy "user_view_own_earnings"
on partner_earnings_summary for select using (auth.uid() = user_id);

-- ============================================
-- REFERRAL CREDITS (Virtual currency)
-- ============================================

create table if not exists referral_credits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  balance numeric(10,2) not null default 0,
  pending_balance numeric(10,2) not null default 0,
  total_earned numeric(10,2) not null default 0,
  total_spent numeric(10,2) not null default 0,
  last_activity timestamptz,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),

  constraint unique_user_credits unique (user_id)
);

create index if not exists idx_referral_credits_user on referral_credits(user_id);
create index if not exists idx_referral_credits_balance on referral_credits(balance);

alter table referral_credits enable row level security;

create policy "user_view_own_credits"
on referral_credits for select using (auth.uid() = user_id);

-- ============================================
-- CREDIT TRANSACTIONS (Log every credit movement)
-- ============================================

create table if not exists credit_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  amount numeric(10,2) not null,
  type text not null check (type in ('referral_bonus', 'affiliate_commission', 'purchase_discount', 'purchase_paid')),
  description text,
  reference_id uuid,            -- referral_conversions.id | affiliate_transactions.id
  created_at timestamptz not null default now()
);

create index if not exists idx_credit_transactions_user on credit_transactions(user_id);
create index if not exists idx_credit_transactions_type on credit_transactions(type);

alter table credit_transactions enable row level security;

create policy "user_view_own_transactions"
on credit_transactions for select using (auth.uid() = user_id);

-- ============================================
-- VIEWS (Reports & Dashboards)
-- ============================================

create or replace view user_referral_dashboard as
select
  p.id as user_id,
  p.full_name,
  p.avatar_url,
  (select count(*) from referral_conversions where referrer_id = p.id) as total_referrals,
  (select count(*) from referral_conversions where referrer_id = p.id and to_char(converted_at, 'YYYY-MM') = to_char(now(), 'YYYY-MM')) as monthly_referrals,
  (select coalesce(sum(amount), 0) from credit_transactions where user_id = p.id and type = 'referral_bonus') as total_referral_bonus,
  coalesce(rc.balance, 0) as credit_balance,
  coalesce(rc.pending_balance, 0) as pending_credits,
  (select row_to_json(t) from (
    select tier, bonus_months, required_count
    from get_referral_bonus_tier((select count(*) from referral_conversions where referrer_id = p.id))
  ) t) as next_bonus_tier
from profiles p
left join referral_credits rc on rc.user_id = p.id;

alter table user_referral_dashboard enable row level security;

-- Top affiliate earners
create or replace view top_affiliate_earners as
select
  p.id,
  p.full_name,
  p.avatar_url,
  sum(at.commission_amount) as total_earnings,
  count(distinct at.partner_id) as active_partners,
  count(at.id) filter (where at.status = 'pending') as pending_payouts,
  count(at.id) filter (where at.transaction_type = 'conversion') as total_conversions
from profiles p
join affiliate_links al on al.user_id = p.id
join affiliate_transactions at on at.affiliate_link_id = al.id
where at.status in ('approved', 'paid')
group by p.id, p.full_name, p.avatar_url
order by total_earnings desc
limit 50;

alter table top_affiliate_earners enable row level security;

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Generate affiliate code
create or replace function generate_affiliate_code(partner_id uuid)
returns text as $$
declare
  code text;
begin
  code := 'af_' || substring(partner_id::text, 1, 8) || '_' || to_char(now(), 'YYMMDDHHmmss');
  return code;
end;
$$ language plpgsql;

-- Record affiliate click
create or replace function record_affiliate_click(code text)
returns void as $$
begin
  update affiliate_links
  set clicks = clicks + 1, updated_at = now()
  where affiliate_code = code;
end;
$$ language plpgsql;

-- Award referral credit
create or replace function award_referral_credit(referrer_id uuid, amount numeric, description text)
returns void as $$
begin
  -- Update or insert credits
  insert into referral_credits (user_id, balance, total_earned, updated_at)
  values (referrer_id, amount, amount, now())
  on conflict (user_id) do update
  set balance = balance + excluded.balance,
      total_earned = total_earned + excluded.total_earned,
      updated_at = now();

  -- Log transaction
  insert into credit_transactions (user_id, amount, type, description)
  values (referrer_id, amount, 'referral_bonus', description);
end;
$$ language plpgsql;

-- Calculate monthly affiliate earnings
create or replace function calculate_monthly_affiliate_earnings()
returns void as $$
begin
  insert into partner_earnings_summary (user_id, partner_id, month, total_clicks, total_conversions, total_revenue, total_commission)
  select
    al.user_id,
    al.partner_id,
    to_char(at.created_at, 'YYYY-MM'),
    count(at.id) filter (where at.transaction_type = 'click'),
    count(at.id) filter (where at.transaction_type in ('conversion', 'subscription_created', 'product_purchased')),
    coalesce(sum(at.sale_amount), 0),
    coalesce(sum(at.commission_amount), 0)
  from affiliate_links al
  join affiliate_transactions at on at.affiliate_link_id = al.id
  where at.status = 'approved'
  group by al.user_id, al.partner_id, to_char(at.created_at, 'YYYY-MM')
  on conflict (user_id, partner_id, month) do update
  set total_clicks = excluded.total_clicks,
      total_conversions = excluded.total_conversions,
      total_revenue = excluded.total_revenue,
      total_commission = excluded.total_commission,
      updated_at = now();
end;
$$ language plpgsql;
