import { createClient } from '@/lib/supabase/server';
import { isAssinyCheckoutReady } from '@/lib/payments/assiny-readiness';
import { createCheckoutReference } from '@/lib/payments/checkout-reference';
import { PLANS, getCheckoutUrl } from '@/lib/plans-data';
import { readJsonObject } from '@/lib/http/request-body';
import { rateLimiters, checkRateLimit, rateLimitResponse } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return Response.json({ error: 'Entre na sua conta para assinar.' }, { status: 401 });
  const limit = await checkRateLimit(rateLimiters.checkout, user.id);
  if (!limit.success) return rateLimitResponse(limit.reset);
  if (!isAssinyCheckoutReady()) return Response.json({ error: 'As assinaturas ainda estão em preparação.' }, { status: 503 });
  const input = await readJsonObject(request, 2048);
  if (input.response) return input.response;
  if (input.data.plan !== 'pro' && input.data.plan !== 'business') return Response.json({ error: 'Plano inválido.' }, { status: 400 });
  const plan = PLANS.find(plan => plan.id === input.data.plan)!;
  try {
    const raw = getCheckoutUrl(plan);
    if (!raw) throw new Error('Missing checkout');
    const url = new URL(raw);
    if (url.origin !== 'https://pay.assiny.com.br' || url.username || url.password) throw new Error('Invalid checkout');
    const reference = createCheckoutReference(user.id, input.data.plan, (process.env.ASSINY_WEBHOOK_SECRET || process.env.ASSINY_WEBHOOK_SECRET)!);
    url.searchParams.set('utm_content', reference);
    return Response.json({ url: url.toString() }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch {
    return Response.json({ error: 'Não foi possível abrir a assinatura agora.' }, { status: 503 });
  }
}
