import { z } from 'zod';
import type { PaidPlan } from './assiny';

// Verified in the authenticated Assiny product/offers screen on 2026-09-11.
const PRODUCT = '490249da-426e-4ab5-9d48-6b0db8f02db5';
const PROJECT = 'bbfcef58-addc-46de-a50d-44c8b45ee2de';
const ORGANIZATION = '0b3d8901-87a5-46cb-ae8c-59e6e2f332e2';
const OFFERS: Record<string, { plan: PaidPlan; cents: number }> = {
  'ea5a3151-adc5-403f-adec-85c2ca6c801d': { plan: 'pro', cents: 5990 },
  '2a179bd8-be01-4acd-89ac-e29dfe8d546e': { plan: 'business', cents: 9990 },
  // Oferta "CERTO PREMIUM" no Assiny: mesmo produto, R$99,90 mensal; é o checkout atual do Business.
  '2d0ac8d3-31b1-4914-856c-85ee12f9240e': { plan: 'business', cents: 9990 },
};
const EVENTS: Record<string, { active: boolean; status: string }> = {
  approved_purchase: { active: true, status: 'paid' },
  refunded_purchase: { active: false, status: 'refunded' },
  charged_back: { active: false, status: 'chargedback' },
};
const NON_ENTITLEMENT_EVENTS = new Set([
  'refused', 'completed_purchase', 'bank_slip_generated',
  'pix_generated', 'pix_expired', 'abandoned_checkout', 'request_refund',
]);
const id = z.string().uuid();
const timestamp = z.iso.datetime({ offset: true });
const schema = z.object({
  event: z.string(),
  data: z.object({
    offer: z.object({
      id, amount: z.number().int().positive(), recurrence: z.string().nullable(),
      product: z.object({ id }),
      subscription: z.object({ id, recurrence: z.string(), cycle: z.number().int().positive().optional() }).nullish(),
    }),
    transaction: z.object({
      id, amount: z.number().int().positive(), currency: z.literal('BRL'),
      status: z.string(), updated_at: timestamp,
      payment_method: z.string().max(40).nullish(),
      project: z.object({ id, organization: z.object({ id }) }),
    }),
    client: z.object({ email: z.string().trim().email().max(320) }),
    metadata: z.object({ utm_content: z.string().max(600).nullish() }).optional(),
    payment: z.object({ method: z.string().max(40).nullish() }).nullish(),
  }),
});

export type NativeAssinyEvent = {
  kind: 'subscription'; event: string; email: string; plan: PaidPlan;
  active: boolean; subscriptionId: string; eventId: string; occurredAt: string;
  checkoutReference?: string;
  offerId: string; amountCents: number; paymentMethod: string | null;
};
export type NativeAssinyResult = NativeAssinyEvent
  | { kind: 'invalid'; reason: string }
  | { kind: 'ignored'; event: string }
  | { kind: 'unresolved'; event: Omit<NativeAssinyEvent, 'subscriptionId'>; purchaseEventId: string };

// https://assiny.gitbook.io/assiny-docs/webhooks/payloads/compra-aprovada
// The provider has no documented top-level event_id. The transaction UUID and
// event name identify its financial transition, independently of delivery retries.
export function nativeAssinyEventId(event: string, transactionId: string) {
  return `assiny:${event}:${transactionId}`;
}

export function parseNativeAssinyEvent(payload: unknown): NativeAssinyResult {
  const envelope = z.object({ event: z.string().min(1) }).safeParse(payload);
  if (!envelope.success) return { kind: 'invalid', reason: 'invalid_payload' };
  const event = envelope.data.event;
  if (NON_ENTITLEMENT_EVENTS.has(event)) return { kind: 'ignored', event };
  const transition = EVENTS[event];
  // An undocumented renewal/cancellation must not be silently acknowledged.
  if (!transition) return { kind: 'invalid', reason: 'unsupported_assiny_event' };
  const parsed = schema.safeParse(payload);
  if (!parsed.success) return { kind: 'invalid', reason: 'invalid_assiny_payload' };
  const { offer, transaction, client } = parsed.data.data;
  const expected = OFFERS[offer.id];
  if (!expected || offer.product.id !== PRODUCT || transaction.project.id !== PROJECT
    || transaction.project.organization.id !== ORGANIZATION) {
    return { kind: 'invalid', reason: 'unknown_assiny_offer' };
  }
  if (offer.amount !== expected.cents || transaction.amount < offer.amount) {
    return { kind: 'invalid', reason: 'unexpected_assiny_amount' };
  }
  if (transaction.status !== transition.status) return { kind: 'invalid', reason: 'inconsistent_payment_status' };
  const occurredAt = new Date(transaction.updated_at).toISOString();
  if (Date.parse(occurredAt) > Date.now() + 300_000) return { kind: 'invalid', reason: 'future_event_timestamp' };
  if (transition.active && (!offer.subscription || offer.subscription.recurrence !== 'MONTHLY'
    || (offer.recurrence !== null && offer.recurrence !== 'MONTHLY'))) {
    return { kind: 'invalid', reason: 'monthly_subscription_required' };
  }
  const normalized = {
    kind: 'subscription' as const, event, email: client.email.toLowerCase(),
    plan: expected.plan, active: transition.active,
    eventId: nativeAssinyEventId(event, transaction.id), occurredAt,
    offerId: offer.id, amountCents: transaction.amount,
    paymentMethod: transaction.payment_method ?? parsed.data.data.payment?.method ?? null,
    ...(parsed.data.data.metadata?.utm_content?.startsWith('pc1.')
      ? { checkoutReference: parsed.data.data.metadata.utm_content } : {}),
  };
  // Refund/chargeback examples omit subscription. Resolve only from the same
  // transaction's recorded approval, never by customer email or product name.
  if (!offer.subscription) return {
    kind: 'unresolved', event: normalized,
    purchaseEventId: nativeAssinyEventId('approved_purchase', transaction.id),
  };
  return { ...normalized, subscriptionId: offer.subscription.id };
}
