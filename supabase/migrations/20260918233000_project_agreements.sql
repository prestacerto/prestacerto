-- Acordo Certo: registro do que cliente e profissional combinaram, com aceite
-- dos dois lados. A PrestaCerto não custodia pagamento; só registra o acordo.
create table if not exists public.project_agreements (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null unique references public.proposals(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  client_id uuid not null references public.profiles(id) on delete cascade,
  freelancer_id uuid not null references public.profiles(id) on delete cascade,
  scope text not null default '',
  total_amount numeric(12,2) check (total_amount is null or total_amount >= 0),
  deadline_days int check (deadline_days is null or deadline_days between 1 and 3650),
  payment_terms text not null default '',
  milestones jsonb not null default '[]'::jsonb,
  version int not null default 1,
  client_accepted_at timestamptz,
  freelancer_accepted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists project_agreements_project on public.project_agreements(project_id);

alter table public.project_agreements enable row level security;
drop policy if exists project_agreements_participants_read on public.project_agreements;
create policy project_agreements_participants_read on public.project_agreements
  for select to authenticated using (auth.uid() = client_id or auth.uid() = freelancer_id);
-- Escrita só pelas funções abaixo.
revoke insert, update, delete on public.project_agreements from anon, authenticated;
grant select on public.project_agreements to authenticated;
grant select, insert, update on public.project_agreements to service_role;

-- Cria (na primeira chamada, a partir da proposta aceita) ou edita o acordo.
-- Qualquer edição invalida os aceites anteriores: os dois precisam aceitar de novo.
create or replace function public.save_project_agreement(
  p_proposal_id uuid, p_scope text, p_total_amount numeric, p_deadline_days int, p_payment_terms text, p_milestones jsonb
) returns public.project_agreements language plpgsql security definer set search_path = '' as $$
declare v_prop record; v_row public.project_agreements%rowtype; v_uid uuid := auth.uid();
begin
  if v_uid is null then raise exception 'unauthorized'; end if;
  select pr.id, pr.freelancer_id, pr.status, pr.proposed_price, pj.id as project_id, pj.client_id, pj.description, pj.deadline_days
    into v_prop
    from public.proposals pr join public.projects pj on pj.id = pr.project_id
   where pr.id = p_proposal_id;
  if not found then raise exception 'proposal_not_found'; end if;
  if v_uid <> v_prop.client_id and v_uid <> v_prop.freelancer_id then raise exception 'forbidden'; end if;
  if v_prop.status <> 'accepted' then raise exception 'proposal_not_accepted'; end if;
  if jsonb_typeof(coalesce(p_milestones, '[]'::jsonb)) <> 'array' or jsonb_array_length(coalesce(p_milestones, '[]'::jsonb)) > 30 then
    raise exception 'invalid_milestones';
  end if;

  insert into public.project_agreements (proposal_id, project_id, client_id, freelancer_id, scope, total_amount, deadline_days, payment_terms, milestones)
  values (p_proposal_id, v_prop.project_id, v_prop.client_id, v_prop.freelancer_id,
          coalesce(nullif(trim(p_scope), ''), left(v_prop.description, 4000)),
          coalesce(p_total_amount, v_prop.proposed_price), coalesce(p_deadline_days, v_prop.deadline_days),
          coalesce(p_payment_terms, ''), coalesce(p_milestones, '[]'::jsonb))
  on conflict (proposal_id) do update set
    scope = coalesce(nullif(trim(excluded.scope), ''), public.project_agreements.scope),
    total_amount = excluded.total_amount,
    deadline_days = excluded.deadline_days,
    payment_terms = excluded.payment_terms,
    milestones = excluded.milestones,
    version = public.project_agreements.version + 1,
    client_accepted_at = null,
    freelancer_accepted_at = null,
    updated_at = now()
  returning * into v_row;
  return v_row;
end $$;

-- Cria o rascunho inicial sem invalidar nada (usado no momento do aceite da proposta).
create or replace function public.ensure_project_agreement(p_proposal_id uuid)
returns public.project_agreements language plpgsql security definer set search_path = '' as $$
declare v_prop record; v_row public.project_agreements%rowtype; v_uid uuid := auth.uid();
begin
  select * into v_row from public.project_agreements where proposal_id = p_proposal_id;
  if found then
    if v_uid is null or (v_uid <> v_row.client_id and v_uid <> v_row.freelancer_id) then raise exception 'forbidden'; end if;
    return v_row;
  end if;
  select pr.id, pr.freelancer_id, pr.status, pr.proposed_price, pj.id as project_id, pj.client_id, pj.description, pj.deadline_days
    into v_prop from public.proposals pr join public.projects pj on pj.id = pr.project_id where pr.id = p_proposal_id;
  if not found then raise exception 'proposal_not_found'; end if;
  if v_uid is null or (v_uid <> v_prop.client_id and v_uid <> v_prop.freelancer_id) then raise exception 'forbidden'; end if;
  if v_prop.status <> 'accepted' then raise exception 'proposal_not_accepted'; end if;
  insert into public.project_agreements (proposal_id, project_id, client_id, freelancer_id, scope, total_amount, deadline_days, payment_terms)
  values (p_proposal_id, v_prop.project_id, v_prop.client_id, v_prop.freelancer_id, left(coalesce(v_prop.description, ''), 4000), v_prop.proposed_price, v_prop.deadline_days, '')
  on conflict (proposal_id) do nothing;
  select * into v_row from public.project_agreements where proposal_id = p_proposal_id;
  return v_row;
end $$;

-- Registra o aceite de quem chamou (cliente ou profissional) na versão atual.
create or replace function public.accept_project_agreement(p_proposal_id uuid, p_version int)
returns public.project_agreements language plpgsql security definer set search_path = '' as $$
declare v_row public.project_agreements%rowtype; v_uid uuid := auth.uid();
begin
  if v_uid is null then raise exception 'unauthorized'; end if;
  select * into v_row from public.project_agreements where proposal_id = p_proposal_id for update;
  if not found then raise exception 'agreement_not_found'; end if;
  if v_row.version <> p_version then raise exception 'agreement_changed'; end if;
  if v_uid = v_row.client_id then
    update public.project_agreements set client_accepted_at = coalesce(client_accepted_at, now()), updated_at = now() where id = v_row.id returning * into v_row;
  elsif v_uid = v_row.freelancer_id then
    update public.project_agreements set freelancer_accepted_at = coalesce(freelancer_accepted_at, now()), updated_at = now() where id = v_row.id returning * into v_row;
  else
    raise exception 'forbidden';
  end if;
  return v_row;
end $$;

revoke all on function public.save_project_agreement(uuid, text, numeric, int, text, jsonb) from public, anon;
revoke all on function public.ensure_project_agreement(uuid) from public, anon;
revoke all on function public.accept_project_agreement(uuid, int) from public, anon;
grant execute on function public.save_project_agreement(uuid, text, numeric, int, text, jsonb) to authenticated, service_role;
grant execute on function public.ensure_project_agreement(uuid) to authenticated, service_role;
grant execute on function public.accept_project_agreement(uuid, int) to authenticated, service_role;
