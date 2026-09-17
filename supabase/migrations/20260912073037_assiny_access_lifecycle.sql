begin;
-- Apply only after the preflight in docs/launch-evidence/2026-09-12-assiny-lifecycle.md.
-- Monthly access uses an explicit fallback: approval.updated_at + one UTC calendar month.
-- Assiny's public contract supplies neither paid_at nor a subscription period end.
set local lock_timeout = '5s';
-- Share the ledger lock BEFORE checking existing rows: a concurrent webhook/bind
-- cannot create an unreconciled binding between the guard and the new functions.
select pg_advisory_xact_lock(918409,2);
lock table public.assiny_subscriptions in share row exclusive mode;

create schema if not exists billing_private;
revoke all on schema billing_private from public,anon,authenticated;
grant usage on schema billing_private to service_role;
create table billing_private.assiny_plan_baselines (
 user_id uuid primary key references public.profiles(id) on delete cascade,
 plan text not null check (plan in ('free','pro','business')),
 recorded_at timestamptz not null default now(),
 source text not null
);
alter table billing_private.assiny_plan_baselines enable row level security;
revoke all on billing_private.assiny_plan_baselines from public,anon,authenticated;
grant select,insert,update on billing_private.assiny_plan_baselines to service_role;

create table billing_private.assiny_window_reconciliation (
 subscription_id text primary key,
 paid_through timestamptz,
 verification_reference text not null check (length(trim(verification_reference))>=10),
 verified_by text not null check (length(trim(verified_by))>=3),
 verified_at timestamptz not null default now()
);
alter table billing_private.assiny_window_reconciliation enable row level security;
revoke all on billing_private.assiny_window_reconciliation from public,anon,authenticated;
grant select,insert,update on billing_private.assiny_window_reconciliation to service_role;

-- OPERATOR RECONCILIATION POINT: insert only independently verified, non-Assiny
-- baseline grants AND paid-period evidence for each existing bound subscription
-- in the two reconciliation tables here, before applying this migration.
-- Do not infer the baseline from profiles.plan (the old webhook overwrote it).
do $$ begin
 if exists(select 1 from public.assiny_subscriptions s where s.mode='live' and s.user_id is not null
   and (not exists(select 1 from billing_private.assiny_plan_baselines b where b.user_id=s.user_id)
     or not exists(select 1 from billing_private.assiny_window_reconciliation w where w.subscription_id=s.subscription_id))) then
  raise exception 'assiny_existing_bindings_require_base_plan_and_period_reconciliation';
 end if;
end $$;

alter table public.assiny_subscriptions add column paid_through timestamptz,
 add column last_paid_event_id text, add column last_paid_at timestamptz,
 add column cancelled_at timestamptz, add column revoked_at timestamptz;
create index assiny_subscriptions_expiry on public.assiny_subscriptions(paid_through) where mode='live' and user_id is not null;

create function billing_private.assiny_month_end(p_paid_at timestamptz)
returns timestamptz language sql immutable strict set search_path='' as $$
 select ((p_paid_at at time zone 'UTC') + interval '1 month') at time zone 'UTC'
$$;
revoke all on function billing_private.assiny_month_end(timestamptz) from public,anon,authenticated;
grant execute on function billing_private.assiny_month_end(timestamptz) to service_role;

-- Reconstruct only from recorded successful paid transitions, never received_at,
-- today's date, matching email or a cancelled/renewed flag without payment.
update public.assiny_subscriptions s set
 paid_through=case when r.revoked_at is not null then null else billing_private.assiny_month_end(p.occurred_at) end,
 last_paid_event_id=p.event_id,last_paid_at=p.occurred_at,
 cancelled_at=case when e.event_type in ('subscription.cancelled','subscription.canceled','subscription.expired','subscription.suspended') then e.occurred_at end,
 revoked_at=r.revoked_at
from public.assiny_events e,
 lateral (select x.mode,x.subscription_id,x.event_id,x.occurred_at from public.assiny_events x
   where x.mode=e.mode and x.subscription_id=e.subscription_id and x.outcome not in ('stale','conflict')
     and x.event_type in ('approved_purchase','subscription.paid','payment.approved','payment.paid','purchase.approved') and x.active
   order by x.occurred_at desc limit 1) p,
 lateral (select max(x.occurred_at) revoked_at from public.assiny_events x
   where x.mode=e.mode and x.subscription_id=e.subscription_id and x.outcome not in ('stale','conflict')
     and x.occurred_at>=p.occurred_at
     and x.event_type in ('refunded_purchase','charged_back','payment.refunded','payment.chargeback','purchase.refunded')) r
