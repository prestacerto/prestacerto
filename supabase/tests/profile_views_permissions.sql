INSERT INTO auth.users(id,email,role,aud,raw_user_meta_data) VALUES ('00000000-0000-4000-8000-000000000094','launch-views@example.invalid','authenticated','authenticated','{"role":"freelancer","full_name":"Teste de visualizações"}');
SET LOCAL ROLE anon;
INSERT INTO public.profile_views(freelancer_id,viewer_ip_hash) VALUES('00000000-0000-4000-8000-000000000094',repeat('a',32));
DO $$ BEGIN
 BEGIN INSERT INTO public.profile_views(freelancer_id,viewer_ip_hash,viewed_at) VALUES('00000000-0000-4000-8000-000000000094',repeat('b',32),'2020-01-01'); RAISE EXCEPTION 'TEST FAILED: spoofed time'; EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 BEGIN PERFORM count(*) FROM public.profile_views; RAISE EXCEPTION 'TEST FAILED: anonymous read'; EXCEPTION WHEN insufficient_privilege THEN NULL; END;
END $$;
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claims','{"sub":"00000000-0000-4000-8000-000000000094","role":"authenticated"}',true);
DO $$ BEGIN IF (SELECT count(*) FROM public.profile_views WHERE freelancer_id=auth.uid())<>1 THEN RAISE EXCEPTION 'TEST FAILED: owner count'; END IF; END $$;
SELECT set_config('request.jwt.claims','{"sub":"00000000-0000-4000-8000-000000000095","role":"authenticated"}',true);
DO $$ BEGIN IF EXISTS(SELECT 1 FROM public.profile_views) THEN RAISE EXCEPTION 'TEST FAILED: outsider count'; END IF; END $$;
RESET ROLE;
SELECT 'PASS: views owner-only, anonymous write only, timestamp protected' AS result;
