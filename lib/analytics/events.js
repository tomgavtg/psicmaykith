"use client";

const allowedEvents = new Set([
  "view_landing",
  "click_whatsapp",
  "form_start",
  "generate_lead",
  "click_email",
]);

export function trackEvent(event, parameters = {}) {
  if (
    typeof window === "undefined" ||
    localStorage.getItem("analytics-consent") !== "accepted" ||
    !allowedEvents.has(event)
  ) {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...parameters });
}
