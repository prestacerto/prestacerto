"use client";

import Script from "next/script";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const GOOGLE_TAG_ID = process.env.NEXT_PUBLIC_GOOGLE_TAG_ID?.trim();
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
const TIKTOK_PIXEL_ID = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;
const LINKEDIN_INSIGHT_TAG_ID = process.env.NEXT_PUBLIC_LINKEDIN_INSIGHT_TAG_ID;

export function TrackingScripts() {
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
              if ((document.cookie.split('; ').find(function(item) { return item.startsWith('prestacerto_tracking_consent='); })?.split('=')[1] || window.localStorage.getItem('prestacerto_tracking_consent')) === 'granted') {
              window.dataLayer = window.dataLayer || [];
              window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
              gtag('consent', 'default', {
                ad_storage: 'denied',
                analytics_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                wait_for_update: 500
              });
              gtag('consent', 'update', {
                ad_storage: 'granted',
                analytics_storage: 'granted',
                ad_user_data: 'granted',
                ad_personalization: 'granted'
              });
              gtag('js', new Date());
              ${uniqueGoogleIds
                .map((id) => `gtag('config', '${id}', { ${id.startsWith('AW-') ? 'send_page_view: false,' : ''} anonymize_ip: true, page_path: window.location.pathname, page_location: window.location.origin + window.location.pathname, page_referrer: document.referrer ? new URL(document.referrer).origin : '' });`)
                .join("\n              ")}
              window.dispatchEvent(new CustomEvent('prestacerto:analytics-ready'));
              }
            `}
          </Script>
        </>
      )}

      {GTM_ID && (
        <Script id="prestacerto-google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');
          `}
        </Script>
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
            window.dispatchEvent(new CustomEvent('prestacerto:analytics-ready'));
          `}
        </Script>
      )}

      {TIKTOK_PIXEL_ID && (
        <Script id="prestacerto-tiktok-pixel" strategy="afterInteractive">
          {`
            !function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];
            ttq.methods=['page','track','identify','instances','debug','on','off','once','ready','alias','group','enableCookie','disableCookie','holdConsent','revokeConsent','grantConsent'];
            ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))};
            };
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

      {LINKEDIN_INSIGHT_TAG_ID && (
        <Script id="prestacerto-linkedin-insight" strategy="afterInteractive">
          {`
            _linkedin_partner_id = '${LINKEDIN_INSIGHT_TAG_ID}';
            window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
            window._linkedin_data_partner_ids.push(_linkedin_partner_id);
            (function(l) {
              if (!l) {
                window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
                window.lintrk.q = [];
              }
              var s = document.getElementsByTagName('script')[0];
              var b = document.createElement('script');
              b.type = 'text/javascript';
              b.async = true;
              b.src = 'https://snap.licdn.com/li.lms-analytics/insight.min.js';
              s.parentNode.insertBefore(b, s);
            })(window.lintrk);
          `}
        </Script>
      )}
    </>
  );
}
