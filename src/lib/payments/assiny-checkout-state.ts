export const ASSINY_CHECKOUT_STATE = 'prestacerto:assiny-checkout:v1';
export type AssinyCheckoutState = { plan: 'pro' | 'business'; startedAt: string };

// This short-lived state continues a checkout; it contains no contact details,
// user ID, signed checkout reference or payment information.
export function rememberAssinyCheckout(plan: 'pro' | 'business') {
  try { window.sessionStorage.setItem(ASSINY_CHECKOUT_STATE, JSON.stringify({ plan, startedAt: new Date().toISOString() })); } catch { /* Checkout must work without storage. */ }
}

export function readAssinyCheckout(): AssinyCheckoutState | null {
  try {
    const saved = JSON.parse(window.sessionStorage.getItem(ASSINY_CHECKOUT_STATE) || 'null');
    const elapsed = Date.now() - Date.parse(saved?.startedAt);
    if ((saved?.plan === 'pro' || saved?.plan === 'business') && elapsed >= 0 && elapsed < 24 * 60 * 60 * 1000) return saved;
  } catch { /* No valid checkout to resume. */ }
  return null;
}
