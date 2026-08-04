"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";

export function TurnstileWidget({ siteKey, onToken, resetKey }) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const [verificationMessage, setVerificationMessage] = useState("");

  const removeWidget = useCallback(() => {
    const widgetId = widgetIdRef.current;
    widgetIdRef.current = null;

    if (widgetId !== null && window.turnstile) {
      try {
        window.turnstile.remove(widgetId);
      } catch {
        // El widget puede haber sido retirado previamente por Fast Refresh.
      }
    }
  }, []);

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
      callback: (token) => {
        setVerificationMessage("");
        onToken(token);
      },
      "expired-callback": () => {
        setVerificationMessage(
          "La verificación venció. Espera a que se genere una nueva antes de enviar.",
        );
        onToken("");
      },
      "error-callback": () => {
        setVerificationMessage(
          "No pudimos completar la verificación. Intenta nuevamente o utiliza WhatsApp.",
        );
        onToken("");
      },
    });
  }, [onToken, siteKey]);

  useEffect(() => {
    renderWidget();
    return removeWidget;
  }, [removeWidget, renderWidget]);

  useEffect(() => {
    if (resetKey === 0) return undefined;

    removeWidget();
    const renderTimer = window.setTimeout(() => {
      setVerificationMessage("");
      onToken("");
      renderWidget();
    }, 0);

    return () => window.clearTimeout(renderTimer);
  }, [onToken, removeWidget, renderWidget, resetKey]);

  if (!siteKey) {
    return (
      <p className="form-configuration-note" role="status">
        El formulario por correo no está disponible temporalmente. Puedes solicitar tu
        cita por WhatsApp.
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
      {verificationMessage ? (
        <p className="form-configuration-note" role="alert">
          {verificationMessage}
        </p>
      ) : null}
    </>
  );
}
