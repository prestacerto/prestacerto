-- Restores the real authenticated marketplace path without administrative keys.
-- Existing user data is preserved. Test this migration in a rolled-back transaction first.
SET LOCAL lock_timeout = '5s';

-- RLS does not protect TRUNCATE; client roles never need these DDL privileges.
REVOKE TRUNCATE, REFERENCES, TRIGGER ON ALL TABLES IN SCHEMA public FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.reset_monthly_connects() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user_connects() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.apply_pending_subscription() FROM PUBLIC, anon, authenticated;

DO $$ DECLARE p record; BEGIN
  FOR p IN SELECT tablename,policyname FROM pg_policies WHERE schemaname='public'
    AND tablename IN ('profiles','projects','proposals','messages','services','project_contacts')
  LOOP EXECUTE format('DROP POLICY %I ON public.%I',p.policyname,p.tablename); END LOOP;
END $$;

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS headline text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS resume_url text;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_contacts ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.profiles,public.projects,public.proposals,public.messages,public.services,public.project_contacts FROM anon,authenticated;
GRANT SELECT ON public.profiles,public.projects,public.services,public.categories TO anon,authenticated;
-- Server-owned plan/email/identity cannot be changed by a normal account.
GRANT INSERT (id,role,full_name,city,state,bio,avatar_url,contact_email,contact_phone,headline,resume_url) ON public.profiles TO authenticated;
GRANT UPDATE (role,full_name,city,state,bio,avatar_url,contact_email,contact_phone,headline,resume_url) ON public.profiles TO authenticated;
GRANT INSERT (client_id,category_id,title,description,skills,budget_min,budget_max,deadline_days,status) ON public.projects TO authenticated;
GRANT UPDATE (category_id,title,description,skills,budget_min,budget_max,deadline_days,status) ON public.projects TO authenticated;
GRANT SELECT ON public.proposals,public.messages,public.project_contacts TO authenticated;
GRANT INSERT (project_id,freelancer_id,message,proposed_price,status) ON public.proposals TO authenticated;
GRANT UPDATE (message,proposed_price,status) ON public.proposals TO authenticated;
GRANT INSERT (proposal_id,sender_id,body) ON public.messages TO authenticated;
GRANT UPDATE (read_at) ON public.messages TO authenticated;
GRANT INSERT (freelancer_id,category_id,title,description,skills,price_hour,delivery_days,is_active) ON public.services TO authenticated;
GRANT UPDATE (category_id,title,description,skills,price_hour,delivery_days,is_active) ON public.services TO authenticated;
GRANT DELETE ON public.services TO authenticated;
GRANT INSERT (project_id,contact_email,contact_phone) ON public.project_contacts TO authenticated;
GRANT UPDATE (contact_email,contact_phone) ON public.project_contacts TO authenticated;

