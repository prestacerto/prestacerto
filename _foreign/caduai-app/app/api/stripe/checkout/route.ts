import { NextResponse } from 'next/server';
import { getStripePrice, stripeRequest } from '../../../lib/stripe';

type CheckoutSession = { url: string };

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const plan = String(form.get('plan') || '');
    const price = getStripePrice(plan);
    if (!price) return NextResponse.redirect(new URL('/?pagamento=indisponivel#contato', request.url), 303);

    const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
    const params = new URLSearchParams({
      mode: 'subscription', locale: 'pt-BR',
      'line_items[0][price]': price, 'line_items[0][quantity]': '1',
      success_url: `${origin}/assinatura/confirmada?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/assinatura/cancelada`,
      'metadata[plan]': plan, 'subscription_data[metadata][plan]': plan,
      allow_promotion_codes: 'true', billing_address_collection: 'required',
      'name_collection[business][enabled]': 'true', 'name_collection[business][optional]': 'true',
    });
    const session = await stripeRequest<CheckoutSession>('/checkout/sessions', params);
    return NextResponse.redirect(session.url, 303);
  } catch (error) {
    console.error('stripe_checkout_error', error);
    return NextResponse.redirect(new URL('/?pagamento=erro#contato', request.url), 303);
  }
}