where e.mode=s.mode and e.event_id=s.last_event_id;
-- Existing linked customers use the independently reviewed period, rather than
-- assigning a historical provider period from the monthly fallback assumption.
update public.assiny_subscriptions s set paid_through=w.paid_through
 from billing_private.assiny_window_reconciliation w where s.mode='live' and s.user_id is not null and s.subscription_id=w.subscription_id;
update public.assiny_subscriptions set active=false where paid_through is null or paid_through<=now();

-- Internal lookup does not trust the denormalized profiles.plan for a managed
-- account. Cancellation stops renewal but does not shorten already paid access.
create function billing_private.effective_plan(p_user_id uuid)
returns text language sql stable security definer set search_path='' as $$
 select case max(rank) when 2 then 'business' when 1 then 'pro' else 'free' end from (
  select case coalesce(b.plan,p.plan) when 'business' then 2 when 'pro' then 1 else 0 end rank
   from public.profiles p left join billing_private.assiny_plan_baselines b on b.user_id=p.id where p.id=p_user_id
  union all
  select case s.plan when 'business' then 2 else 1 end from public.assiny_subscriptions s
   where s.mode='live' and s.user_id=p_user_id and s.verified_at is not null
     and s.paid_through>now() and s.revoked_at is null
 ) grants
$$;
revoke all on function billing_private.effective_plan(uuid) from public,anon,authenticated;
grant execute on function billing_private.effective_plan(uuid) to service_role;

-- Public RPC exposes only the caller's effective tier. No anonymous/cross-user
-- access to the private billing tables or an internal SECURITY DEFINER function.
create function public.get_effective_plan(p_user_id uuid)
returns text language plpgsql stable security definer set search_path='' as $$
begin
 if p_user_id is null or auth.uid() is distinct from p_user_id then
  raise exception 'plan_forbidden' using errcode='42501';
 end if;
 return billing_private.effective_plan(p_user_id);
end $$;
revoke all on function public.get_effective_plan(uuid) from public,anon;
grant execute on function public.get_effective_plan(uuid) to authenticated,service_role;

create function billing_private.refresh_assiny_profile(p_user_id uuid)
returns void language sql security invoker set search_path='' as $$
 update public.profiles set plan=billing_private.effective_plan(p_user_id)
 where id=p_user_id and plan is distinct from billing_private.effective_plan(p_user_id)
$$;
revoke all on function billing_private.refresh_assiny_profile(uuid) from public,anon,authenticated;
grant execute on function billing_private.refresh_assiny_profile(uuid) to service_role;

create or replace function public.ingest_assiny_event(
 p_mode text,p_event_id text,p_subscription_id text,p_event_type text,p_email text,
 p_plan text,p_active boolean,p_occurred_at timestamptz,p_payload_hash text
) returns jsonb language plpgsql security invoker set search_path='' as $$
declare
 v_existing public.assiny_events%rowtype; v_sub public.assiny_subscriptions%rowtype;
 v_outcome text; v_paid boolean; v_revoke boolean; v_cancel boolean;
