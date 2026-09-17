'use client';

import { useEffect } from 'react';
import { readAssinyCheckout } from '@/lib/payments/assiny-checkout-state';
import { dispatchTrackingEvent, trackingPageData } from '@/lib/tracking-dispatch';

export function AssinyPurchaseTracker() {
  useEffect(() => {
    let disposed = false;
    let running = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let attempts = 0;
    async function check() {
      const checkout = readAssinyCheckout();
      if (!checkout || disposed || running) return;
      running = true;
      attempts++;
      try {
        const response = await fetch(`/api/payments/assiny-status?${new URLSearchParams(checkout)}`, { cache: 'no-store' });
        if (!response.ok || disposed) return;
        const data = await response.json();
        if (disposed) return;
        if (data.status === 'confirmed' && typeof data.transactionId === 'string' && Number.isFinite(data.value) && data.value > 0) {
          dispatchTrackingEvent('purchase', { currency: 'BRL', value: data.value, transaction_id: data.transactionId, ...trackingPageData() },
            { name: 'Purchase', standard: true }, data.transactionId);
        } else if (data.status === 'pending' && attempts < 6) {
          timer = setTimeout(check, 15_000);
        }
      } catch { /* Confirmation or tracking must never prevent platform access. */ }
      finally { running = false; }
    }
    const resume = () => { if (timer) clearTimeout(timer); attempts = 0; void check(); };
    void check();
    window.addEventListener('focus', resume);
    window.addEventListener('pageshow', resume);
    window.addEventListener('prestacerto:tracking-consent', resume);
    return () => {
      disposed = true;
      if (timer) clearTimeout(timer);
      window.removeEventListener('focus', resume);
      window.removeEventListener('pageshow', resume);
      window.removeEventListener('prestacerto:tracking-consent', resume);
    };
  }, []);
  return null;
}
