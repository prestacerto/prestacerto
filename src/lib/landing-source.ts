export type LandingSource = 'paid_search' | 'social' | 'search' | 'direct' | 'referral';

export function landingSource(search: string, referrer: string, hostname: string): LandingSource {
  const params = new URLSearchParams(search);
  const medium = (params.get('utm_medium') || '').toLowerCase();
  const source = (params.get('utm_source') || '').toLowerCase();
  if (params.has('gclid') || params.has('gbraid') || params.has('wbraid') || ['cpc', 'ppc', 'paid_search', 'paidsearch', 'sem'].includes(medium)) return 'paid_search';
  if (['social', 'paid_social', 'paidsocial', 'social_paid'].includes(medium) || ['facebook', 'instagram', 'tiktok', 'linkedin', 'fb', 'ig'].includes(source)) return 'social';
  if (['organic', 'search'].includes(medium)) return 'search';
  try {
    const host = new URL(referrer).hostname.toLowerCase();
    if (host === hostname.toLowerCase()) return 'direct';
    if (/(^|\.)(google\.[a-z.]+|bing\.com|duckduckgo\.com|search\.yahoo\.com)$/.test(host)) return 'search';
    if (/(^|\.)(facebook\.com|instagram\.com|tiktok\.com|linkedin\.com|t\.co)$/.test(host)) return 'social';
    return 'referral';
  } catch { return 'direct'; }
}

