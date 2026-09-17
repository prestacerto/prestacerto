import test from 'node:test';
import assert from 'node:assert/strict';
import { hasOwnerGrant } from '../src/lib/auth/admin-role';

test('only the specific server-managed owner grant enables administration', () => {
  assert.equal(hasOwnerGrant({ app_metadata: { prestacerto_admin_role: 'super_admin' } }), true);
  for (const user of [
    {}, { app_metadata: {} }, { app_metadata: { role: 'super_admin' } },
    { app_metadata: { prestacerto_admin_role: 'admin' } },
    { app_metadata: { prestacerto_admin_role: true } },
    { app_metadata: {}, user_metadata: { prestacerto_admin_role: 'super_admin', role: 'admin' } },
  ]) assert.equal(hasOwnerGrant(user), false);
});
