type EventData = Record<string, unknown>;
type PendingEvent = { provider: 'google' | 'meta'; name: string; data: EventData; standard?: boolean; dedupeKey?: string };
type TrackingWindow = Window & {
  gtag?: (...args: unknown[]) => void;
  fbq?: (...args: unknown[]) => void;
  __pcTrackingQueue?: PendingEvent[];
  __pcTrackingSent?: Set<string>;
  __pcTrackingListening?: boolean;
};

export function hasTrackingConsent(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const cookie = document.cookie?.split('; ').find(item => item.startsWith('prestacerto_tracking_consent='))?.split('=')[1];
    return (cookie || window.localStorage.getItem('prestacerto_tracking_consent')) === 'granted';
  } catch { return false; }
}

export function trackingPageData(): EventData {
  let pageReferrer = '';
  try { pageReferrer = new URL(document.referrer).origin; } catch { /* Direct visit. */ }
  return { page_location: `${window.location.origin}${window.location.pathname}`, page_referrer: pageReferrer };
}

function sent(w: TrackingWindow, key: string): boolean {
  if (w.__pcTrackingSent?.has(key)) return true;
  try { return w.localStorage.getItem(key) === '1'; } catch { return false; }
}

function flush() {
  const w = window as TrackingWindow;
  if (!hasTrackingConsent()) { w.__pcTrackingQueue = []; return; }
  const pending = w.__pcTrackingQueue?.splice(0) ?? [];
  for (const event of pending) {
    const key = event.dedupeKey ? `prestacerto:conversion:${event.provider}:${event.dedupeKey}` : undefined;
    if (key && sent(w, key)) continue;
    const provider = event.provider === 'meta' ? w.fbq : w.gtag;
    if (typeof provider !== 'function') { w.__pcTrackingQueue?.push(event); continue; }
    try {
      if (event.provider !== 'meta') provider('event', event.name, event.data);
      else provider(event.standard ? 'track' : 'trackCustom', event.name, event.data,
        ...(event.dedupeKey ? [{ eventID: event.dedupeKey }] : []));
      if (key) {
        (w.__pcTrackingSent ??= new Set()).add(key);
        try { w.localStorage.setItem(key, '1'); } catch { /* In-memory deduplication remains available. */ }
      }
    } catch { w.__pcTrackingQueue?.push(event); }
  }
}

// Each provider is queued independently: GA readiness must not discard Meta
// conversions, and consent revocation discards events that have not been sent.
export function dispatchTrackingEvent(googleName: string, data: EventData, meta?: { name: string; standard: boolean }, dedupeKey?: string): boolean {
  if (!hasTrackingConsent()) return false;
  const w = window as TrackingWindow;
  w.__pcTrackingQueue ??= [];
  if (!w.__pcTrackingListening) {
    w.__pcTrackingListening = true;
    w.addEventListener('prestacerto:analytics-ready', flush);
    w.addEventListener('prestacerto:tracking-consent', flush);
    w.addEventListener('storage', flush);
  }
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const entries: PendingEvent[] = [{ provider: 'google', name: googleName,
    data: gaId ? { ...data, send_to: gaId } : data, dedupeKey }];
  if (meta) entries.push({ provider: 'meta', name: meta.name, standard: meta.standard, data, dedupeKey });
  for (const entry of entries) {
    if (dedupeKey && w.__pcTrackingQueue.some(item => item.provider === entry.provider && item.dedupeKey === dedupeKey)) continue;
    if (w.__pcTrackingQueue.length >= 80) w.__pcTrackingQueue.shift();
    w.__pcTrackingQueue.push(entry);
  }
  flush();
  return true;
}
