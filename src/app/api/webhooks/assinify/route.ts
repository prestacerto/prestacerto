import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient, hasServiceCredentials } from '@/lib/supabase/service';
import { parseAssinyEvent, validWebhookToken, assinyEventHash } from '@/lib/payments/assiny';
import { parseNativeAssinyEvent } from '@/lib/payments/assiny-native';
import { readJsonObject } from '@/lib/http/request-body';
import { verifyCheckoutReference } from '@/lib/payments/checkout-reference';
import { createHash } from 'node:crypto';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const expected = process.env.ASSINY_WEBHOOK_SECRET || process.env.ASSINIFY_WEBHOOK_SECRET;
  if (!expected || !hasServiceCredentials()) {
    return NextResponse.json({ error: 'webhook_not_configured' }, { status: 503 });
  }
  const provided = request.headers.get('x-assiny-token') ?? request.headers.get('x-assinify-token') ?? request.headers.get('x-webhook-secret');
  if (!validWebhookToken(expected, provided)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const input = await readJsonObject(request, 256_000);
  if (input.response) return input.response;
  const payload = input.data;
  const mode = process.env.ASSINY_INTEGRATION_VERIFIED === 'true' ? 'live' : 'test';
  // Legacy fixtures remain usable in isolated tests, never as a live contract.
  let event = mode === 'test' && typeof payload.event === 'string' && payload.event.includes('.')
    ? parseAssinyEvent(payload) : parseNativeAssinyEvent(payload);
  if (event.kind === 'invalid') return NextResponse.json({ error: event.reason }, { status: 422 });
  if (event.kind === 'ignored') return NextResponse.json({ received: true, ignored: true });

  try {
    const service = createServiceClient();
    if (event.kind === 'unresolved') {
      const { data: purchase, error } = await service.from('assiny_events')
        .select('subscription_id, plan, customer_email, outcome')
        .eq('mode', mode).eq('event_id', event.purchaseEventId).maybeSingle();
      if (error) throw new Error('purchase_lookup_failed');
      if (!purchase || purchase.outcome === 'conflict' || purchase.plan !== event.event.plan
        || purchase.customer_email !== event.event.email) {
        return NextResponse.json({ error: 'unresolved_assiny_transaction' }, { status: 422 });
      }
      event = { ...event.event, subscriptionId: purchase.subscription_id };
    }
    const { data, error } = await service.rpc('ingest_assiny_event', {
      p_mode: mode,
      p_event_id: event.eventId,
      p_subscription_id: event.subscriptionId,
      p_event_type: event.event,
      p_email: event.email,
      p_plan: event.plan,
      p_active: event.active,
      p_occurred_at: event.occurredAt,
      p_payload_hash: assinyEventHash(event),
    });
    if (error || !data?.outcome) throw new Error('event_not_persisted');
    if (data.outcome === 'conflict') return NextResponse.json({ error: 'event_conflict' }, { status: 409 });
    if (mode === 'live' && event.active && 'checkoutReference' in event && typeof event.checkoutReference === 'string' && event.checkoutReference
      && !['applied', 'stale'].includes(data.outcome) && data.originalOutcome !== 'applied') {
      const userId = verifyCheckoutReference(event.checkoutReference, event.plan, expected, event.occurredAt);
      if (!userId) return NextResponse.json({ error: 'invalid_checkout_reference' }, { status: 422 });
      const binding = await service.rpc('bind_verified_assiny_subscription', {
        p_subscription_id: event.subscriptionId,
        p_user_id: userId,
        p_verification_reference: 'checkout-v1:' + createHash('sha256').update(event.checkoutReference).digest('hex'),
        p_verified_by: 'authenticated-checkout-v1',
      });
      if (binding.error) throw new Error('subscription_binding_failed');
      return NextResponse.json({ received: true, mode, outcome: 'applied' });
    }
    return NextResponse.json({ received: true, mode, outcome: data.outcome });
  } catch (error) {
    console.error('[ASSINY]', error instanceof Error ? error.message : 'processing_failed');
    // Non-2xx allows delivery retries; never acknowledge a failed write as a success.
    return NextResponse.json({ error: 'subscription_processing_failed' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, webhook: 'assiny', configured: hasServiceCredentials() && Boolean(process.env.ASSINY_WEBHOOK_SECRET || process.env.ASSINIFY_WEBHOOK_SECRET), liveValidated: process.env.ASSINY_INTEGRATION_VERIFIED === 'true' });
}
