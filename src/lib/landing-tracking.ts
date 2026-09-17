import type { LandingJourney } from '@/lib/landing-leads-validation';
import { trackFunnelEvent } from '@/lib/funnel';
export { landingSource, type LandingSource } from '@/lib/landing-source';
export type LandingTrackingEvent =
  | 'presta_certo_landing_view'
  | 'presta_certo_cta_click'
  | 'presta_certo_form_start'
  | 'presta_certo_form_error'
  | 'presta_certo_lead_success'
  | 'presta_certo_journey_switch';
export function trackLandingEvent(eventName: LandingTrackingEvent, journey: LandingJourney, leadId?: string) {
  const result = trackFunnelEvent(eventName, journey, leadId);
  if (typeof window !== 'undefined') {
    try {
      const consent = window.localStorage.getItem('prestacerto_tracking_consent');
      if (consent === 'granted') {
        const payload = { journey, lead_id: leadId ?? undefined };
        const trackingWindow = window as Window & { dataLayer?: Array<Record<string, unknown>>; gtag?: (...args: unknown[]) => void };
        trackingWindow.dataLayer ??= [];
        trackingWindow.dataLayer.push({ event: eventName, ...payload });
        trackingWindow.gtag?.('event', eventName, payload);
      }
    } catch { /* Measurement must never block the lead flow. */ }
  }
  return result;
}
