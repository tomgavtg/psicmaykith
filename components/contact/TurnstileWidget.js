"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef } from "react";

export function TurnstileWidget({ siteKey, onToken, resetKey }) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);

  const renderWidget = useCallback(() => {
    if (
      !siteKey ||
      !containerRef.current ||
      !window.turnstile ||
      widgetIdRef.current !== null
    ) {
      return;
    }

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      action: "contact",
      theme: "light",
      size: "flexible",
      callback: (token) => onToken(token),
      "expired-callback": () => onToken(""),
      "error-callback": () => onToken(""),
    });
  }, [onToken, siteKey]);

  useEffect(() => {
    renderWidget();
  }, [renderWidget]);

  useEffect(() => {
    if (widgetIdRef.current !== null && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
      onToken("");
    }
  }, [onToken, resetKey]);

  if (!siteKey) {
    return (
      <p className="form-configuration-note" role="status">
        El formulario se habilitará al configurar Cloudflare Turnstile.
      </p>
    );
  }

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={renderWidget}
      />
      <div ref={containerRef} className="turnstile-container" />
    </>
  );
}
