const stripeApi = 'https://api.stripe.com/v1';

type StripeError = { error?: { message?: string } };

export async function stripeRequest<T>(path: string, params?: URLSearchParams, method: 'GET' | 'POST' = 'POST') {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) throw new Error('Stripe ainda não foi configurado.');

  const response = await fetch(`${stripeApi}${path}${method === 'GET' && params ? `?${params}` : ''}`, {
    method,
    headers: {
      Authorization: `Bearer ${secretKey}`,
      ...(method === 'POST' ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {}),
    },
    body: method === 'POST' ? params : undefined,
    cache: 'no-store',
  });

  const data = await response.json() as T & StripeError;
  if (!response.ok) throw new Error(data.error?.message || 'Não foi possível falar com o Stripe.');
  return data;
}

export function getStripePrice(plan: string) {
  const prices: Record<string, string | undefined> = { assinatura: process.env.STRIPE_PRICE_SUBSCRIPTION };
  return prices[plan];
}