begin
 v_paid:=p_event_type in ('approved_purchase','subscription.paid','payment.approved','payment.paid','purchase.approved');
 v_revoke:=p_event_type in ('refunded_purchase','charged_back','payment.refunded','payment.chargeback','purchase.refunded');
 v_cancel:=p_event_type in ('subscription.cancelled','subscription.canceled','subscription.expired','subscription.suspended');
 if p_mode is null or p_mode not in ('test','live') or p_plan is null or p_plan not in ('pro','business')
    or p_occurred_at is null or p_occurred_at>now()+interval '5 minutes' or p_active is null
    or nullif(trim(p_email),'') is null or p_event_type is null
    or not (v_paid or v_revoke or v_cancel) or p_active is distinct from v_paid then
  raise exception 'invalid_event';
 end if;
 perform pg_advisory_xact_lock(918409,2);
 select * into v_existing from public.assiny_events where mode=p_mode and event_id=p_event_id;
 if found then
  if v_existing.payload_hash<>p_payload_hash or v_existing.outcome='conflict' then return jsonb_build_object('outcome','conflict'); end if;
  return jsonb_build_object('outcome','duplicate','originalOutcome',v_existing.outcome);
 end if;
 select * into v_sub from public.assiny_subscriptions where mode=p_mode and subscription_id=p_subscription_id;
 if found and p_occurred_at<=v_sub.last_occurred_at then
  v_outcome := case when p_occurred_at=v_sub.last_occurred_at and
    (p_active<>v_sub.active or p_plan<>v_sub.plan or lower(p_email)<>v_sub.customer_email) then 'conflict' else 'stale' end;
 else
  v_outcome := case when p_mode='test' then 'test' when v_sub.user_id is null then 'pending_binding' else 'applied' end;
 end if;
 insert into public.assiny_events(mode,event_id,subscription_id,event_type,customer_email,plan,active,occurred_at,payload_hash,outcome)
 values(p_mode,p_event_id,p_subscription_id,p_event_type,lower(p_email),p_plan,p_active,p_occurred_at,p_payload_hash,v_outcome);
 if v_outcome in ('stale','conflict') then return jsonb_build_object('outcome',v_outcome); end if;
 insert into public.assiny_subscriptions(mode,subscription_id,customer_email,plan,active,last_event_id,last_occurred_at,
   paid_through,last_paid_event_id,last_paid_at,cancelled_at,revoked_at)
 values(p_mode,p_subscription_id,lower(p_email),coalesce(v_sub.plan,p_plan),p_active,p_event_id,p_occurred_at,
   case when v_paid then billing_private.assiny_month_end(p_occurred_at) when v_revoke then least(v_sub.paid_through,p_occurred_at) else v_sub.paid_through end,
   case when v_paid then p_event_id else v_sub.last_paid_event_id end,
   case when v_paid then p_occurred_at else v_sub.last_paid_at end,
   case when v_cancel then p_occurred_at when v_paid then null else v_sub.cancelled_at end,
   case when v_revoke then p_occurred_at when v_paid then null else v_sub.revoked_at end)
 on conflict(mode,subscription_id) do update set customer_email=excluded.customer_email,
   plan=case when v_paid then p_plan else public.assiny_subscriptions.plan end,
   active=excluded.active,last_event_id=excluded.last_event_id,last_occurred_at=excluded.last_occurred_at,
   paid_through=excluded.paid_through,last_paid_event_id=excluded.last_paid_event_id,last_paid_at=excluded.last_paid_at,
   cancelled_at=excluded.cancelled_at,revoked_at=excluded.revoked_at;
 if v_outcome='applied' then perform billing_private.refresh_assiny_profile(v_sub.user_id); end if;
 return jsonb_build_object('outcome',v_outcome);
end $$;

create or replace function public.bind_verified_assiny_subscription(p_subscription_id text,p_user_id uuid,p_verification_reference text,p_verified_by text)
returns void language plpgsql security invoker set search_path='' as $$
declare v_sub public.assiny_subscriptions%rowtype; v_plan text;
begin
 if length(trim(coalesce(p_verification_reference,'')))<10 or length(trim(coalesce(p_verified_by,'')))<3 then raise exception 'verification_required'; end if;
 perform pg_advisory_xact_lock(918409,2);
 select * into v_sub from public.assiny_subscriptions where mode='live' and subscription_id=p_subscription_id;
 if not found then raise exception 'unknown_subscription'; end if;
 select plan into v_plan from public.profiles where id=p_user_id for update;
 if not found then raise exception 'unknown_user'; end if;
 if v_sub.verified_at is not null then
  if v_sub.user_id is distinct from p_user_id then raise exception 'subscription_already_bound'; end if;
  perform billing_private.refresh_assiny_profile(p_user_id);
  return;
 end if;
 -- Snapshot once, before the first Assiny grant. Later bindings cannot snapshot
 -- the cached paid plan and accidentally convert it into a permanent grant.
 insert into billing_private.assiny_plan_baselines(user_id,plan,source) values(p_user_id,v_plan,'before-first-verified-assiny-binding') on conflict(user_id) do nothing;
 update public.assiny_subscriptions set user_id=p_user_id,verified_reference=p_verification_reference,verified_by=p_verified_by,verified_at=now()
 where mode='live' and subscription_id=p_subscription_id;
 perform billing_private.refresh_assiny_profile(p_user_id);
