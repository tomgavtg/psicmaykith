"use client";

export function ConsentPreferencesButton() {
  return (
    <button
      type="button"
      className="footer-button"
      onClick={() => window.dispatchEvent(new Event("open-consent-settings"))}
    >
      Preferencias de privacidad
    </button>
  );
}
