// Next.js replaces these direct NEXT_PUBLIC reads at build time.
//
// This ID only gates which Google Ads origins the CSP allows (see
// applySecurityHeaders in src/lib/supabase/session.ts) and loads the base
// gtag.js config (see analytics-scripts.tsx). Conversion measurement itself
// is handled by GTM (container GTM-MDRTD47V), not by this module — keep it
// that way to avoid double-counting each lead.
export function getGoogleAdsId(): string | null {
  const id = process.env.NEXT_PUBLIC_GOOGLE_TAG_ID?.trim();
  return id && /^AW-\d{1,20}$/.test(id) ? id : null;
}
