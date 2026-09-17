// Local in-memory PostgreSQL tests. Never connects to Supabase or a provider.
const {PGlite}=require(process.env.PGLITE_MODULE_PATH || '@electric-sql/pglite');const fs=require('node:fs');const path=require('node:path');
const repo=path.resolve(__dirname,'..');
(async()=>{const db=new PGlite();await db.exec(`
create role anon; create role authenticated; create role service_role bypassrls;
create schema auth;
create table auth.users(id uuid primary key,email text,role text,aud text,raw_user_meta_data jsonb default '{}'::jsonb);
create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
grant usage on schema public,auth to anon,authenticated,service_role;
grant execute on function auth.uid() to anon,authenticated,service_role;
alter default privileges in schema public grant all on tables to service_role;
alter default privileges in schema public grant usage,select on sequences to service_role,authenticated;`);
for(const file of ['0001_init.sql','0002_reviews_payments_teams.sql','0031_connects_system.sql','0036_auto_create_profile.sql','0042_assinify_subscriptions.sql','20260909142505_restore_core_marketplace_permissions.sql','20260909144926_certo_ai_atomic_budget.sql','20260909151701_assiny_event_ledger.sql']){const sql=fs.readFileSync(path.join(repo,'supabase/migrations',file),'utf8').replace(/^create extension if not exists "pgcrypto";$/m,'').replace(/^(begin;|commit;)$/gm,'');await db.exec('begin;'+sql+'commit;');}
const migration=fs.readFileSync(path.join(repo,'supabase/migrations/20260912073037_assiny_access_lifecycle.sql'),'utf8').replace(/^(begin;|commit;)$/gm,'');
await db.exec(`begin;insert into auth.users(id,email) values('00000000-0000-4000-8000-000000000081','bound@example.invalid');select ingest_assiny_event('live','old','bound','subscription.paid','bound@example.invalid','pro',true,now()-interval '2 days',repeat('a',64));select bind_verified_assiny_subscription('bound','00000000-0000-4000-8000-000000000081','operator-verified','operator');`);
let blocked=false;try{await db.exec(migration);}catch(e){if(e.message!=='assiny_existing_bindings_require_base_plan_and_period_reconciliation')throw e;blocked=true;}if(!blocked)throw Error('guard failed');await db.exec('rollback;');console.log('PASS migration blocks unreconciled bindings');
// A baseline alone cannot authorize inventing the paid period for an existing customer.
const seedBound=`insert into auth.users(id,email) values('00000000-0000-4000-8000-000000000081','bound@example.invalid');select ingest_assiny_event('live','old','bound','subscription.paid','bound@example.invalid','pro',true,now()-interval '2 days',repeat('a',64));select bind_verified_assiny_subscription('bound','00000000-0000-4000-8000-000000000081','operator-verified','operator');`;
const baseline=`insert into billing_private.assiny_plan_baselines(user_id,plan,source) values('00000000-0000-4000-8000-000000000081','free','independent-record');`;
await db.exec('begin;'+seedBound);
let periodBlocked=false;try{await db.exec(migration.replace('-- OPERATOR RECONCILIATION POINT:',baseline+'\n-- OPERATOR RECONCILIATION POINT:'));}catch(e){if(e.message!=='assiny_existing_bindings_require_base_plan_and_period_reconciliation')throw e;periodBlocked=true;}
if(!periodBlocked)throw Error('period reconciliation guard failed');await db.exec('rollback;');console.log('PASS baseline alone cannot bypass period reconciliation');
await db.exec('begin;'+seedBound);
const reviewed=baseline+`insert into billing_private.assiny_window_reconciliation(subscription_id,paid_through,verification_reference,verified_by) values('bound',now()+interval '5 days','verified-provider-period','test operator');`;
await db.exec(migration.replace('-- OPERATOR RECONCILIATION POINT:',reviewed+'\n-- OPERATOR RECONCILIATION POINT:'));
await db.exec(`do $$ begin if (select paid_through from assiny_subscriptions where subscription_id='bound')<>now()+interval '5 days' then raise exception 'reconciled period ignored';end if; if (select plan from profiles where id='00000000-0000-4000-8000-000000000081')<>'pro' then raise exception 'reviewed paid access lost';end if;end $$;`);
await db.exec('rollback;');console.log('PASS reviewed baseline and period migrate without changing earned access');
await db.exec(`insert into auth.users(id,email) values('00000000-0000-4000-8000-000000000082','manual@example.invalid');update profiles set plan='business' where id='00000000-0000-4000-8000-000000000082';select ingest_assiny_event('live','old-unbound','unbound','subscription.paid','unbound@example.invalid','pro',true,now()-interval '2 months',repeat('a',64));
select ingest_assiny_event('live','old-refund-paid','unbound-refund','subscription.paid','unbound@example.invalid','pro',true,now()-interval '3 days',repeat('b',64));select ingest_assiny_event('live','old-refund','unbound-refund','payment.refunded','unbound@example.invalid','pro',false,now()-interval '2 days',repeat('c',64));select ingest_assiny_event('live','old-cancel','unbound-refund','subscription.cancelled','unbound@example.invalid','pro',false,now()-interval '1 day',repeat('d',64));`);
await db.exec('begin;'+migration+'commit;');console.log('PASS migration executes');
await db.exec(`do $$ begin if (select plan from profiles where id='00000000-0000-4000-8000-000000000082')<>'business' then raise exception 'manual grant removed'; end if; if (select paid_through>now() from assiny_subscriptions where subscription_id='unbound') then raise exception 'old unbound widened'; end if; if (select paid_through is not null or revoked_at is null from assiny_subscriptions where subscription_id='unbound-refund') then raise exception 'refund then cancel backfill restored access'; end if; end $$;`);console.log('PASS historical backfill and grants');
for(const file of ['assiny_event_ledger.sql','certo_ai_budget.sql','assiny_access_lifecycle.sql']){await db.exec('begin;'+fs.readFileSync(path.join(repo,'supabase/tests',file),'utf8')+'rollback;');console.log('PASS',file);}
console.log("RESULT: 8 SQL verification groups passed, 0 failed; pg_cron requires owner verification on Supabase.");await db.close();})().catch(e=>{console.error(e.message,e.query?.slice(0,100));process.exitCode=1});
