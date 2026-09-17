import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseNativeAssinyEvent, nativeAssinyEventId } from '../src/lib/payments/assiny-native';

const fixture = () => JSON.parse(readFileSync('__tests__/fixtures/assiny-approved.json', 'utf8'));
test('documented Assiny approval identifies exact offer, subscription and stable transaction', () => {
  const payload = fixture();
  const parsed = parseNativeAssinyEvent(payload);
  assert.equal(parsed.kind, 'subscription');
  if (parsed.kind !== 'subscription') return;
  assert.equal(parsed.plan, 'pro');
  assert.equal(parsed.email, 'test@example.invalid');
  assert.equal(parsed.subscriptionId, payload.data.offer.subscription.id);
  assert.equal(parsed.eventId, nativeAssinyEventId('approved_purchase', payload.data.transaction.id));
  assert.equal(parsed.occurredAt, '2026-09-01T12:00:00.296Z');
  assert.equal(parsed.active, true);
});
test('Business uses the confirmed offer and R$139.90, regardless of display name', () => {
  const payload = fixture();
  payload.data.offer.id = '2a179bd8-be01-4acd-89ac-e29dfe8d546e';
  payload.data.offer.name = 'Renamed offer';
  payload.data.offer.amount = payload.data.transaction.amount = 13990;
  const parsed = parseNativeAssinyEvent(payload);
  assert.equal(parsed.kind, 'subscription');
  if (parsed.kind === 'subscription') assert.equal(parsed.plan, 'business');
});
test('wrong product, organization, price, currency and unpaid status never grant access', () => {
  const changes = [
    (p: ReturnType<typeof fixture>) => { p.data.offer.product.id = p.data.transaction.id; },
    (p: ReturnType<typeof fixture>) => { p.data.transaction.project.id = p.data.transaction.id; },
    (p: ReturnType<typeof fixture>) => { p.data.transaction.project.organization.id = p.data.transaction.id; },
    (p: ReturnType<typeof fixture>) => { p.data.offer.id = p.data.transaction.id; },
    (p: ReturnType<typeof fixture>) => { p.data.offer.amount = 1; },
    (p: ReturnType<typeof fixture>) => { p.data.transaction.amount = 1; },
    (p: ReturnType<typeof fixture>) => { p.data.transaction.currency = 'USD'; },
    (p: ReturnType<typeof fixture>) => { p.data.transaction.status = 'pending'; },
    (p: ReturnType<typeof fixture>) => { p.data.offer.subscription = null; },
    (p: ReturnType<typeof fixture>) => { p.data.offer.subscription.recurrence = 'YEARLY'; },
    (p: ReturnType<typeof fixture>) => { p.data.transaction.updated_at = '2099-01-01T00:00:00Z'; },
  ];
  for (const change of changes) {
    const payload = fixture(); change(payload);
    assert.equal(parseNativeAssinyEvent(payload).kind, 'invalid');
  }
});
test('refunds without a subscription require reconciliation with the exact recorded purchase', () => {
  const payload = fixture();
  payload.event = 'refunded_purchase';
  payload.data.transaction.status = 'refunded';
  delete payload.data.offer.subscription;
  const parsed = parseNativeAssinyEvent(payload);
  assert.equal(parsed.kind, 'unresolved');
  if (parsed.kind === 'unresolved') {
    assert.equal(parsed.event.active, false);
    assert.equal(parsed.purchaseEventId, nativeAssinyEventId('approved_purchase', payload.data.transaction.id));
  }
});
test('chargebacks deactivate and delivery retries retain identity', () => {
  const payload = fixture(); payload.event = 'charged_back'; payload.data.transaction.status = 'chargedback';
  const first = parseNativeAssinyEvent(payload);
  const retry = parseNativeAssinyEvent({ ...payload, delivery_attempt: 2 });
  assert.deepEqual(first, retry);
  assert.equal(first.kind, 'subscription');
  if (first.kind === 'subscription') assert.equal(first.active, false);
});
test('undocumented lifecycle events return a visible error instead of false success', () => {
  assert.deepEqual(parseNativeAssinyEvent({ event: 'unverified_subscription_renewal' }), {
    kind: 'invalid', reason: 'unsupported_assiny_event',
  });
});
