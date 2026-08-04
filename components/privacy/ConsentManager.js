"use client";

import { useEffect, useState } from "react";
import {
  CONSENT_CHANGE_EVENT,
  emptyConsent,
  getStoredConsent,
  storeConsentPreference,
} from "../../lib/analytics/consent";

export function ConsentManager() {
  const [choice, setChoice] = useState(emptyConsent());
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const initialSync = window.setTimeout(() => {
      const savedChoice = getStoredConsent();
      setChoice(savedChoice);
      setIsOpen(!savedChoice.decided);
    }, 0);

    function openSettings() {
      setIsOpen(true);
    }

    window.addEventListener("open-consent-settings", openSettings);
    return () => {
      window.clearTimeout(initialSync);
      window.removeEventListener("open-consent-settings", openSettings);
    };
  }, []);

  function saveChoice(nextChoice) {
    const consent = storeConsentPreference(nextChoice);
    window.dispatchEvent(
      new CustomEvent(CONSENT_CHANGE_EVENT, { detail: consent }),
    );
    setChoice(consent);
    setIsOpen(false);
  }

  if (!isOpen) {
    return null;
  }

  return (
    <section
      className="consent-panel"
      aria-labelledby="consent-title"
      aria-live="polite"
    >
      <div>
        <h2 id="consent-title">Tu privacidad importa</h2>
        <p>
          La analítica mide el uso agregado del sitio. Marketing atribuye campañas en
          Google, Meta o TikTok. Ambas permanecen desactivadas hasta que elijas y nunca
          reciben los campos del formulario. Puedes contactar sin habilitarlas.
        </p>
      </div>
      <div className="consent-actions">
        <button
          type="button"
          className="button button-secondary"
          onClick={() =>
            saveChoice({ analytics: false, marketing: false })
          }
        >
          Rechazar todo
        </button>
        <button
          type="button"
          className="button button-secondary"
          onClick={() =>
            saveChoice({ analytics: true, marketing: false })
          }
        >
          Sólo analítica
        </button>
        <button
          type="button"
          className="button button-primary"
          onClick={() =>
            saveChoice({ analytics: true, marketing: true })
          }
        >
          Aceptar todo
        </button>
      </div>
      {choice.decided ? (
        <p className="consent-current">
          Preferencia actual: analítica {choice.analytics ? "activa" : "inactiva"} y
          marketing {choice.marketing ? "activo" : "inactivo"}.
        </p>
      ) : null}
    </section>
  );
}