end $$;

-- Existing referral/manual grants retain their independent origin after binding.
-- Only a trusted server/operator can grant a permanent non-Assiny tier.
create function public.grant_non_assiny_plan(p_user_id uuid,p_plan text)
returns void language plpgsql security invoker set search_path='' as $$
declare v_plan text; begin
 if p_plan is null or p_plan not in ('pro','business') then raise exception 'invalid_plan'; end if;
 perform pg_advisory_xact_lock(918409,2);
 select plan into v_plan from public.profiles where id=p_user_id for update;
 if not found then raise exception 'unknown_user'; end if;
 if exists(select 1 from billing_private.assiny_plan_baselines where user_id=p_user_id) then
  update billing_private.assiny_plan_baselines set plan=case when plan='business' or p_plan='business' then 'business' else 'pro' end where user_id=p_user_id;
  perform billing_private.refresh_assiny_profile(p_user_id);
 else
  update public.profiles set plan=case when v_plan='business' or p_plan='business' then 'business' else 'pro' end where id=p_user_id;
 end if;
end $$;
revoke all on function public.grant_non_assiny_plan(uuid,text) from public,anon,authenticated;
grant execute on function public.grant_non_assiny_plan(uuid,text) to service_role;

-- Durable pg_cron invokes this function every minute (separate owner setup SQL).
-- Authorization already checks paid_through at request time; this refreshes
-- profiles.plan for public badges and reporting even if nobody signs in.
create function public.expire_assiny_access()
returns integer language plpgsql security invoker set search_path='' as $$
declare v_count integer; begin
 perform pg_advisory_xact_lock(918409,2);
 update public.assiny_subscriptions set active=false where mode='live' and active and (paid_through is null or paid_through<=now());
 update public.profiles p set plan=billing_private.effective_plan(p.id)
 where exists(select 1 from billing_private.assiny_plan_baselines b where b.user_id=p.id)
   and p.plan is distinct from billing_private.effective_plan(p.id);
 get diagnostics v_count=row_count;
 return v_count;
end $$;
revoke all on function public.expire_assiny_access() from public,anon,authenticated;
grant execute on function public.expire_assiny_access() to service_role;
select public.expire_assiny_access();

