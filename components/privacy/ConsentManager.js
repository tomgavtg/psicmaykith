"use client";

import { useEffect, useState } from "react";

export function ConsentManager() {
  const [choice, setChoice] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const initialSync = window.setTimeout(() => {
      const savedChoice = localStorage.getItem("analytics-consent");
      setChoice(savedChoice);
      setIsOpen(!savedChoice);
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
    localStorage.setItem("analytics-consent", nextChoice);
    window.dispatchEvent(
      new CustomEvent("consent-change", { detail: nextChoice }),
    );
    setChoice(nextChoice);
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
          Las mediciones de campañas permanecen desactivadas hasta que aceptes. Puedes
          usar el sitio y contactar sin habilitarlas.
        </p>
      </div>
      <div className="consent-actions">
        <button
          type="button"
          className="button button-secondary"
          onClick={() => saveChoice("rejected")}
        >
          Rechazar
        </button>
        <button
          type="button"
          className="button button-primary"
          onClick={() => saveChoice("accepted")}
        >
          Aceptar medición
        </button>
      </div>
      {choice ? (
        <p className="consent-current">
          Preferencia actual: {choice === "accepted" ? "aceptada" : "rechazada"}.
        </p>
      ) : null}
    </section>
  );
}
