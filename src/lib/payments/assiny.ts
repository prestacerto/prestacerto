import { z } from "zod";
import { createHash, timingSafeEqual } from 'node:crypto';

export type PaidPlan = 'pro' | 'business';
const ACTIVE_EVENTS = new Set(['subscription.paid', 'payment.approved', 'payment.paid', 'purchase.approved']);
const INACTIVE_EVENTS = new Set(['subscription.cancelled', 'subscription.canceled', 'subscription.expired', 'subscription.suspended', 'payment.refunded', 'payment.chargeback', 'purchase.refunded']);

export function validWebhookToken(expected: string, provided: string | null) {
  if (!expected || !provided) return false;
  const digest = (s: string) => createHash('sha256').update(s).digest();
  return timingSafeEqual(digest(expected), digest(provided));
}

function pick(obj: unknown, paths: string[]) {
  for (const path of paths) {
    let current: unknown = obj;
    for (const key of path.split('.')) {
      current = current && typeof current === 'object' && !Array.isArray(current)
        ? (current as Record<string, unknown>)[key] : undefined;
    }
    if (typeof current === 'string' && current.trim()) return current.trim();
    if (typeof current === 'number' && Number.isFinite(current)) return String(current);
  }
  return null;
}

export function resolveAssinyPlan(raw: string | null): PaidPlan | null {
  const normalized = raw?.trim().toLowerCase().replace(/\s+/g, ' ');
  if (['pro', 'prestacerto pro', 'plano pro'].includes(normalized ?? '')) return 'pro';
  if (['business', 'prestacerto business', 'plano business'].includes(normalized ?? '')) return 'business';
  return null;
}

type ParsedEvent =
  | { kind: 'ignored'; event: string }
  | { kind: 'invalid'; reason: string }
  | { kind: 'subscription'; event: string; email: string; plan: PaidPlan; active: boolean; subscriptionId: string; eventId: string; occurredAt: string };

// Only explicitly supported events and products can change a subscription.
// Confirm these fields against an authenticated Assiny test delivery before enabling production.
export function parseAssinyEvent(payload: unknown): ParsedEvent {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return { kind: 'invalid', reason: 'invalid_payload' };
  const event = pick(payload, ['event', 'type', 'event_type', 'data.event', 'data.type'])?.toLowerCase() ?? '';
  if (!event) return { kind: 'invalid', reason: 'missing_event' };
  if (!ACTIVE_EVENTS.has(event) && !INACTIVE_EVENTS.has(event)) return { kind: 'ignored', event };
  const email = pick(payload, ['customer.email', 'data.customer.email', 'subscriber.email', 'data.subscriber.email', 'buyer.email', 'data.buyer.email', 'email', 'data.email'])?.toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { kind: 'invalid', reason: 'invalid_customer_email' };
  const plan = resolveAssinyPlan(pick(payload, ['plan.name', 'data.plan.name', 'product.name', 'data.product.name', 'offer.name', 'data.offer.name', 'plan', 'data.plan', 'product', 'data.product']));
  if (!plan) return { kind: 'invalid', reason: 'unknown_plan' };
  const subscriptionId = pick(payload, ['subscription.id', 'data.subscription.id', 'subscription_id', 'data.subscription_id']);
  if (!subscriptionId || subscriptionId.length > 200) return { kind: 'invalid', reason: 'missing_subscription_id' };
  const eventId = pick(payload, ['event_id', 'webhook_id', 'data.event_id']);
  if (!eventId || eventId.length > 200) return { kind: 'invalid', reason: 'missing_event_id' };
  const timestamp = pick(payload, ['occurred_at', 'event_created_at', 'data.occurred_at']);
  const parsedTime = z.iso.datetime({ offset: true }).safeParse(timestamp);
  if (!parsedTime.success) return { kind: 'invalid', reason: 'invalid_event_timestamp' };
  const occurredAt = new Date(parsedTime.data).toISOString();
  if (Date.parse(occurredAt) > Date.now() + 300_000) return { kind: 'invalid', reason: 'future_event_timestamp' };
  if (email.length > 320) return { kind: 'invalid', reason: 'invalid_customer_email' };
  return { kind: 'subscription', event, email, plan, active: ACTIVE_EVENTS.has(event), subscriptionId, eventId, occurredAt };
}

// Hash normalized business fields, independent of JSON key order and delivery metadata.
export function assinyEventHash(event: Extract<ParsedEvent, { kind: "subscription" }> & { checkoutReference?: string }) {
  const fields: unknown[] = [
    event.eventId, event.subscriptionId, event.event, event.email,
    event.plan, event.active, event.occurredAt,
  ];
  if (event.checkoutReference) fields.push(event.checkoutReference);
  return createHash("sha256").update(JSON.stringify(fields)).digest("hex");
}