-- Enforce expiry in the existing database quota checks, including between cron runs.
CREATE OR REPLACE FUNCTION public.core_validate_proposal() RETURNS trigger LANGUAGE plpgsql SECURITY INVOKER SET search_path='' AS $$
DECLARE owner_id uuid; project_state text; user_plan text; used_count integer;
BEGIN
 IF NEW.proposed_price IS NOT NULL AND (NEW.proposed_price <= 0 OR NEW.proposed_price > 99999999) THEN RAISE EXCEPTION 'proposal_price_invalid' USING ERRCODE='23514'; END IF;
 IF length(trim(NEW.message)) < 10 OR length(NEW.message)>10000 THEN RAISE EXCEPTION 'proposal_message_invalid' USING ERRCODE='23514'; END IF;
 IF TG_OP='INSERT' THEN
   IF auth.uid() IS NULL OR NEW.freelancer_id<>auth.uid() OR NEW.status<>'pending' THEN RAISE EXCEPTION 'proposal_forbidden' USING ERRCODE='42501'; END IF;
   SELECT public.get_effective_plan(id) INTO user_plan FROM public.profiles WHERE id=auth.uid() FOR UPDATE;
   IF NOT FOUND THEN RAISE EXCEPTION 'profile_required' USING ERRCODE='42501'; END IF;
   SELECT client_id,status INTO owner_id,project_state FROM public.projects WHERE id=NEW.project_id;
   IF owner_id=auth.uid() OR project_state IS DISTINCT FROM 'open' THEN RAISE EXCEPTION 'project_not_open' USING ERRCODE='42501'; END IF;
   IF user_plan='free' THEN
     SELECT count(*) INTO used_count FROM public.proposals WHERE freelancer_id=auth.uid() AND created_at>=date_trunc('month',now() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC';
     IF used_count>=3 THEN RAISE EXCEPTION 'monthly_proposal_limit' USING ERRCODE='P0001'; END IF;
   END IF;
 ELSE
   IF NEW.project_id<>OLD.project_id OR NEW.freelancer_id<>OLD.freelancer_id THEN RAISE EXCEPTION 'proposal_owner_immutable' USING ERRCODE='42501'; END IF;
   SELECT client_id,status INTO owner_id,project_state FROM public.projects WHERE id=NEW.project_id;
   IF auth.uid()=NEW.freelancer_id THEN
     IF OLD.status<>'pending' OR NEW.status NOT IN ('pending','withdrawn') THEN RAISE EXCEPTION 'only_client_can_accept' USING ERRCODE='42501'; END IF;
   ELSIF auth.uid()=owner_id THEN
     IF NEW.message IS DISTINCT FROM OLD.message OR NEW.proposed_price IS DISTINCT FROM OLD.proposed_price OR OLD.status<>'pending' OR NEW.status NOT IN ('accepted','rejected') THEN RAISE EXCEPTION 'proposal_transition_invalid' USING ERRCODE='42501'; END IF;
     IF NEW.status='accepted' THEN
       SELECT status INTO project_state FROM public.projects WHERE id=NEW.project_id FOR UPDATE;
       IF project_state<>'open' THEN RAISE EXCEPTION 'project_not_open' USING ERRCODE='42501'; END IF;
     END IF;
   ELSE RAISE EXCEPTION 'proposal_forbidden' USING ERRCODE='42501'; END IF;
 END IF;
 RETURN NEW;
END $$;
REVOKE ALL ON FUNCTION public.core_validate_proposal() FROM PUBLIC,anon,authenticated;

create or replace function public.reserve_certo_ai(p_user_id uuid,p_feature text)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare
  v_plan text; v_count int; v_user_cost numeric; v_global_cost numeric;
  v_month timestamptz := date_trunc('month',now() at time zone 'UTC') at time zone 'UTC';
  v_limit numeric; v_id uuid;
begin
  if p_feature is null or p_feature not in ('rewrite','brief') then raise exception 'invalid_feature'; end if;
  -- One short transaction serializes global and user budget checks across every app instance.
  perform pg_advisory_xact_lock(918409,1);
  select billing_private.effective_plan(id) into v_plan from public.profiles where id=p_user_id for update;
  if v_plan is null or v_plan not in ('free','pro','business') then raise exception 'invalid_profile'; end if;
  select count(*) filter (where feature=p_feature),coalesce(sum(coalesce(actual_usd,reserved_usd)),0)
    into v_count,v_user_cost from public.certo_ai_requests where user_id=p_user_id and created_at>=v_month;
  if v_plan='free' and v_count>=3 then return jsonb_build_object('allowed',false,'reason','quota','plan',v_plan); end if;
  v_limit := case v_plan when 'pro' then 2 when 'business' then 5 else 0.30 end;
  if v_user_cost+0.01>v_limit then return jsonb_build_object('allowed',false,'reason','budget','plan',v_plan); end if;
  select coalesce(sum(coalesce(actual_usd,reserved_usd)),0) into v_global_cost from public.certo_ai_requests where created_at>=v_month;
  if v_global_cost+0.01>100 then return jsonb_build_object('allowed',false,'reason','global_budget','plan',v_plan); end if;
  insert into public.certo_ai_requests(user_id,feature,plan) values(p_user_id,p_feature,v_plan) returning id into v_id;
  return jsonb_build_object('allowed',true,'id',v_id,'plan',v_plan,'remainingFree',case when v_plan='free' then 2-v_count else null end);
end $$;
revoke all on function public.reserve_certo_ai(uuid,text) from public,anon,authenticated;
grant execute on function public.reserve_certo_ai(uuid,text) to service_role;


-- This existing policy also authorizes a paid action directly through PostgREST.
alter policy "dono cria a própria equipe" on public.teams
 with check (owner_id=(select auth.uid()) and public.get_effective_plan((select auth.uid()))='business');
notify pgrst,'reload schema';

commit;
