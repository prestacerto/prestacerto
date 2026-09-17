import test from 'node:test';
import assert from 'node:assert/strict';
import { createCheckoutReference, verifyCheckoutReference } from '../src/lib/payments/checkout-reference';
const user = 'a3b6c537-bbe3-4d7f-91bc-6b2979174914';
const secret = 'test-only-signing-key-not-for-production';
const now = Date.parse('2026-09-01T12:00:00Z');
const paid = new Date(now + 60000).toISOString();
test('reference is opaque and bound to the authenticated account and chosen plan', () => {
  const reference = createCheckoutReference(user, 'pro', secret, now);
  assert.ok(!reference.includes(user));
  assert.equal(verifyCheckoutReference(reference, 'pro', secret, paid), user);
  assert.equal(verifyCheckoutReference(reference, 'business', secret, paid), null);
  assert.equal(verifyCheckoutReference(reference, 'pro', secret + '-wrong', paid), null);
  assert.notEqual(createCheckoutReference(user, 'pro', secret, now), reference);
});
test('tampering, malformed references and invalid timing cannot assign a paid plan', () => {
  const reference = createCheckoutReference(user, 'pro', secret, now);
  const parts = reference.split('.'); parts[2] = (parts[2][0] === 'a' ? 'b' : 'a') + parts[2].slice(1);
  for (const value of ['', 'pc1.bad.value.tag', parts.join('.'), reference + '.extra', 'x'.repeat(601)]) {
    assert.equal(verifyCheckoutReference(value, 'pro', secret, paid), null);
  }
  for (const time of ['invalid', new Date(now - 600000).toISOString(), new Date(now + 15 * 86400000).toISOString()]) {
    assert.equal(verifyCheckoutReference(reference, 'pro', secret, time), null);
  }
  assert.throws(() => createCheckoutReference(user, 'pro', 'short', now));
});
