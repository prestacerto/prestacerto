import { NextResponse } from 'next/server';
import { stripeRequest } from '../../../lib/stripe';

type CheckoutSession = { customer?: string };
type PortalSession = { url: string };

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const sessionId = String(form.get('session_id') || '');
    if (!sessionId.startsWith('cs_')) throw new Error('Sessão inválida.');
    const checkout = await stripeRequest<CheckoutSession>(`/checkout/sessions/${encodeURIComponent(sessionId)}`, undefined, 'GET');
    if (!checkout.customer) throw new Error('Cliente ainda não identificado.');
    const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
    const portal = await stripeRequest<PortalSession>('/billing_portal/sessions', new URLSearchParams({ customer: checkout.customer, return_url: `${origin}/dashboard` }));
    return NextResponse.redirect(portal.url, 303);
  } catch (error) {
    console.error('stripe_portal_error', error);
    return NextResponse.redirect(new URL('/dashboard?pagamento=erro', request.url), 303);
  }
}
