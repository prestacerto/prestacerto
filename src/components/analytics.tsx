"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const GOOGLE_TAG_ID = process.env.NEXT_PUBLIC_GOOGLE_TAG_ID;
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
const TIKTOK_PIXEL_ID = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;
const CONSENT_STORAGE_KEY = "prestacerto_tracking_consent";
const CONSENT_EVENT = "prestacerto:tracking-consent";

type TrackingConsent = "unknown" | "granted" | "denied";

function TrackingScripts() {
  const googleIds = [GA_ID, GOOGLE_TAG_ID].filter(Boolean) as string[];
  const uniqueGoogleIds = Array.from(new Set(googleIds));

  return (
    <>
      {uniqueGoogleIds.length > 0 && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${uniqueGoogleIds[0]}`}
            strategy="afterInteractive"
          />
          <Script id="prestacerto-google-consent" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){window.dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('consent', 'default', {
                ad_storage: 'granted',
                analytics_storage: 'granted',
                ad_user_data: 'granted',
                ad_personalization: 'granted',
                wait_for_update: 500
              });
              gtag('js', new Date());
              ${uniqueGoogleIds.map((id) => `gtag('config', '${id}', { anonymize_ip: true, page_path: window.location.pathname });`).join("\n              ")}
            `}
          </Script>
        </>
      )}

      {META_PIXEL_ID && (
        <Script id="prestacerto-meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
            n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
            (window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
            fbq('consent', 'grant');
            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}

      {TIKTOK_PIXEL_ID && (
        <Script id="prestacerto-tiktok-pixel" strategy="afterInteractive">
          {`
            !function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];
            ttq.methods=['page','track','identify','instances','debug','on','off','once','ready','alias','group','enableCookie','disableCookie','holdConsent','revokeConsent','grantConsent'];
            ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
            for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
            ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};
            ttq.load=function(e,n){var r='https://analytics.tiktok.com/i18n/pixel/events.js',o=n&&n.partner;
            ttq._i=ttq._i||{};ttq._i[e]=[];ttq._i[e]._u=r;ttq._t=ttq._t||{};ttq._t[e]=+new Date;
            ttq._o=ttq._o||{};ttq._o[e]=n||{};var u=document.createElement('script');u.type='text/javascript';
            u.async=!0;u.src=r+'?sdkid='+e+'&lib='+t;var a=document.getElementsByTagName('script')[0];a.parentNode.insertBefore(u,a)};
            ttq.load('${TIKTOK_PIXEL_ID}');ttq.grantConsent();ttq.page();}(window,document,'ttq');
          `}
        </Script>
      )}
    </>
  );
}

function setConsent(value: Exclude<TrackingConsent, "unknown">) {
  window.localStorage.setItem(CONSENT_STORAGE_KEY, value);
  document.cookie = `${CONSENT_STORAGE_KEY}=${value}; Max-Age=31536000; Path=/; SameSite=Lax`;
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
}

export function Analytics() {
  const [consent, setConsentState] = useState<TrackingConsent>("unknown");

  useEffect(() => {
    const stored = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (stored === "granted" || stored === "denied") {
      setConsentState(stored);
    }

    const handleConsent = (event: Event) => {
      const value = (event as CustomEvent<TrackingConsent>).detail;
      if (value === "granted" || value === "denied") setConsentState(value);
    };

    window.addEventListener(CONSENT_EVENT, handleConsent);
    return () => window.removeEventListener(CONSENT_EVENT, handleConsent);
  }, []);

  const hasConfiguredProvider = Boolean(GA_ID || GOOGLE_TAG_ID || META_PIXEL_ID || TIKTOK_PIXEL_ID);
  if (!hasConfiguredProvider) return null;

  return (
    <>
      {consent === "granted" && <TrackingScripts />}
      {consent === "unknown" && (
        <section
          aria-label="Preferências de privacidade"
          className="fixed inset-x-4 bottom-4 z-[100] mx-auto max-w-3xl rounded-2xl border border-blue-400/30 bg-slate-950 p-5 text-white shadow-2xl"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl">
              <h2 className="text-base font-semibold">Sua privacidade importa</h2>
              <p className="mt-1 text-sm leading-6 text-slate-300">
                Usamos cookies de analytics e publicidade somente com sua autorização para entender a jornada e melhorar o PrestaCerto. Você pode recusar sem perder acesso à plataforma.
              </p>
              <a href="/privacidade" className="mt-2 inline-block text-xs font-medium text-blue-300 underline underline-offset-2">
                Ler a política de privacidade
              </a>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => { setConsent("denied"); setConsentState("denied"); }}
                className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800"
              >
                Recusar
              </button>
              <button
                type="button"
                onClick={() => { setConsent("granted"); setConsentState("granted"); }}
                className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-400"
              >
                Aceitar analytics
              </button>
            </div>
          </div>
        </section>
      )}
      {consent !== "unknown" && (
        <button
          type="button"
          aria-label="Alterar preferências de cookies"
          onClick={() => setConsentState("unknown")}
          className="fixed bottom-4 left-4 z-[90] rounded-full border border-slate-300/30 bg-slate-900/90 px-3 py-2 text-xs font-medium text-slate-200 shadow-lg"
        >
          Cookies
        </button>
      )}
    </>
  );
}

export function trackAnalyticsEvent(eventName: string, data?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
  if (gtag) gtag("event", eventName, data ?? {});
  const fbq = (window as Window & { fbq?: (...args: unknown[]) => void }).fbq;
  if (fbq) fbq("track", eventName, data ?? {});
  const ttq = (window as Window & { ttq?: { track?: (name: string, data?: Record<string, unknown>) => void } }).ttq;
  if (ttq?.track) ttq.track(eventName, data);
}
