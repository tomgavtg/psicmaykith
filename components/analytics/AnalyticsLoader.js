"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { trackEvent } from "../../lib/analytics/events";

export function AnalyticsLoader() {
  const [enabled, setEnabled] = useState(false);
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
      const nextValue =
        event?.detail || localStorage.getItem("analytics-consent");
      setEnabled(nextValue === "accepted");
    }

    syncConsent();
    window.addEventListener("consent-change", syncConsent);
    return () => window.removeEventListener("consent-change", syncConsent);
  }, []);

  useEffect(() => {
    if (enabled) {
      trackEvent("view_landing", { path: window.location.pathname });
    }
  }, [enabled]);

  if (!enabled) {
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
      {metaPixelId ? (
        <Script id="meta-pixel-loader" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${metaPixelId}');fbq('track','PageView');`}
        </Script>
      ) : null}
      {tiktokPixelId ? (
        <Script id="tiktok-pixel-loader" strategy="afterInteractive">
          {`!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];
ttq.methods=['page','track','identify','instances','debug','on','off','once','ready','alias','group','enableCookie','disableCookie','holdConsent','revokeConsent','grantConsent'];
ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat([].slice.call(arguments,0)))}};
for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
ttq.load=function(e){var n=d.createElement('script');n.async=!0;
n.src='https://analytics.tiktok.com/i18n/pixel/events.js?sdkid='+e;
var a=d.getElementsByTagName('script')[0];a.parentNode.insertBefore(n,a)};
ttq.load('${tiktokPixelId}');ttq.page();}(window,document,'ttq');`}
        </Script>
      ) : null}
    </>
  );
}
