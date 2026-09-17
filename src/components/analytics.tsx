"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useSyncExternalStore } from "react";
import { dispatchTrackingEvent, trackingPageData } from "@/lib/tracking-dispatch";
import { AssinyPurchaseTracker } from "@/components/assiny-purchase-tracker";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const GOOGLE_TAG_ID = process.env.NEXT_PUBLIC_GOOGLE_TAG_ID;
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
const TIKTOK_PIXEL_ID = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;
const LINKEDIN_INSIGHT_TAG_ID = process.env.NEXT_PUBLIC_LINKEDIN_INSIGHT_TAG_ID;

// Provider code and next/script are fetched only after consent is granted.
const TrackingScripts = dynamic(
  () => import("@/components/analytics-scripts").then((module) => module.TrackingScripts),
  { ssr: false },
);

const CONSENT_STORAGE_KEY = "prestacerto_tracking_consent";
const CONSENT_EVENT = "prestacerto:tracking-consent";
const ATTRIBUTION_STORAGE_KEY = "prestacerto_tracking_attribution";
const ATTRIBUTION_QUERY_KEYS = ["campaign_id", "ad_id", "adset_id"] as const;

type TrackingConsent = "unknown" | "granted" | "denied";

type TrackingAttribution = Partial<Record<(typeof ATTRIBUTION_QUERY_KEYS)[number], string>>;

type TrackingWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  fbq?: (...args: unknown[]) => void;
  ttq?: {
    track?: (name: string, data?: Record<string, unknown>) => void;
    revokeConsent?: () => void;
    grantConsent?: () => void;
  };
  lintrk?: (action: string, data?: Record<string, unknown>) => void;
};

function readTrackingAttribution(): TrackingAttribution {
  if (typeof window === "undefined") return {};

  const fromQuery = new URLSearchParams(window.location.search);
  const queryValues = Object.fromEntries(
    ATTRIBUTION_QUERY_KEYS
      .map((key) => [key, fromQuery.get(key)?.trim() || ""])
      .filter(([, value]) => /^\d{1,24}$/.test(value)),
  ) as TrackingAttribution;

  if (Object.keys(queryValues).length > 0) {
    const stored = readStoredTrackingAttribution();
    const nextValue = { ...stored, ...queryValues };
    try { window.localStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(nextValue)); } catch { /* Storage may be disabled. */ }
    return nextValue;
  }

  return readStoredTrackingAttribution();
}

function readStoredTrackingAttribution(): TrackingAttribution {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as TrackingAttribution;
    return parsed && typeof parsed === "object" ? Object.fromEntries(
      ATTRIBUTION_QUERY_KEYS.filter(key => typeof parsed[key] === 'string' && /^\d{1,24}$/.test(parsed[key]!)).map(key => [key, parsed[key]]),
    ) : {};
  } catch {
    return {};
  }
}

function withAttribution(data?: Record<string, unknown>) {
  const attribution = readStoredTrackingAttribution();
  return {
    ...(data ?? {}),
    ...attribution,
    ...trackingPageData(),
  };
}

function sendConsentSignal(value: Exclude<TrackingConsent, "unknown">) {
  if (typeof window === "undefined") return;

  const trackingWindow = window as TrackingWindow;
  const consentGranted = value === "granted";

  trackingWindow.gtag?.("consent", "update", {
    ad_storage: consentGranted ? "granted" : "denied",
    analytics_storage: consentGranted ? "granted" : "denied",
    ad_user_data: consentGranted ? "granted" : "denied",
    ad_personalization: consentGranted ? "granted" : "denied",
  });

  if (consentGranted) {
    trackingWindow.fbq?.("consent", "grant");
    trackingWindow.ttq?.grantConsent?.();
  } else {
    trackingWindow.fbq?.("consent", "revoke");
    trackingWindow.ttq?.revokeConsent?.();
  }
}


function setConsent(value: Exclude<TrackingConsent, "unknown">) {
  try { window.localStorage.setItem(CONSENT_STORAGE_KEY, value); } catch { /* Cookie still records the preference. */ }
  document.cookie = `${CONSENT_STORAGE_KEY}=${value}; Max-Age=31536000; Path=/; SameSite=Lax`;
  sendConsentSignal(value);
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
}

function readConsent(): TrackingConsent {
  try {
    const cookie = document.cookie.split("; ").find((item) => item.startsWith(`${CONSENT_STORAGE_KEY}=`))?.split("=")[1];
    const stored = cookie || window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return stored === "granted" || stored === "denied" ? stored : "unknown";
  } catch { return "unknown"; }
}

