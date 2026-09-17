import { createClient } from '@/lib/supabase/server';
import { createServiceClient, hasServiceCredentials } from '@/lib/supabase/service';
import { PLANS } from '@/lib/plans-data';

export const dynamic = 'force-dynamic';
const headers = { 'Cache-Control': 'private, no-store' };

// Read-only confirmation from the existing, verified subscription ledger.
// A return URL, profile.plan or a client-submitted transaction never proves payment.
export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return Response.json({ error: 'unauthorized' }, { status: 401, headers });
  const params = new URL(request.url).searchParams;
  const startedAt = params.get('startedAt');
  const plan = PLANS.find(item => item.id !== 'free' && item.id === params.get('plan'));
  const time = startedAt ? Date.parse(startedAt) : NaN;
  if (!plan || !Number.isFinite(time) || time > Date.now() || Date.now() - time >= 24 * 60 * 60 * 1000) {
    return Response.json({ error: 'invalid_checkout' }, { status: 400, headers });
  }
  if (!hasServiceCredentials()) return Response.json({ error: 'confirmation_unavailable' }, { status: 503, headers });
  try {
    const service = createServiceClient();
    let query = service.from('assiny_subscriptions')
      .select('last_event_id')
      .eq('mode', 'live').eq('user_id', user.id).eq('active', true).eq('plan', plan.id)
      .not('verified_at', 'is', null).gte('last_occurred_at', new Date(time).toISOString());
    if (process.env.ASSINY_ACCESS_LIFECYCLE_ENABLED === 'true') {
      query = query.gt('paid_through', new Date().toISOString()).is('revoked_at', null);
    }
    const { data, error } = await query.order('last_occurred_at', { ascending: false }).limit(1).maybeSingle();
    if (error) throw new Error('confirmation_unavailable');
    if (!data || !/^assiny:approved_purchase:[0-9a-f-]{36}$/i.test(data.last_event_id)) {
      return Response.json({ status: 'pending' }, { headers });
    }
    // The ledger contract verifies the offer price. Additional checkout fees
    // are not recorded as subscription revenue.
    return Response.json({ status: 'confirmed', transactionId: data.last_event_id, value: plan.priceMonthly, plan: plan.id }, { headers });
  } catch {
    return Response.json({ error: 'confirmation_unavailable' }, { status: 503, headers });
  }
}
