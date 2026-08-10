import { afterEach, describe, expect, it, vi } from "vitest";
import {
  CONSENT_STORAGE_KEY,
  createConsentPreference,
} from "../lib/analytics/consent";
import { trackEvent } from "../lib/analytics/events";

function installBrowser({ analytics = false, marketing = false } = {}) {
  const consent = createConsentPreference({ analytics, marketing });
  const values = new Map([[CONSENT_STORAGE_KEY, JSON.stringify(consent)]]);
  const localStorage = {
    getItem: vi.fn((key) => values.get(key) ?? null),
    setItem: vi.fn((key, value) => values.set(key, value)),
    removeItem: vi.fn((key) => values.delete(key)),
  };
  const windowValue = { dataLayer: [], localStorage };

  vi.stubGlobal("localStorage", localStorage);
  vi.stubGlobal("window", windowValue);

  return windowValue;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("eventos de analítica", () => {
  it("emite click_whatsapp al continuar con consentimiento analítico", () => {
    const browser = installBrowser({ analytics: true });

    expect(
      trackEvent("click_whatsapp", { location: "contact_form" }),
    ).toBe(true);
    expect(browser.dataLayer).toEqual([
      { event: "click_whatsapp", location: "contact_form" },
    ]);
  });

  it("no emite click_whatsapp cuando la medición fue rechazada", () => {
    const browser = installBrowser();

    expect(
      trackEvent("click_whatsapp", { location: "contact_form" }),
    ).toBe(false);
    expect(browser.dataLayer).toEqual([]);
  });

  it("descarta parámetros no permitidos del formulario", () => {
    const browser = installBrowser({ analytics: true });

    trackEvent("click_whatsapp", {
      location: "contact_form",
      name: "Dato que no debe enviarse",
      motive: "Dato sensible que no debe enviarse",
    });

    expect(browser.dataLayer).toEqual([
      { event: "click_whatsapp", location: "contact_form" },
    ]);
  });
});
