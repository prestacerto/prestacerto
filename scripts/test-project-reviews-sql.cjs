// Real PostgreSQL execution in an isolated in-memory PGlite database.
// PGLITE_MODULE=/path/to/node_modules/@electric-sql/pglite node scripts/test-project-reviews-sql.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { PGlite } = require(process.env.PGLITE_MODULE || '@electric-sql/pglite');
const root = path.resolve(__dirname, '..');
const uid = n => `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`;
const client = uid(1), provider = uid(2), stranger = uid(3), otherProvider = uid(4);
const database = new PGlite();
let assertions = 0;
async function as(role, user, fn) {
  await database.exec(`set role ${role}; select set_config('request.jwt.claim.sub', '${user || ''}', false);`);
  try { return await fn(); } finally { await database.exec('reset role'); }
}
async function denied(sql, params, code = '42501') {
  await assert.rejects(database.query(sql, params), error => error.code === code);
  assertions++;
}
const insert = 'insert into public.reviews(project_id,author_id,target_id,rating,comment) values ($1,$2,$3,$4,$5) returning id,rating,comment,created_at';
(async () => {
  try {
    // Only auth infrastructure and prerequisite schema are fixtures. Review SQL,
    // core grants, policies, proposal triggers and accepted uniqueness run as-is.
    await database.exec(`
      create role anon nologin; create role authenticated nologin; create role service_role nologin bypassrls;
      create schema auth; grant usage on schema auth, public to anon,authenticated,service_role;
      create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
      create table public.profiles(id uuid primary key,plan text default 'free');
      create table public.projects(id uuid primary key,client_id uuid references profiles,status text check(status in('open','in_progress','closed','cancelled')), category_id integer,title text,description text,skills text[],budget_min numeric,budget_max numeric,deadline_days integer);
      create table public.proposals(id uuid primary key default gen_random_uuid(),project_id uuid references projects,freelancer_id uuid references profiles,message text,proposed_price numeric,status text check(status in('pending','accepted','rejected','withdrawn')),created_at timestamptz default now());
      alter table public.profiles enable row level security; alter table public.projects enable row level security; alter table public.proposals enable row level security;
      grant select on profiles,projects to anon,authenticated;
      insert into profiles(id) values ('${client}'),('${provider}'),('${stranger}'),('${otherProvider}');
    `);
    for (let n = 10; n <= 20; n++) {
      await database.query('insert into projects(id,client_id,status) values ($1,$2,$3)', [uid(n), client, ({11:'open',12:'in_progress',13:'cancelled'})[n] || 'closed']);
      if (n !== 14) await database.query('insert into proposals(project_id,freelancer_id,message,status) values ($1,$2,$3,$4)', [uid(n), provider, 'Legitimate local fixture', n === 15 ? 'pending' : 'accepted']);
    }
    const core = fs.readFileSync(path.join(root, 'supabase/migrations/20260909142505_restore_core_marketplace_permissions.sql'),'utf8');
    const statements = core.split('\n').filter(line =>
      /^GRANT (INSERT|UPDATE).* ON public\.(projects|proposals) TO authenticated;/.test(line) ||
      /^CREATE POLICY core_(profiles_read|projects_|proposals_)/.test(line));
    await database.exec('grant select on proposals to authenticated;\n' + statements.join('\n'));
    await database.exec(core.slice(core.indexOf('-- Invoker triggers')));
    await database.exec(fs.readFileSync(path.join(root, 'supabase/migrations/20260912073848_client_project_reviews.sql'),'utf8'));
    await as('anon', null, async () => {
      await denied('select * from reviews');
      await denied(insert,[uid(10),client,provider,5,null]);
    });
    await as('authenticated', stranger, async () => {
      await denied(insert,[uid(10),stranger,provider,5,null]);
      await denied(insert,[uid(10),client,provider,5,null]);
    });
    await as('authenticated', provider, async () => {
      await denied(insert,[uid(10),provider,client,5,null]);
    });
    await as('authenticated', client, async () => {
      for (const n of [11,12,13,14,15]) await denied(insert,[uid(n),client,provider,5,null]);
      await denied(insert,[uid(10),client,otherProvider,5,null]);
      await denied(insert,[uid(10),client,client,5,null]);
      for (const rating of [0,6]) await denied(insert,[uid(10),client,provider,rating,null],'23514');
      await denied(insert,[uid(10),client,provider,5,'x'.repeat(2001)],'23514');
      await denied('insert into reviews(id,project_id,author_id,target_id,rating) values ($1,$2,$3,$4,5)',[uid(90),uid(10),client,provider]);
      await denied('insert into reviews(project_id,author_id,target_id,rating,created_at) values ($1,$2,$3,5,now())',[uid(10),client,provider]);
      const result = await database.query(insert,[uid(10),client,provider,1,'  A entrega atrasou. <script>alert(1)</script>  ']);
      assert.equal(result.rows[0].comment,'A entrega atrasou. <script>alert(1)</script>'); assertions++;
      assert.equal(result.rows[0].rating,1); assertions++;
      await denied(insert,[uid(10),client,provider,5,null],'23505');
      await denied('update reviews set rating=5');
      await denied('delete from reviews');
      // Two submitted requests: one persisted record. PGlite serializes queries;
      // this exercises the unique constraint, not multi-connection lock timing.
      const attempts = await Promise.allSettled([database.query(insert,[uid(16),client,provider,5,null]),database.query(insert,[uid(16),client,provider,2,null])]);
      assert.equal(attempts.filter(result=>result.status==='fulfilled').length,1); assertions++;
      assert.equal(attempts.find(result=>result.status==='rejected').reason.code,'23505'); assertions++;
      assert.equal((await database.query('select count(*)::int as n from reviews')).rows[0].n,2); assertions++;
      await denied('select public.validate_client_project_review()');
    });
    await as('authenticated', stranger, async () => {
      assert.equal((await database.query('select * from reviews')).rows.length,0); assertions++;
    });
    await as('authenticated', provider, async () => {
      assert.equal((await database.query('select * from reviews')).rows.length,2); assertions++;
      await denied('update reviews set rating=5');
    });
    await as('service_role', null, async () => {
      assert.equal((await database.query('select * from reviews')).rows.length,2); assertions++;
      await denied(insert,[uid(17),client,provider,5,null]);
    });
    // A stale API eligibility check cannot authorize a later insert.
    await database.query("update projects set status='in_progress' where id=$1",[uid(17)]);
    await as('authenticated', client, async () => { await denied(insert,[uid(17),client,provider,5,null]); });
    // Migration intentionally fails rather than replacing existing data/schema.
    await assert.rejects(database.exec(fs.readFileSync(path.join(root,'supabase/migrations/20260912073848_client_project_reviews.sql'),'utf8')), error => error.code==='42P07'); assertions++;
    await database.exec('rollback');
    assert.equal((await database.query('select count(*)::int as n from reviews')).rows[0].n,2); assertions++;
    console.log(`PASS: ${assertions} PostgreSQL review assertions; local fixtures only, no production access.`);
  } finally { await database.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
