"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { trackEvent } from "../../lib/analytics/events";
import { getSafeAttribution } from "../../lib/analytics/attribution";
import {
  CONSENT_CHANGE_EVENT,
  emptyConsent,
  getStoredConsent,
  hasMeasurementConsent,
} from "../../lib/analytics/consent";

function applyGoogleConsent(consent) {
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag() {
      window.dataLayer.push(arguments);
    };

  if (!window.__marketingConsentInitialized) {
    window.gtag("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    window.__marketingConsentInitialized = true;
  }

  window.gtag("consent", "update", {
    analytics_storage: consent.analytics ? "granted" : "denied",
    ad_storage: consent.marketing ? "granted" : "denied",
    ad_user_data: consent.marketing ? "granted" : "denied",
    ad_personalization: "denied",
  });
}

export function AnalyticsLoader() {
  const [consent, setConsent] = useState(emptyConsent());
  const viewTrackedRef = useRef(false);
  const configuredGtmId = process.env.NEXT_PUBLIC_GTM_ID || "";
  const configuredMetaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";
  const configuredTiktokPixelId =
    process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID || "";
  const gtmId = /^GTM-[A-Z0-9]+$/.test(configuredGtmId)
    ? configuredGtmId
    : "";
  const metaPixelId = /^\d{5,30}$/.test(configuredMetaPixelId)
    ? configuredMetaPixelId
    : "";
  const tiktokPixelId = /^[A-Z0-9]{8,30}$/.test(configuredTiktokPixelId)
    ? configuredTiktokPixelId
    : "";

  useEffect(() => {
    function syncConsent(event) {
      const nextValue = event?.detail?.version
        ? event.detail
        : getStoredConsent();
      applyGoogleConsent(nextValue);
      if (nextValue.marketing) {
        window.fbq?.("consent", "grant");
        window.ttq?.grantConsent?.();
      } else {
        window.fbq?.("consent", "revoke");
        window.ttq?.revokeConsent?.();
      }
      setConsent(nextValue);
    }

    syncConsent();
    window.addEventListener(CONSENT_CHANGE_EVENT, syncConsent);
    return () =>
      window.removeEventListener(CONSENT_CHANGE_EVENT, syncConsent);
  }, []);

  useEffect(() => {
    if (hasMeasurementConsent(consent) && !viewTrackedRef.current) {
      viewTrackedRef.current = true;
      trackEvent("view_landing", {
        path: window.location.pathname,
        ...getSafeAttribution(window.location.href, document.referrer),
      });
    }
  }, [consent]);

  if (!hasMeasurementConsent(consent)) {
    return null;
  }

  return (
    <>
      {gtmId ? (
        <Script id="gtm-loader" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`}
        </Script>
      ) : null}
      {consent.marketing && metaPixelId ? (
        <Script id="meta-pixel-loader" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${metaPixelId}');fbq('consent','grant');fbq('track','PageView');`}
        </Script>
      ) : null}
      {consent.marketing && tiktokPixelId ? (
        <Script id="tiktok-pixel-loader" strategy="afterInteractive">
          {`!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];
ttq.methods=['page','track','identify','instances','debug','on','off','once','ready','alias','group','enableCookie','disableCookie','holdConsent','revokeConsent','grantConsent'];
ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat([].slice.call(arguments,0)))}};
for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
ttq.load=function(e){var n=d.createElement('script');n.async=!0;
n.src='https://analytics.tiktok.com/i18n/pixel/events.js?sdkid='+e;
var a=d.getElementsByTagName('script')[0];a.parentNode.insertBefore(n,a)};
ttq.load('${tiktokPixelId}');ttq.grantConsent();ttq.page();}(window,document,'ttq');`}
        </Script>
      ) : null}
    </>
  );
}