CREATE POLICY core_profiles_read ON public.profiles FOR SELECT TO anon,authenticated USING (true);
CREATE POLICY core_profiles_insert ON public.profiles FOR INSERT TO authenticated WITH CHECK(id=(SELECT auth.uid()));
CREATE POLICY core_profiles_update ON public.profiles FOR UPDATE TO authenticated USING(id=(SELECT auth.uid())) WITH CHECK(id=(SELECT auth.uid()));
CREATE POLICY core_projects_read ON public.projects FOR SELECT TO anon,authenticated USING(true);
CREATE POLICY core_projects_insert ON public.projects FOR INSERT TO authenticated WITH CHECK(client_id=(SELECT auth.uid()) AND status='open');
CREATE POLICY core_projects_update ON public.projects FOR UPDATE TO authenticated USING(client_id=(SELECT auth.uid())) WITH CHECK(client_id=(SELECT auth.uid()));
CREATE POLICY core_proposals_read ON public.proposals FOR SELECT TO authenticated USING(freelancer_id=(SELECT auth.uid()) OR EXISTS(SELECT 1 FROM public.projects p WHERE p.id=project_id AND p.client_id=(SELECT auth.uid())));
CREATE POLICY core_proposals_insert ON public.proposals FOR INSERT TO authenticated WITH CHECK(freelancer_id=(SELECT auth.uid()) AND status='pending' AND EXISTS(SELECT 1 FROM public.projects p WHERE p.id=project_id AND p.status='open' AND p.client_id<>(SELECT auth.uid())));
CREATE POLICY core_proposals_update ON public.proposals FOR UPDATE TO authenticated USING(freelancer_id=(SELECT auth.uid()) OR EXISTS(SELECT 1 FROM public.projects p WHERE p.id=project_id AND p.client_id=(SELECT auth.uid()))) WITH CHECK(freelancer_id=(SELECT auth.uid()) OR EXISTS(SELECT 1 FROM public.projects p WHERE p.id=project_id AND p.client_id=(SELECT auth.uid())));
CREATE POLICY core_messages_read ON public.messages FOR SELECT TO authenticated USING(EXISTS(SELECT 1 FROM public.proposals p JOIN public.projects j ON j.id=p.project_id WHERE p.id=proposal_id AND (p.freelancer_id=(SELECT auth.uid()) OR j.client_id=(SELECT auth.uid()))));
CREATE POLICY core_messages_insert ON public.messages FOR INSERT TO authenticated WITH CHECK(sender_id=(SELECT auth.uid()) AND length(trim(body)) BETWEEN 1 AND 10000 AND EXISTS(SELECT 1 FROM public.proposals p JOIN public.projects j ON j.id=p.project_id WHERE p.id=proposal_id AND (p.freelancer_id=(SELECT auth.uid()) OR j.client_id=(SELECT auth.uid()))));
CREATE POLICY core_messages_read_receipt ON public.messages FOR UPDATE TO authenticated USING(sender_id<>(SELECT auth.uid()) AND EXISTS(SELECT 1 FROM public.proposals p JOIN public.projects j ON j.id=p.project_id WHERE p.id=proposal_id AND (p.freelancer_id=(SELECT auth.uid()) OR j.client_id=(SELECT auth.uid())))) WITH CHECK(sender_id<>(SELECT auth.uid()) AND EXISTS(SELECT 1 FROM public.proposals p JOIN public.projects j ON j.id=p.project_id WHERE p.id=proposal_id AND (p.freelancer_id=(SELECT auth.uid()) OR j.client_id=(SELECT auth.uid()))));
CREATE POLICY core_services_read ON public.services FOR SELECT TO anon,authenticated USING(is_active OR freelancer_id=(SELECT auth.uid()));
CREATE POLICY core_services_insert ON public.services FOR INSERT TO authenticated WITH CHECK(freelancer_id=(SELECT auth.uid()));
CREATE POLICY core_services_update ON public.services FOR UPDATE TO authenticated USING(freelancer_id=(SELECT auth.uid())) WITH CHECK(freelancer_id=(SELECT auth.uid()));
CREATE POLICY core_services_delete ON public.services FOR DELETE TO authenticated USING(freelancer_id=(SELECT auth.uid()));
CREATE POLICY core_contacts_read ON public.project_contacts FOR SELECT TO authenticated USING(EXISTS(SELECT 1 FROM public.projects j WHERE j.id=project_id AND j.client_id=(SELECT auth.uid())) OR EXISTS(SELECT 1 FROM public.proposals p WHERE p.project_id=project_contacts.project_id AND p.freelancer_id=(SELECT auth.uid()) AND p.status='accepted'));
CREATE POLICY core_contacts_insert ON public.project_contacts FOR INSERT TO authenticated WITH CHECK(EXISTS(SELECT 1 FROM public.projects j WHERE j.id=project_id AND j.client_id=(SELECT auth.uid())));
CREATE POLICY core_contacts_update ON public.project_contacts FOR UPDATE TO authenticated USING(EXISTS(SELECT 1 FROM public.projects j WHERE j.id=project_id AND j.client_id=(SELECT auth.uid()))) WITH CHECK(EXISTS(SELECT 1 FROM public.projects j WHERE j.id=project_id AND j.client_id=(SELECT auth.uid())));

-- Invoker triggers keep all ownership checks under the caller's RLS permissions.
CREATE OR REPLACE FUNCTION public.core_validate_proposal() RETURNS trigger LANGUAGE plpgsql SECURITY INVOKER SET search_path='' AS $$
DECLARE owner_id uuid; project_state text; user_plan text; used_count integer;
BEGIN
 IF NEW.proposed_price IS NOT NULL AND (NEW.proposed_price <= 0 OR NEW.proposed_price > 99999999) THEN RAISE EXCEPTION 'proposal_price_invalid' USING ERRCODE='23514'; END IF;
 IF length(trim(NEW.message)) < 10 OR length(NEW.message)>10000 THEN RAISE EXCEPTION 'proposal_message_invalid' USING ERRCODE='23514'; END IF;
 IF TG_OP='INSERT' THEN
   IF auth.uid() IS NULL OR NEW.freelancer_id<>auth.uid() OR NEW.status<>'pending' THEN RAISE EXCEPTION 'proposal_forbidden' USING ERRCODE='42501'; END IF;
   SELECT plan INTO user_plan FROM public.profiles WHERE id=auth.uid() FOR UPDATE;
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
CREATE TRIGGER core_validate_proposal BEFORE INSERT OR UPDATE ON public.proposals FOR EACH ROW EXECUTE FUNCTION public.core_validate_proposal();
CREATE OR REPLACE FUNCTION public.core_finalize_acceptance() RETURNS trigger LANGUAGE plpgsql SECURITY INVOKER SET search_path='' AS $$
BEGIN
 IF NEW.status='accepted' AND OLD.status<>'accepted' THEN
   UPDATE public.projects SET status='in_progress' WHERE id=NEW.project_id AND client_id=auth.uid() AND status='open';
   IF NOT FOUND THEN RAISE EXCEPTION 'project_not_open' USING ERRCODE='42501'; END IF;
   UPDATE public.proposals SET status='rejected' WHERE project_id=NEW.project_id AND id<>NEW.id AND status='pending';
 END IF;
 RETURN NEW;
END $$;
REVOKE ALL ON FUNCTION public.core_finalize_acceptance() FROM PUBLIC,anon,authenticated;
CREATE TRIGGER core_finalize_acceptance AFTER UPDATE ON public.proposals FOR EACH ROW EXECUTE FUNCTION public.core_finalize_acceptance();
CREATE UNIQUE INDEX core_one_accepted_proposal_per_project ON public.proposals(project_id) WHERE status='accepted';
NOTIFY pgrst,'reload schema';
