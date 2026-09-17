-- Run only inside BEGIN/ROLLBACK. No payment provider is contacted.
insert into public.pending_subscriptions(email,plan,subscription_id,status) values('ledger-test@example.invalid','business','legacy-test','active');
insert into auth.users(id,email,role,aud,raw_user_meta_data) values
('00000000-0000-4000-8000-000000000097','ledger-test@example.invalid','authenticated','authenticated','{"role":"freelancer"}'),
('00000000-0000-4000-8000-000000000098','ledger-other@example.invalid','authenticated','authenticated','{"role":"freelancer"}');
do $$ begin
 if (select plan from public.profiles where id='00000000-0000-4000-8000-000000000097')<>'free' then raise exception 'TEST FAILED: signup claimed paid email'; end if;
 if not exists(select 1 from public.pending_subscriptions where email='ledger-test@example.invalid') then raise exception 'TEST FAILED: historical purchase deleted'; end if;
end $$;
set local role authenticated;
do $$ begin
 begin perform count(*) from public.assiny_events; raise exception 'TEST FAILED: browser sees events'; exception when insufficient_privilege then null; end;
 begin perform public.bind_verified_assiny_subscription('s1','00000000-0000-4000-8000-000000000097','verified-receipt','test operator'); raise exception 'TEST FAILED: browser binds subscription'; exception when insufficient_privilege then null; end;
 begin perform public.ingest_assiny_event('live','e1','s1','subscription.paid','ledger-test@example.invalid','pro',true,now()-interval '3 days',repeat('a',64)); raise exception 'TEST FAILED: browser delivers event'; exception when insufficient_privilege then null; end;
end $$;
set local role service_role;
do $$ declare r jsonb; begin
 r:=public.ingest_assiny_event('test','e1','s1','subscription.paid','ledger-test@example.invalid','pro',true,now()-interval '3 days',repeat('a',64));
 if r->>'outcome'<>'test' then raise exception 'TEST FAILED: test mode'; end if;
 r:=public.ingest_assiny_event('live','e1','s1','subscription.paid','ledger-test@example.invalid','pro',true,now()-interval '3 days',repeat('a',64));
 if r->>'outcome'<>'pending_binding' then raise exception 'TEST FAILED: live event bound by email'; end if;
 if (select plan from public.profiles where id='00000000-0000-4000-8000-000000000097')<>'free' then raise exception 'TEST FAILED: event grants unverified user'; end if;
 begin perform public.bind_verified_assiny_subscription('s1','00000000-0000-4000-8000-000000000097','',''); raise exception 'TEST FAILED: missing proof accepted'; exception when raise_exception then if sqlerrm<>'verification_required' then raise; end if; end;
 perform public.bind_verified_assiny_subscription('s1','00000000-0000-4000-8000-000000000097','test-proof-verified-owner','test operator');
 if (select plan from public.profiles where id='00000000-0000-4000-8000-000000000097')<>'pro' then raise exception 'TEST FAILED: verified grant'; end if;
 begin perform public.bind_verified_assiny_subscription('s1','00000000-0000-4000-8000-000000000098','test-proof-wrong-owner','test operator'); raise exception 'TEST FAILED: reassignment accepted'; exception when raise_exception then if sqlerrm<>'subscription_already_bound' then raise; end if; end;
 perform public.ingest_assiny_event('live','e2','s2','subscription.paid','ledger-test@example.invalid','pro',true,now()-interval '3 days',repeat('b',64));
 perform public.bind_verified_assiny_subscription('s2','00000000-0000-4000-8000-000000000097','test-proof-second-receipt','test operator');
 r:=public.ingest_assiny_event('live','e3','s1','subscription.cancelled','ledger-test@example.invalid','pro',false,now()-interval '2 days',repeat('c',64));
 if r->>'outcome'<>'applied' then raise exception 'TEST FAILED: cancellation application'; end if;
 if (select plan from public.profiles where id='00000000-0000-4000-8000-000000000097')<>'pro' then raise exception 'TEST FAILED: cancelled another subscription'; end if;
 r:=public.ingest_assiny_event('live','e3','s1','subscription.cancelled','ledger-test@example.invalid','pro',false,now()-interval '2 days',repeat('c',64));
 if r->>'outcome'<>'duplicate' or (select count(*) from public.assiny_events where mode='live' and event_id='e3')<>1 then raise exception 'TEST FAILED: duplicate side effects'; end if;
 r:=public.ingest_assiny_event('live','e3','s1','subscription.paid','ledger-test@example.invalid','pro',true,now()-interval '1 day',repeat('d',64));
 if r->>'outcome'<>'conflict' then raise exception 'TEST FAILED: event id reused'; end if;
 r:=public.ingest_assiny_event('live','e4','s1','subscription.paid','ledger-test@example.invalid','pro',true,now()-interval '3 days',repeat('d',64));
 if r->>'outcome'<>'stale' then raise exception 'TEST FAILED: older event not detected'; end if;
 if (select active from public.assiny_subscriptions where mode='live' and subscription_id='s1') then raise exception 'TEST FAILED: stale event reactivated'; end if;
 r:=public.ingest_assiny_event('live','e5','s1','subscription.paid','ledger-test@example.invalid','pro',true,now()-interval '2 days',repeat('e',64));
 if r->>'outcome'<>'conflict' then raise exception 'TEST FAILED: equal time conflict'; end if;
 r:=public.ingest_assiny_event('live','e5','s1','subscription.paid','ledger-test@example.invalid','pro',true,now()-interval '2 days',repeat('e',64));
 if r->>'outcome'<>'conflict' then raise exception 'TEST FAILED: conflict replay ignored'; end if;
 perform public.ingest_assiny_event('live','e6','s3','subscription.paid','ledger-test@example.invalid','business',true,now()-interval '3 days',repeat('f',64));
 perform public.bind_verified_assiny_subscription('s3','00000000-0000-4000-8000-000000000097','test-proof-business-receipt','test operator');
 if (select plan from public.profiles where id='00000000-0000-4000-8000-000000000097')<>'business' then raise exception 'TEST FAILED: highest active tier'; end if;
 perform public.ingest_assiny_event('live','e7','s3','payment.refunded','ledger-test@example.invalid','business',false,now()-interval '2 days',repeat('1',64));
 if (select plan from public.profiles where id='00000000-0000-4000-8000-000000000097')<>'pro' then raise exception 'TEST FAILED: fallback active Pro'; end if;
 perform public.ingest_assiny_event('live','e8','s2','payment.refunded','ledger-test@example.invalid','pro',false,now()-interval '2 days',repeat('2',64));
 if (select plan from public.profiles where id='00000000-0000-4000-8000-000000000097')<>'pro' then raise exception 'TEST FAILED: cancelled subscription lost paid access'; end if;
 if (select plan from public.profiles where id='00000000-0000-4000-8000-000000000098')<>'free' then raise exception 'TEST FAILED: unrelated user affected'; end if;
end $$;
reset role;
select 'PASS: no email claiming, browser permissions, test isolation, verified binding, immutable ownership, duplicate delivery, event conflicts, ordering, multiple subscriptions, tier fallback and cancellation' as result;
