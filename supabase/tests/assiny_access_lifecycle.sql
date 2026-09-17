-- Execute inside BEGIN/ROLLBACK. Synthetic identities only; no provider traffic.
insert into auth.users(id,email,raw_user_meta_data) values
('00000000-0000-4000-8000-000000000071','expiry@example.invalid','{"role":"freelancer"}'),
('00000000-0000-4000-8000-000000000072','grant@example.invalid','{"role":"freelancer"}'),
('00000000-0000-4000-8000-000000000073','owner@example.invalid','{"role":"client"}');
update profiles set plan='pro' where id='00000000-0000-4000-8000-000000000072';
do $$ begin
 if billing_private.assiny_month_end('2025-01-31 12:34:56+00')<>'2025-02-28 12:34:56+00'::timestamptz then raise exception 'January month clamp failed'; end if;
 if billing_private.assiny_month_end('2024-01-31 12:34:56+00')<>'2024-02-29 12:34:56+00'::timestamptz then raise exception 'leap month clamp failed'; end if;
 if billing_private.assiny_month_end('2025-12-31 12:34:56+00')<>'2026-01-31 12:34:56+00'::timestamptz then raise exception 'year boundary failed'; end if;
end $$;
set local time zone 'America/Sao_Paulo';
do $$ begin
 if billing_private.assiny_month_end('2025-01-31 23:34:56+00')<>'2025-02-28 23:34:56+00'::timestamptz then raise exception 'session timezone changed window'; end if;
end $$;
set local role service_role;
do $$ declare u uuid:='00000000-0000-4000-8000-000000000071'; t timestamptz:=now()-interval '2 days'; deadline timestamptz; r jsonb; begin
 perform ingest_assiny_event('live','paid-1','paid-sub','approved_purchase','expiry@example.invalid','business',true,t,repeat('a',64));
 perform bind_verified_assiny_subscription('paid-sub',u,'independent-proof','test operator');
 select paid_through into deadline from assiny_subscriptions where subscription_id='paid-sub';
 if deadline<>billing_private.assiny_month_end(t) then raise exception 'window not based on approval time'; end if;
 perform ingest_assiny_event('live','cancel-1','paid-sub','subscription.cancelled','expiry@example.invalid','business',false,t+interval '1 hour',repeat('b',64));
 if billing_private.effective_plan(u)<>'business' then raise exception 'cancel shortened paid period'; end if;
 r:=ingest_assiny_event('live','paid-1','paid-sub','approved_purchase','expiry@example.invalid','business',true,t,repeat('a',64));
 if r->>'outcome'<>'duplicate' then raise exception 'payment retry not deduplicated'; end if;
 r:=ingest_assiny_event('live','paid-replay','paid-sub','approved_purchase','expiry@example.invalid','business',true,t,repeat('c',64));
 if r->>'outcome'<>'stale' then raise exception 'stale approval widened'; end if;
 if (select paid_through from assiny_subscriptions where subscription_id='paid-sub')<>deadline then raise exception 'duplicate/cancel widened window'; end if;
 begin perform ingest_assiny_event('live','renewed','paid-sub','subscription.renewed','expiry@example.invalid','business',true,now(),repeat('d',64));raise exception 'unpaid renewal accepted';exception when raise_exception then if sqlerrm<>'invalid_event' then raise;end if;end;
 perform ingest_assiny_event('live','refund-1','paid-sub','refunded_purchase','expiry@example.invalid','business',false,t+interval '2 hours',repeat('d',64));
 if billing_private.effective_plan(u)<>'free' then raise exception 'refund did not revoke immediately'; end if;
 perform ingest_assiny_event('live','cancel-2','paid-sub','subscription.cancelled','expiry@example.invalid','business',false,t+interval '3 hours',repeat('e',64));
 if billing_private.effective_plan(u)<>'free' then raise exception 'cancel restored refund'; end if;
 perform ingest_assiny_event('live','paid-2','paid-sub','approved_purchase','expiry@example.invalid','pro',true,t+interval '4 hours',repeat('f',64));
 if billing_private.effective_plan(u)<>'pro' then raise exception 'new payment did not restore purchased tier'; end if;
 if (select paid_through from assiny_subscriptions where subscription_id='paid-sub')<>billing_private.assiny_month_end(t+interval '4 hours') then raise exception 'renewal added a month twice'; end if;
 -- Simulate the wall clock crossing the deadline before cron gets CPU time.
 update assiny_subscriptions set paid_through=now() where subscription_id='paid-sub';
 if (select plan from profiles where id=u)<>'pro' or billing_private.effective_plan(u)<>'free' then raise exception 'effective plan trusted stale cache'; end if;
 perform expire_assiny_access();
 if (select plan from profiles where id=u)<>'free' then raise exception 'cron cache did not expire'; end if;
 if expire_assiny_access()<>0 then raise exception 'cron is not idempotent'; end if;
 -- A second binding must not snapshot the paid cache into a permanent baseline.
 perform ingest_assiny_event('live','multi-pro','multi-pro','approved_purchase','expiry@example.invalid','pro',true,t,repeat('1',64));
 perform bind_verified_assiny_subscription('multi-pro',u,'independent-proof-pro','test operator');
 perform ingest_assiny_event('live','multi-biz','multi-biz','approved_purchase','expiry@example.invalid','business',true,t,repeat('2',64));
 perform bind_verified_assiny_subscription('multi-biz',u,'independent-proof-biz','test operator');
 update assiny_subscriptions set paid_through=now() where subscription_id='multi-biz';
 if billing_private.effective_plan(u)<>'pro' then raise exception 'highest valid tier fallback failed'; end if;
 update assiny_subscriptions set paid_through=now() where subscription_id='multi-pro';
 if billing_private.effective_plan(u)<>'free' then raise exception 'second binding froze paid grant'; end if;
 -- Independent grant before binding survives chargeback.
 perform ingest_assiny_event('live','manual-paid','manual-sub','approved_purchase','grant@example.invalid','business',true,t,repeat('3',64));
 perform bind_verified_assiny_subscription('manual-sub','00000000-0000-4000-8000-000000000072','independent-proof-grant','test operator');
 perform ingest_assiny_event('live','manual-refund','manual-sub','charged_back','grant@example.invalid','business',false,t+interval '1 hour',repeat('4',64));
 if billing_private.effective_plan('00000000-0000-4000-8000-000000000072')<>'pro' then raise exception 'preexisting manual grant removed'; end if;
 -- Independent referral grant AFTER binding survives expiry too.
 perform grant_non_assiny_plan(u,'pro');
 if billing_private.effective_plan(u)<>'pro' then raise exception 'post-binding referral lost'; end if;
