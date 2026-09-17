-- OWNER-ONLY SETUP: target taktwwwpcyxhyylzmgho, after the lifecycle migration
-- and reconciliation pass. Do not run in another Supabase project.
-- This file is not automatically applied by app deploys or migration tests.
begin;
create extension if not exists pg_cron with schema pg_catalog;
do $$ begin
 if to_regprocedure('public.expire_assiny_access()') is null then raise exception 'assiny_lifecycle_migration_required';end if;
end $$;
-- Same name updates the existing job: repeated setup cannot create duplicates.
select cron.schedule('prestacerto-assiny-expiry','* * * * *','select public.expire_assiny_access();');
commit;
-- Check this job and a SUCCESSFUL scheduled run before enabling application rollout.
select jobid,jobname,schedule,command,active from cron.job where jobname='prestacerto-assiny-expiry';
select status,start_time,end_time,return_message from cron.job_run_details
 where jobid=(select jobid from cron.job where jobname='prestacerto-assiny-expiry')
 order by start_time desc limit 5;