function subscribeConsent(onChange: () => void) {
  window.addEventListener(CONSENT_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CONSENT_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function Analytics() {
  // The server and first browser render share the same snapshot. Read saved
  // preferences only after hydration, including changes from another tab.
  const savedConsent = useSyncExternalStore(subscribeConsent, readConsent, () => "unknown" as TrackingConsent);
  const [editing, setEditing] = useState(false);
  const consent = editing ? "unknown" : savedConsent;

  useEffect(() => {
    if (savedConsent === "granted") readTrackingAttribution();
    if (savedConsent !== "unknown") sendConsentSignal(savedConsent);
  }, [savedConsent]);

  const hasConfiguredProvider = Boolean(
    GA_ID || GOOGLE_TAG_ID || GTM_ID || META_PIXEL_ID || TIKTOK_PIXEL_ID || LINKEDIN_INSIGHT_TAG_ID,
  );
  if (!hasConfiguredProvider) return null;

  return (
    <>
      <AssinyPurchaseTracker />
      {consent === "granted" && <TrackingScripts />}
      {consent === "unknown" && (
        <section
          aria-label="Preferências de privacidade"
          className="fixed inset-x-2 bottom-2 z-[100] mx-auto max-w-3xl rounded-xl border border-blue-400/30 bg-slate-950 p-2.5 text-white shadow-2xl sm:inset-x-4 sm:bottom-4 sm:p-5"
        >
          <div className="flex items-center gap-2.5 sm:gap-4">
            <div className="min-w-0 flex-1 sm:max-w-xl">
              <h2 className="text-sm font-semibold sm:text-base">Sua privacidade importa</h2>
              <p className="mt-1 line-clamp-1 text-[11px] leading-4 text-slate-300 sm:line-clamp-2 sm:text-sm sm:leading-6">
                Usamos cookies de medição e marketing somente com sua autorização para entender a jornada e melhorar o PrestaCerto. Você pode recusar sem perder acesso à plataforma.
              </p>
              <a href="/privacidade" className="mt-1 hidden text-[11px] font-medium text-blue-300 underline underline-offset-2 sm:mt-2 sm:inline-block sm:text-xs">
                Ler a política de privacidade
              </a>
            </div>
            <div className="flex shrink-0 flex-row gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => { setConsent("denied"); setEditing(false); }}
                className="min-h-9 rounded-lg border border-slate-600 px-2.5 py-1.5 text-[11px] font-medium text-slate-200 hover:bg-slate-800 sm:px-4 sm:py-2 sm:text-sm"
              >
                Recusar
              </button>
              <button
                type="button"
                onClick={() => { setConsent("granted"); setEditing(false); }}
                className="min-h-9 rounded-lg bg-blue-500 px-2.5 py-1.5 text-[11px] font-semibold text-white hover:bg-blue-400 sm:px-4 sm:py-2 sm:text-sm"
              >
                Aceitar cookies
              </button>
            </div>
          </div>
        </section>
      )}
      {consent !== "unknown" && (
        <button
          type="button"
          aria-label="Alterar preferências de cookies"
          onClick={() => setEditing(true)}
          className="fixed bottom-4 left-4 z-[90] rounded-full border border-slate-300/30 bg-slate-900/90 px-3 py-2 text-xs font-medium text-slate-200 shadow-lg"
        >
          Cookies
        </button>
      )}
    </>
  );
}

export function trackAnalyticsEvent(eventName: string, data?: Record<string, unknown>) {
  if (typeof window === "undefined" || readConsent() !== "granted") return false;
  return dispatchTrackingEvent(eventName, withAttribution(data),
    eventName === 'begin_checkout' ? { name: 'InitiateCheckout', standard: true } : { name: eventName, standard: false });
}

export function trackRegistration(role: "freelancer" | "client") {
  if (typeof window === "undefined" || readConsent() !== "granted") return false;
  return dispatchTrackingEvent('sign_up', withAttribution({ content_category: role, method: 'email', user_role: role }),
    { name: 'CompleteRegistration', standard: true });
}

export function trackConfirmedPurchase(transactionId: string, value: number) {
  if (typeof window === "undefined" || readConsent() !== "granted") return false;
  if (!transactionId || !Number.isFinite(value) || value <= 0) return false;
  return dispatchTrackingEvent('purchase', withAttribution({ currency: 'BRL', value, transaction_id: transactionId }),
    { name: 'Purchase', standard: true }, transactionId);
}
