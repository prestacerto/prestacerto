import { landingSource, type LandingSource } from '@/lib/landing-source';
import type { LandingJourney } from '@/lib/landing-leads-validation';
import { dispatchTrackingEvent, hasTrackingConsent, trackingPageData } from '@/lib/tracking-dispatch';

const STORAGE_KEY = 'prestacerto:funnel-attribution:v1';
const TTL = 24 * 60 * 60 * 1000;
type Attribution = { source: LandingSource; device: 'mobile' | 'desktop'; journey: LandingJourney; campaign_id?: string; adgroup_id?: string; ad_id?: string; savedAt: number };
export type FunnelEvent = 'presta_certo_landing_view' | 'presta_certo_cta_click' | 'presta_certo_form_start' | 'presta_certo_form_error' | 'presta_certo_lead_success' | 'presta_certo_journey_switch' | 'presta_certo_registration_success' | 'presta_certo_project_published' | 'presta_certo_profile_completed';

export function isProfileComplete(profile: { full_name?: unknown; headline?: unknown; bio?: unknown; city?: unknown } | null | undefined): boolean {
  return Boolean(profile && typeof profile.full_name === 'string' && profile.full_name.trim().length >= 2 &&
    ['headline', 'bio', 'city'].every(key => typeof profile[key as keyof typeof profile] === 'string' && String(profile[key as keyof typeof profile]).trim().length > 0));
}

function attribution(journey: LandingJourney): Attribution {
  const params = new URLSearchParams(window.location.search);
  let saved: Attribution | undefined;
  try {
    const value = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) || 'null');
    if (value && Number.isFinite(value.savedAt) && Date.now() >= value.savedAt && Date.now() - value.savedAt < TTL &&
      ['paid_search', 'social', 'search', 'direct', 'referral'].includes(value.source) && ['mobile', 'desktop'].includes(value.device)) saved = value;
  } catch { /* Attribution is optional. */ }
  const explicitCampaign = ['gclid', 'gbraid', 'wbraid', 'utm_medium', 'utm_source', 'campaign_id'].some(key => params.has(key));
  const data: Attribution = { source: saved?.source || landingSource(window.location.search, document.referrer, window.location.hostname), device: saved?.device || (window.matchMedia('(max-width: 767px)').matches ? 'mobile' : 'desktop'), savedAt: saved?.savedAt || Date.now(), journey };
  if (explicitCampaign) { data.source = landingSource(window.location.search, document.referrer, window.location.hostname); data.savedAt = Date.now(); }
  for (const key of ['campaign_id', 'adgroup_id', 'ad_id'] as const) {
    const value = explicitCampaign ? params.get(key) : saved?.[key];
    // Never accept names, free-form UTM values, contact details or click identifiers.
    if (value && /^\d{1,24}$/.test(value)) data[key] = value;
  }
  try { window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch { /* Keep the form working without storage. */ }
  return data;
}

export function trackFunnelEvent(event: FunnelEvent, journey: LandingJourney, leadId?: string): boolean {
  if (!hasTrackingConsent()) return false;
  try {
    const { savedAt: _savedAt, ...dimensions } = attribution(journey);
    void _savedAt;
    const leadKey = event === 'presta_certo_lead_success' && leadId &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(leadId) ? `lead:${leadId}` : undefined;
    return dispatchTrackingEvent(event, { ...dimensions, ...trackingPageData() },
      event === 'presta_certo_lead_success' ? { name: 'Lead', standard: true } : undefined, leadKey);
  } catch { return false; }
}
