-- PrestaCerto — três linhas de receita novas, sem tocar no "zero comissão":
-- destaque de projeto (cliente paga), selo de verificado (freelancer paga) e
-- antecipação de recebimento (freelancer paga uma taxa pra não esperar a
-- confirmação de entrega). Ver mapa em MONETIZATION_GUIDE.md.
--
-- Rode depois de 0003_payment_escrow.sql.

alter table projects add column is_featured boolean not null default false;
alter table projects add column featured_until timestamptz;

create index projects_featured_idx on projects (is_featured) where is_featured = true;

alter table profiles add column is_verified boolean not null default false;
alter table profiles add column verified_at timestamptz;

create table early_payment_requests (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references proposals(id) on delete cascade,
  freelancer_id uuid not null references profiles(id) on delete cascade,
  original_amount numeric(10, 2) not null,
  fee_percentage numeric(5, 4) not null default 0.0299,
  fee_amount numeric(10, 2) not null,
  net_amount numeric(10, 2) not null,
  status text not null default 'pending' check (status in ('pending', 'captured', 'failed')),
  mp_payment_id text,
  created_at timestamptz not null default now()
);

alter table early_payment_requests enable row level security;

create policy "freelancer vê as próprias solicitações de antecipação"
on early_payment_requests for select
using (freelancer_id = auth.uid());

create index early_payment_requests_freelancer_idx on early_payment_requests (freelancer_id);
