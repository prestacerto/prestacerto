-- Event contract must be confirmed against an authenticated Assiny delivery before live mode.
-- Test deliveries are isolated from live subscriptions and never grant access.
create table public.assiny_events (
  mode text not null check (mode in ('test','live')),
  event_id text not null check (length(event_id) between 1 and 200),
  subscription_id text not null check (length(subscription_id) between 1 and 200),
  event_type text not null,
  customer_email text not null,
  plan text not null check (plan in ('pro','business')),
  active boolean not null,
  occurred_at timestamptz not null,
  received_at timestamptz not null default now(),
  payload_hash text not null check (payload_hash ~ '^[a-f0-9]{64}$'),
  outcome text not null check (outcome in ('pending_binding','applied','stale','conflict','test')),
  primary key (mode,event_id)
);
create index assiny_events_subscription on public.assiny_events(mode,subscription_id,occurred_at);
create table public.assiny_subscriptions (
  mode text not null check (mode in ('test','live')),
  subscription_id text not null,
  user_id uuid references public.profiles(id) on delete set null,
  customer_email text not null,
  plan text not null check (plan in ('pro','business')),
  active boolean not null,
  last_event_id text not null,
  last_occurred_at timestamptz not null,
  verified_reference text,
  verified_by text,
  verified_at timestamptz,
  primary key (mode,subscription_id),
  foreign key (mode,last_event_id) references public.assiny_events(mode,event_id),
  constraint assiny_binding_verified check (user_id is null or (mode='live' and verified_reference is not null and verified_by is not null and verified_at is not null))
);
create index assiny_subscriptions_user on public.assiny_subscriptions(user_id) where user_id is not null;
alter table public.assiny_events enable row level security;
alter table public.assiny_subscriptions enable row level security;
revoke all on public.assiny_events,public.assiny_subscriptions from public,anon,authenticated;
grant select,insert,update on public.assiny_events,public.assiny_subscriptions to service_role;

-- Never grant paid access from a matching signup email: Auth currently auto-confirms it.
-- Preserve historical rows for reconciliation; do not delete customer purchase records.
create or replace function public.apply_pending_subscription()
returns trigger language plpgsql security invoker set search_path='' as $$
begin return new; end $$;
revoke all on function public.apply_pending_subscription() from public,anon,authenticated;

create function public.ingest_assiny_event(
 p_mode text,p_event_id text,p_subscription_id text,p_event_type text,p_email text,
 p_plan text,p_active boolean,p_occurred_at timestamptz,p_payload_hash text
) returns jsonb language plpgsql security invoker set search_path='' as $$
declare
 v_existing public.assiny_events%rowtype; v_sub public.assiny_subscriptions%rowtype;
 v_outcome text; v_plan text;
begin
 if p_mode is null or p_mode not in ('test','live') or p_plan is null or p_plan not in ('pro','business')
    or p_occurred_at is null or p_occurred_at>now()+interval '5 minutes' or p_active is null
    or nullif(trim(p_email),'') is null or nullif(trim(p_event_type),'') is null then
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
 insert into public.assiny_subscriptions(mode,subscription_id,customer_email,plan,active,last_event_id,last_occurred_at)
 values(p_mode,p_subscription_id,lower(p_email),p_plan,p_active,p_event_id,p_occurred_at)
 on conflict(mode,subscription_id) do update set customer_email=excluded.customer_email,plan=excluded.plan,
 active=excluded.active,last_event_id=excluded.last_event_id,last_occurred_at=excluded.last_occurred_at;
 if v_outcome='applied' then
  select case when bool_or(plan='business') then 'business' when bool_or(plan='pro') then 'pro' else 'free' end
   into v_plan from public.assiny_subscriptions where mode='live' and user_id=v_sub.user_id and active;
  update public.profiles set plan=v_plan where id=v_sub.user_id;
 end if;
 return jsonb_build_object('outcome',v_outcome);
end $$;
revoke all on function public.ingest_assiny_event(text,text,text,text,text,text,boolean,timestamptz,text) from public,anon,authenticated;
grant execute on function public.ingest_assiny_event(text,text,text,text,text,text,boolean,timestamptz,text) to service_role;

-- Internal reconciliation only. No public HTTP endpoint may expose this function.
-- A trusted operator must independently verify purchaser/account ownership and supply a reference.
create function public.bind_verified_assiny_subscription(p_subscription_id text,p_user_id uuid,p_verification_reference text,p_verified_by text)
returns void language plpgsql security invoker set search_path='' as $$
declare v_sub public.assiny_subscriptions%rowtype; v_plan text;
begin
 if length(trim(coalesce(p_verification_reference,'')))<10 or length(trim(coalesce(p_verified_by,'')))<3 then raise exception 'verification_required'; end if;
 perform pg_advisory_xact_lock(918409,2);
 select * into v_sub from public.assiny_subscriptions where mode='live' and subscription_id=p_subscription_id;
 if not found then raise exception 'unknown_subscription'; end if;
 if p_user_id is null or not exists(select 1 from public.profiles where id=p_user_id) then raise exception 'unknown_user'; end if;
 if v_sub.verified_at is not null then
  if v_sub.user_id is distinct from p_user_id then raise exception 'subscription_already_bound'; end if;
  return;
 end if;
 update public.assiny_subscriptions set user_id=p_user_id,verified_reference=p_verification_reference,verified_by=p_verified_by,verified_at=now()
 where mode='live' and subscription_id=p_subscription_id;
 select case when bool_or(plan='business') then 'business' when bool_or(plan='pro') then 'pro' else 'free' end
  into v_plan from public.assiny_subscriptions where mode='live' and user_id=p_user_id and active;
 update public.profiles set plan=v_plan where id=p_user_id;
end $$;
revoke all on function public.bind_verified_assiny_subscription(text,uuid,text,text) from public,anon,authenticated;
grant execute on function public.bind_verified_assiny_subscription(text,uuid,text,text) to service_role;
