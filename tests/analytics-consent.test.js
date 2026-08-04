import { describe, expect, it } from "vitest";
import {
  CONSENT_STORAGE_KEY,
  LEGACY_CONSENT_STORAGE_KEY,
  createConsentPreference,
  getStoredConsent,
  parseConsent,
  storeConsentPreference,
} from "../lib/analytics/consent";

function memoryStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
}

describe("consentimiento de medición", () => {
  it("conserva categorías separadas y una caducidad", () => {
    const consent = createConsentPreference(
      { analytics: true, marketing: false },
      Date.UTC(2026, 7, 4),
    );

    expect(consent.analytics).toBe(true);
    expect(consent.marketing).toBe(false);
    expect(Date.parse(consent.expiresAt)).toBeGreaterThan(
      Date.parse(consent.updatedAt),
    );
  });

  it("descarta elecciones vencidas", () => {
    const consent = createConsentPreference(
      { analytics: true, marketing: true },
      Date.UTC(2025, 0, 1),
    );

    expect(parseConsent(JSON.stringify(consent), Date.UTC(2026, 7, 4)).decided).toBe(
      false,
    );
  });

  it("migra el consentimiento anterior sin ampliar a marketing", () => {
    const storage = memoryStorage({
      [LEGACY_CONSENT_STORAGE_KEY]: "accepted",
    });
    const consent = getStoredConsent(storage);

    expect(consent.analytics).toBe(true);
    expect(consent.marketing).toBe(false);
    expect(storage.getItem(LEGACY_CONSENT_STORAGE_KEY)).toBeNull();
    expect(storage.getItem(CONSENT_STORAGE_KEY)).toBeTruthy();
  });

  it("guarda una preferencia nueva", () => {
    const storage = memoryStorage();
    storeConsentPreference(
      { analytics: false, marketing: true },
      storage,
    );

    const consent = getStoredConsent(storage);
    expect(consent.analytics).toBe(false);
    expect(consent.marketing).toBe(true);
  });
});
