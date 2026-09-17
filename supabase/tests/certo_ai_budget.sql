-- Execute in a transaction and ROLLBACK; no customer data or paid provider calls.
INSERT INTO auth.users(id,email,role,aud,raw_user_meta_data) VALUES
('00000000-0000-4000-8000-000000000096','ai-budget-test@example.invalid','authenticated','authenticated','{"role":"freelancer"}');
SET LOCAL ROLE authenticated;
DO $$ BEGIN
 BEGIN PERFORM public.reserve_certo_ai('00000000-0000-4000-8000-000000000096','rewrite'); RAISE EXCEPTION 'TEST FAILED: client reserved'; EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 BEGIN PERFORM count(*) FROM public.certo_ai_requests; RAISE EXCEPTION 'TEST FAILED: client read ledger'; EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 BEGIN PERFORM public.finish_certo_ai(gen_random_uuid(),'fake',0,0); RAISE EXCEPTION 'TEST FAILED: client changed cost'; EXCEPTION WHEN insufficient_privilege THEN NULL; END;
END $$;
SET LOCAL ROLE service_role;
DO $$ DECLARE r jsonb; v_id uuid; BEGIN
 FOR i IN 1..3 LOOP
  r:=public.reserve_certo_ai('00000000-0000-4000-8000-000000000096','rewrite');
  IF NOT (r->>'allowed')::boolean OR (r->>'remainingFree')::int<>3-i THEN RAISE EXCEPTION 'TEST FAILED: free allowance'; END IF;
  v_id := (r->>'id')::uuid;
 END LOOP;
 r:=public.reserve_certo_ai('00000000-0000-4000-8000-000000000096','rewrite');
 IF r->>'reason'<>'quota' THEN RAISE EXCEPTION 'TEST FAILED: fourth request'; END IF;
 r:=public.reserve_certo_ai('00000000-0000-4000-8000-000000000096','brief');
 IF NOT (r->>'allowed')::boolean THEN RAISE EXCEPTION 'TEST FAILED: independent brief allowance'; END IF;
 PERFORM public.finish_certo_ai(v_id,'budget-test-completion',1000,400);
 PERFORM public.finish_certo_ai(v_id,'budget-test-completion',0,0);
 IF (SELECT actual_usd FROM public.certo_ai_requests WHERE id=v_id)<>0.00039 THEN RAISE EXCEPTION 'TEST FAILED: settlement or idempotence'; END IF;
END $$;
RESET ROLE;
UPDATE public.profiles SET plan='pro' WHERE id='00000000-0000-4000-8000-000000000096';
SET LOCAL ROLE service_role;
DO $$ DECLARE r jsonb; BEGIN
 r:=public.reserve_certo_ai('00000000-0000-4000-8000-000000000096','rewrite');
 IF NOT (r->>'allowed')::boolean OR r->>'plan'<>'pro' OR r->>'remainingFree' IS NOT NULL THEN RAISE EXCEPTION 'TEST FAILED: pro mapping'; END IF;
END $$;
RESET ROLE;
-- Force the monthly budget to its boundary in rollback-only fixtures.
INSERT INTO public.certo_ai_requests(user_id,feature,plan)
SELECT '00000000-0000-4000-8000-000000000096','rewrite','pro' FROM generate_series(1,200);
SET LOCAL ROLE service_role;
DO $$ BEGIN
 IF public.reserve_certo_ai('00000000-0000-4000-8000-000000000096','rewrite')->>'reason'<>'budget' THEN RAISE EXCEPTION 'TEST FAILED: pro cost ceiling'; END IF;
END $$;
RESET ROLE;
UPDATE public.profiles SET plan='business' WHERE id='00000000-0000-4000-8000-000000000096';
SET LOCAL ROLE service_role;
DO $$ BEGIN
 IF NOT (public.reserve_certo_ai('00000000-0000-4000-8000-000000000096','rewrite')->>'allowed')::boolean THEN RAISE EXCEPTION 'TEST FAILED: business mapping'; END IF;
END $$;
RESET ROLE;
-- Previous month does not consume current allowance.
UPDATE public.certo_ai_requests SET created_at=now()-interval '2 months' WHERE user_id='00000000-0000-4000-8000-000000000096';
UPDATE public.profiles SET plan='free' WHERE id='00000000-0000-4000-8000-000000000096';
SET LOCAL ROLE service_role;
DO $$ BEGIN
 IF NOT (public.reserve_certo_ai('00000000-0000-4000-8000-000000000096','rewrite')->>'allowed')::boolean THEN RAISE EXCEPTION 'TEST FAILED: monthly reset'; END IF;
END $$;
RESET ROLE;
INSERT INTO public.certo_ai_requests(feature,plan) SELECT 'rewrite','free' FROM generate_series(1,10000);
SET LOCAL ROLE service_role;
DO $$ BEGIN
 IF public.reserve_certo_ai('00000000-0000-4000-8000-000000000096','brief')->>'reason'<>'global_budget' THEN RAISE EXCEPTION 'TEST FAILED: global ceiling'; END IF;
END $$;
RESET ROLE;
SELECT 'PASS: client access, free quota, brief quota, settlement, idempotence, Pro, Business, month boundary, global budget' AS result;
