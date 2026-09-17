-- Run inside a transaction and ROLLBACK. Fixture users never become visible.
INSERT INTO auth.users(id,email,role,aud,raw_user_meta_data) VALUES
 ('00000000-0000-4000-8000-000000000091','launch-client@example.invalid','authenticated','authenticated','{"role":"client","full_name":"Teste transacional cliente"}'),
 ('00000000-0000-4000-8000-000000000092','launch-worker@example.invalid','authenticated','authenticated','{"role":"freelancer","full_name":"Teste transacional profissional"}'),
 ('00000000-0000-4000-8000-000000000093','launch-outsider@example.invalid','authenticated','authenticated','{"role":"freelancer","full_name":"Teste transacional terceiro"}');
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claims','{"sub":"00000000-0000-4000-8000-000000000091","role":"authenticated"}',true);
INSERT INTO public.projects(client_id,title,description,budget_min,budget_max,status) SELECT auth.uid(),'Validação transacional '||n,'Validação de permissões sem publicação persistente.',100,200,'open' FROM generate_series(1,4) n;
UPDATE public.profiles SET role='both',bio='Perfil de teste',headline='Profissional',resume_url='https://example.invalid/curriculo.pdf' WHERE id=auth.uid();
DO $$ BEGIN
 BEGIN UPDATE public.profiles SET plan='business' WHERE id=auth.uid(); RAISE EXCEPTION 'TEST FAILED: paid plan changed'; EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 BEGIN UPDATE public.profiles SET email='changed@example.invalid' WHERE id=auth.uid(); RAISE EXCEPTION 'TEST FAILED: identity changed'; EXCEPTION WHEN insufficient_privilege THEN NULL; END;
END $$;
SELECT set_config('request.jwt.claims','{"sub":"00000000-0000-4000-8000-000000000092","role":"authenticated"}',true);
INSERT INTO public.services(freelancer_id,title,description,skills) VALUES(auth.uid(),'Serviço transacional','Apenas teste de permissão',ARRAY['Design']);
INSERT INTO public.proposals(project_id,freelancer_id,message,proposed_price) SELECT id,auth.uid(),'Proposta transacional para validar o fluxo.',NULL FROM public.projects WHERE client_id='00000000-0000-4000-8000-000000000091' ORDER BY title LIMIT 3;
DO $$ BEGIN
 BEGIN INSERT INTO public.proposals(project_id,freelancer_id,message) SELECT id,auth.uid(),'Quarta proposta deve ser bloqueada.' FROM public.projects WHERE client_id='00000000-0000-4000-8000-000000000091' AND title='Validação transacional 4'; RAISE EXCEPTION 'TEST FAILED: quota ignored'; EXCEPTION WHEN raise_exception THEN IF SQLERRM<>'monthly_proposal_limit' THEN RAISE; END IF; END;
 BEGIN UPDATE public.proposals SET status='accepted' WHERE freelancer_id=auth.uid(); RAISE EXCEPTION 'TEST FAILED: freelancer self-accept'; EXCEPTION WHEN insufficient_privilege THEN NULL; END;
END $$;
INSERT INTO public.messages(proposal_id,sender_id,body) SELECT id,auth.uid(),'Mensagem do profissional' FROM public.proposals WHERE freelancer_id=auth.uid() LIMIT 1;
SELECT set_config('test.proposal_id',(SELECT id::text FROM public.proposals WHERE freelancer_id=auth.uid() LIMIT 1),true);
SELECT set_config('request.jwt.claims','{"sub":"00000000-0000-4000-8000-000000000093","role":"authenticated"}',true);
DO $$ BEGIN
 BEGIN INSERT INTO public.messages(proposal_id,sender_id,body) VALUES(current_setting('test.proposal_id')::uuid,auth.uid(),'Terceiro não autorizado'); RAISE EXCEPTION 'TEST FAILED: outsider sent message'; EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 IF EXISTS(SELECT 1 FROM public.proposals WHERE freelancer_id='00000000-0000-4000-8000-000000000092') THEN RAISE EXCEPTION 'TEST FAILED: outsider sees proposals'; END IF;
 IF EXISTS(SELECT 1 FROM public.messages WHERE sender_id='00000000-0000-4000-8000-000000000092') THEN RAISE EXCEPTION 'TEST FAILED: outsider sees messages'; END IF;
END $$;
-- A second legitimate freelancer competes on the first project.
INSERT INTO public.proposals(project_id,freelancer_id,message) SELECT id,auth.uid(),'Proposta do segundo profissional.' FROM public.projects WHERE client_id='00000000-0000-4000-8000-000000000091' AND title='Validação transacional 1';
SELECT set_config('request.jwt.claims','{"sub":"00000000-0000-4000-8000-000000000091","role":"authenticated"}',true);
DO $$ BEGIN
 IF (SELECT count(*) FROM public.messages m JOIN public.proposals p ON p.id=m.proposal_id WHERE p.freelancer_id='00000000-0000-4000-8000-000000000092')<>1 THEN RAISE EXCEPTION 'TEST FAILED: client cannot read reply'; END IF;
END $$;
UPDATE public.proposals SET status='accepted' WHERE freelancer_id='00000000-0000-4000-8000-000000000092' AND project_id IN (SELECT id FROM public.projects WHERE client_id=auth.uid() AND title='Validação transacional 1');
DO $$ BEGIN
 IF NOT EXISTS(SELECT 1 FROM public.projects WHERE client_id=auth.uid() AND title='Validação transacional 1' AND status='in_progress') THEN RAISE EXCEPTION 'TEST FAILED: project not started'; END IF;
 IF NOT EXISTS(SELECT 1 FROM public.proposals WHERE freelancer_id='00000000-0000-4000-8000-000000000093' AND status='rejected') THEN RAISE EXCEPTION 'TEST FAILED: alternative not rejected'; END IF;
END $$;
INSERT INTO public.messages(proposal_id,sender_id,body) SELECT id,auth.uid(),'Resposta do cliente' FROM public.proposals WHERE freelancer_id='00000000-0000-4000-8000-000000000092' AND status='accepted';
UPDATE public.projects SET status='closed' WHERE client_id=auth.uid() AND title='Validação transacional 1';
SET LOCAL ROLE anon;
DO $$ BEGIN
 IF has_table_privilege(current_user,'public.profiles','TRUNCATE') THEN RAISE EXCEPTION 'TEST FAILED: anonymous truncate'; END IF;
 BEGIN PERFORM count(*) FROM public.messages; RAISE EXCEPTION 'TEST FAILED: anonymous messages'; EXCEPTION WHEN insufficient_privilege THEN NULL; END;
END $$;
RESET ROLE;
SELECT 'PASS: profile, publication, proposals, quota, participants, acceptance, messages, completion and protected fields' AS result;
