"use client";

export const CONSENT_STORAGE_KEY = "marketing-consent";
export const LEGACY_CONSENT_STORAGE_KEY = "analytics-consent";
export const CONSENT_CHANGE_EVENT = "consent-change";
export const CONSENT_VERSION = "2026-08-04";
export const CONSENT_MAX_AGE_DAYS = 180;

export function emptyConsent() {
  return {
    version: CONSENT_VERSION,
    decided: false,
    analytics: false,
    marketing: false,
    updatedAt: null,
    expiresAt: null,
  };
}

export function parseConsent(rawValue, now = Date.now()) {
  if (!rawValue) return emptyConsent();

  try {
    const parsed = JSON.parse(rawValue);
    const expiresAt = Date.parse(parsed.expiresAt || "");

    if (
      parsed.version !== CONSENT_VERSION ||
      parsed.decided !== true ||
      !Number.isFinite(expiresAt) ||
      expiresAt <= now
    ) {
      return emptyConsent();
    }

    return {
      version: CONSENT_VERSION,
      decided: true,
      analytics: parsed.analytics === true,
      marketing: parsed.marketing === true,
      updatedAt: parsed.updatedAt || null,
      expiresAt: parsed.expiresAt,
    };
  } catch {
    return emptyConsent();
  }
}

export function createConsentPreference(
  { analytics = false, marketing = false },
  now = Date.now(),
) {
  const updatedAt = new Date(now);
  const expiresAt = new Date(
    now + CONSENT_MAX_AGE_DAYS * 24 * 60 * 60 * 1000,
  );

  return {
    version: CONSENT_VERSION,
    decided: true,
    analytics: analytics === true,
    marketing: marketing === true,
    updatedAt: updatedAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };
}

export function getStoredConsent(storage = globalThis.localStorage) {
  if (!storage) return emptyConsent();

  const stored = parseConsent(storage.getItem(CONSENT_STORAGE_KEY));
  if (stored.decided) return stored;

  const legacyChoice = storage.getItem(LEGACY_CONSENT_STORAGE_KEY);
  if (legacyChoice === "accepted") {
    // El consentimiento anterior sólo mencionaba medición. No se amplía a marketing.
    const migrated = createConsentPreference({
      analytics: true,
      marketing: false,
    });
    storage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(migrated));
    storage.removeItem(LEGACY_CONSENT_STORAGE_KEY);
    return migrated;
  }
  if (legacyChoice === "rejected") {
    const migrated = createConsentPreference({
      analytics: false,
      marketing: false,
    });
    storage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(migrated));
    storage.removeItem(LEGACY_CONSENT_STORAGE_KEY);
    return migrated;
  }

  return stored;
}

export function storeConsentPreference(preference, storage = localStorage) {
  const consent = createConsentPreference(preference);
  storage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent));
  storage.removeItem(LEGACY_CONSENT_STORAGE_KEY);
  return consent;
}

export function hasMeasurementConsent(consent) {
  return consent?.analytics === true || consent?.marketing === true;
}