end $$;
reset role;
-- Revoke the synthetic independent grant to exercise Free backend quotas.
update billing_private.assiny_plan_baselines set plan='free' where user_id='00000000-0000-4000-8000-000000000071';
update profiles set plan='business' where id='00000000-0000-4000-8000-000000000071';
set local role service_role;
do $$ declare r jsonb;begin
 for i in 1..3 loop r:=reserve_certo_ai('00000000-0000-4000-8000-000000000071','rewrite');if r->>'plan'<>'free' or r->>'allowed'<>'true' then raise exception 'AI budget ignores expiry';end if;end loop;
 r:=reserve_certo_ai('00000000-0000-4000-8000-000000000071','rewrite');if r->>'allowed'<>'false' or r->>'reason'<>'quota' then raise exception 'expired AI quota bypass';end if;
end $$;
reset role;
insert into projects(id,client_id,title,description,status) values('00000000-0000-4000-8000-000000000074','00000000-0000-4000-8000-000000000073','SQL expiry QA','Synthetic private transaction for expiry tests','open');
-- No real email, billing ledger or other user's tier is visible to a browser.
set local role anon;
do $$ begin begin perform get_effective_plan('00000000-0000-4000-8000-000000000071');raise exception 'anonymous plan lookup allowed';exception when insufficient_privilege then null;end;end $$;
set local role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-4000-8000-000000000071',true);
do $$ begin
 if get_effective_plan('00000000-0000-4000-8000-000000000071')<>'free' then raise exception 'own effective RPC stale';end if;
 begin perform get_effective_plan('00000000-0000-4000-8000-000000000072');raise exception 'cross-user plan lookup allowed';exception when insufficient_privilege then null;end;
 begin perform billing_private.effective_plan('00000000-0000-4000-8000-000000000072');raise exception 'private lookup allowed';exception when insufficient_privilege then null;end;
 begin perform expire_assiny_access();raise exception 'browser expiry mutation allowed';exception when insufficient_privilege then null;end;
 begin perform grant_non_assiny_plan('00000000-0000-4000-8000-000000000071','business');raise exception 'browser grant allowed';exception when insufficient_privilege then null;end;
end $$;
-- Real proposal trigger must enforce Free limits even while profiles.plan=business.
insert into proposals(project_id,freelancer_id,message,status) values('00000000-0000-4000-8000-000000000074','00000000-0000-4000-8000-000000000071','First synthetic proposal','pending');
-- Schema enforces one proposal per project, so use distinct projects below.
reset role;
insert into projects(id,client_id,title,description,status) values
('00000000-0000-4000-8000-000000000075','00000000-0000-4000-8000-000000000073','SQL expiry QA','Synthetic expiry test','open'),
('00000000-0000-4000-8000-000000000076','00000000-0000-4000-8000-000000000073','SQL expiry QA','Synthetic expiry test','open'),
('00000000-0000-4000-8000-000000000077','00000000-0000-4000-8000-000000000073','SQL expiry QA','Synthetic expiry test','open');
grant select,insert on teams to authenticated;
set local role authenticated;
insert into proposals(project_id,freelancer_id,message,status) values
('00000000-0000-4000-8000-000000000075','00000000-0000-4000-8000-000000000071','Second synthetic proposal','pending'),
('00000000-0000-4000-8000-000000000076','00000000-0000-4000-8000-000000000071','Third synthetic proposal','pending');
do $$ begin
 begin insert into proposals(project_id,freelancer_id,message,status) values('00000000-0000-4000-8000-000000000077','00000000-0000-4000-8000-000000000071','Fourth synthetic proposal','pending');raise exception 'expired proposal quota bypass';exception when raise_exception then if sqlerrm<>'monthly_proposal_limit' then raise;end if;end;
 begin insert into teams(owner_id,name) values('00000000-0000-4000-8000-000000000071','Expired QA team');raise exception 'expired team quota bypass';exception when insufficient_privilege then null;end;
end $$;
select set_config('request.jwt.claim.sub','',true);
do $$ begin begin perform get_effective_plan('00000000-0000-4000-8000-000000000071');raise exception 'missing UID lookup allowed';exception when insufficient_privilege then null;end;end $$;
reset role;
select 'PASS paid monthly lifecycle, cancellation, revocation, replay, grants, expiry, backend quotas and RPC permissions';
