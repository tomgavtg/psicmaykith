"use client";

import {
  getStoredConsent,
  hasMeasurementConsent,
} from "./consent";

const allowedEvents = new Set([
  "view_landing",
  "click_whatsapp",
  "form_start",
  "generate_lead",
  "click_email",
]);

const allowedParameters = {
  view_landing: new Set([
    "path",
    "referrer_class",
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
  ]),
  click_whatsapp: new Set(["location"]),
  form_start: new Set([]),
  generate_lead: new Set(["method"]),
  click_email: new Set(["location"]),
};

function sanitizeParameters(event, parameters) {
  const permitted = allowedParameters[event] || new Set();

  return Object.fromEntries(
    Object.entries(parameters).filter(
      ([key, value]) =>
        permitted.has(key) &&
        typeof value === "string" &&
        value.length > 0 &&
        value.length <= 120,
    ),
  );
}

export function trackEvent(event, parameters = {}) {
  const consent =
    typeof window === "undefined" ? null : getStoredConsent();

  if (
    typeof window === "undefined" ||
    !hasMeasurementConsent(consent) ||
    !allowedEvents.has(event)
  ) {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...sanitizeParameters(event, parameters) });

  if (consent.marketing) {
    if (event === "generate_lead") {
      window.fbq?.("track", "Lead");
      window.ttq?.track?.("Lead");
    } else if (event === "click_whatsapp") {
      window.fbq?.("track", "Contact");
      window.ttq?.track?.("Contact");
    }
  }
}
