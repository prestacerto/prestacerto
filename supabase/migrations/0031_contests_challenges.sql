-- Migration: Contests & Desafios de Projeto
-- R$ 350k/ano revenue

create table if not exists contests (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  description text not null,
  category text not null,
  budget_min numeric(10,2) not null,
  budget_max numeric(10,2) not null,
  deadline timestamptz not null,
  status text not null default 'open' check (status in ('open', 'in_progress', 'closed', 'winner_selected')),
  prize_pool numeric(10,2) not null,
  prestacerto_fee numeric(10,2) default 0, -- 25-40% do prêmio
  winner_id uuid references profiles(id),
  created_at timestamptz not null default now()
);

create index if not exists idx_contests_client on contests(client_id);
create index if not exists idx_contests_status on contests(status);

alter table contests enable row level security;

create policy "anyone_view_open_contests"
on contests for select using (status = 'open' or client_id = auth.uid());

-- Contest submissions
create table if not exists contest_submissions (
  id uuid primary key default gen_random_uuid(),
  contest_id uuid not null references contests(id) on delete cascade,
  freelancer_id uuid not null references profiles(id) on delete cascade,
  submission_url text not null,
  description text,
  rating numeric(2,1),
  status text not null default 'pending' check (status in ('pending', 'selected', 'rejected')),
  created_at timestamptz not null default now(),
  unique (contest_id, freelancer_id)
);

create index if not exists idx_submissions_contest on contest_submissions(contest_id);
create index if not exists idx_submissions_freelancer on contest_submissions(freelancer_id);

alter table contest_submissions enable row level security;

create policy "freelancer_view_own_submissions"
on contest_submissions for select using (freelancer_id = auth.uid() or contest_id in (select id from contests where client_id = auth.uid()));

-- Contest transactions
create table if not exists contest_transactions (
  id uuid primary key default gen_random_uuid(),
  contest_id uuid not null references contests(id) on delete cascade,
  winner_id uuid not null references profiles(id) on delete cascade,
  prize_amount numeric(10,2) not null,
  prestacerto_fee numeric(10,2) not null,
  mp_order_id text,
  status text not null default 'pending' check (status in ('pending', 'completed', 'refunded')),
  created_at timestamptz not null default now()
);

create index if not exists idx_contest_tx_contest on contest_transactions(contest_id);
create index if not exists idx_contest_tx_winner on contest_transactions(winner_id);
