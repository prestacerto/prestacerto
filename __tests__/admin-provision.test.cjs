const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('scripts/provision-admin.cjs', 'utf8');
async function run(options = {}) {
  const calls = [], messages = [];
  let user = options.existing ? { id: 'existing', app_metadata: { unrelated: 'preserved' } } : null;
  const service = { auth: { admin: {
    listUsers: async () => ({ data: { users: [{ id: 'unrelated', email: 'unrelated@example.invalid' }, { id: 'target', email: 'admin@example.invalid', app_metadata: { unrelated: 'preserved' } }] } }),
    getUserById: async () => ({ data: { user }, error: options.invalidKey ? {} : null }),
    updateUserById: async (id, attrs) => { calls.push(['update', attrs, id]); user = { ...user, id, ...attrs }; return { data: { user } }; },
    createUser: async attrs => {
      calls.push(['create', attrs]);
      if (options.invalidKey || options.conflictingAccount) return { error: { code: options.conflictingAccount ? 'email_exists' : 'rejected' }, data: {} };
      user = { id: 'created', app_metadata: attrs.app_metadata }; return { data: { user } };
    },
  } } };
  const session = { auth: {
    signInWithPassword: async () => ({ data: { user }, error: user ? null : {} }),
    getUser: async () => ({ data: { user } }), signOut: async () => { calls.push(['signout']); },
  } };
  const proc = { env: {
    PRESTA_PROVISION_ADMIN: options.disabled ? undefined : 'true',
    PRESTA_ADMIN_UPDATE_EXISTING: options.updateExisting ? 'true' : undefined,
    NEXT_PUBLIC_SUPABASE_URL: 'https://taktwwwpcyxhyylzmgho.supabase.co',
    SUPABASE_SECRET_KEY: 'test-server-key', NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-anon',
    PRESTA_ADMIN_EMAIL: 'admin@example.invalid', PRESTA_ADMIN_PASSWORD: 'test-password-only',
  } };
  vm.runInNewContext(source, { process: proc,
    require: () => ({ createClient: (_url, key) => key === 'test-server-key' ? service : session }),
    console: { log: text => messages.push(text), error: (...parts) => messages.push(parts.join(' ')) },
  });
  await new Promise(resolve => setImmediate(resolve));
  return { calls, messages, user, exitCode: proc.exitCode };
}
test('ordinary builds cannot provision administrators', async () => {
  assert.deepEqual((await run({ disabled: true })).calls, []);
});
test('new administrator is created through server metadata, verified and signed out', async () => {
  const r = await run(); assert.equal(r.exitCode, undefined);
  const creation = r.calls.find(([name]) => name === 'create')[1];
  assert.equal(creation.app_metadata.prestacerto_admin_role, 'super_admin');
  assert.equal(creation.user_metadata.prestacerto_admin_role, undefined);
  assert.equal(r.calls.filter(([name]) => name === 'signout').length, 2);
  assert.ok(!r.messages.join('').includes('test-password-only'));
});
test('existing account retains metadata and password', async () => {
  const r = await run({ existing: true }); assert.equal(r.exitCode, undefined);
  const update = r.calls.find(([name]) => name === 'update')[1];
  assert.equal(update.password, undefined);
  assert.equal(update.app_metadata.unrelated, 'preserved');
  assert.equal(r.calls.some(([name]) => name === 'create'), false);
});
test('a conflicting account or rejected administrative credential fails closed', async () => {
  for (const opts of [{ conflictingAccount: true }, { invalidKey: true, existing: true }]) {
    const r = await run(opts); assert.equal(r.exitCode, 1);
    assert.equal(r.calls.some(([name]) => name === 'update'), false);
  }
});
test('explicit existing-account update affects only the requested email and retains metadata', async () => {
  const r = await run({ conflictingAccount: true, updateExisting: true });
  assert.equal(r.exitCode, undefined);
  const update = r.calls.find(([name]) => name === 'update')[1];
  assert.equal(update.password, 'test-password-only');
  assert.equal(update.app_metadata.unrelated, 'preserved');
  assert.equal(update.app_metadata.prestacerto_admin_role, 'super_admin');
  assert.equal(r.calls.find(([name]) => name === 'update')[2], 'target');
  assert.ok(!r.messages.join('').includes('test-password-only'));
});
