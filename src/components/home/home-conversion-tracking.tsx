"use client";

import { useEffect } from 'react';

// Measure only explicit funnel actions, with existing consent and no free-text input.
export function HomeConversionTracking() {
  useEffect(() => {
    const home = document.getElementById('home');
    if (!home) return;
    const send = (eventName: string, data: Record<string, string>) => {
      try {
        if (window.localStorage.getItem('prestacerto_tracking_consent') !== 'granted') return;
        const trackingWindow = window as Window & { gtag?: (...args: unknown[]) => void };
        trackingWindow.gtag?.('event', eventName, data);
      } catch { /* Storage may be unavailable; navigation must still work. */ }
    };
    const click = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[data-home-cta]') : null;
      if (!link || !home.contains(link)) return;
      const intent = link.dataset.homeCta ?? '';
      const placement = link.dataset.placement ?? '';
      send('home_cta_click', { intent, placement });
      if (intent === 'client') send('generate_lead', { journey: 'client', placement });
      if (intent === 'freelancer') send('sign_up', { journey: 'provider', placement });
    };
    const submit = (event: SubmitEvent) => {
      if (event.target instanceof HTMLFormElement && event.target.hasAttribute('data-home-search')) {
        send('home_search_submit', { placement: 'hero' });
      }
    };
    home.addEventListener('click', click);
    home.addEventListener('submit', submit);
    return () => { home.removeEventListener('click', click); home.removeEventListener('submit', submit); };
  }, []);
  return null;
}
