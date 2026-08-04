const SAFE_CAMPAIGN_VALUE = /^[a-zA-Z0-9._-]{1,100}$/;
const SAFE_SOURCE_VALUES = new Set([
  "google",
  "bing",
  "facebook",
  "instagram",
  "meta",
  "tiktok",
  "linkedin",
  "newsletter",
  "direct",
]);
const SAFE_MEDIUM_VALUES = new Set([
  "cpc",
  "paid_social",
  "organic",
  "referral",
  "email",
  "social",
]);

function safeValue(value) {
  return typeof value === "string" && SAFE_CAMPAIGN_VALUE.test(value)
    ? value.toLowerCase()
    : undefined;
}

function classifyReferrer(referrer, siteHostname) {
  if (!referrer) return "direct";

  try {
    const hostname = new URL(referrer).hostname.toLowerCase();
    if (hostname === siteHostname || hostname.endsWith(`.${siteHostname}`)) {
      return "internal";
    }
    if (hostname.includes("google.")) return "google";
    if (hostname.includes("bing.")) return "bing";
    if (hostname.includes("facebook.") || hostname.includes("instagram.")) {
      return "meta";
    }
    if (hostname.includes("tiktok.")) return "tiktok";
    return "other";
  } catch {
    return "other";
  }
}

export function getSafeAttribution(url, referrer = "") {
  const parsedUrl = typeof url === "string" ? new URL(url) : url;
  const source = safeValue(parsedUrl.searchParams.get("utm_source"));
  const medium = safeValue(parsedUrl.searchParams.get("utm_medium"));
  const campaign = safeValue(parsedUrl.searchParams.get("utm_campaign"));
  const content = safeValue(parsedUrl.searchParams.get("utm_content"));

  return {
    referrer_class: classifyReferrer(referrer, parsedUrl.hostname.toLowerCase()),
    ...(source && SAFE_SOURCE_VALUES.has(source) ? { utm_source: source } : {}),
    ...(medium && SAFE_MEDIUM_VALUES.has(medium) ? { utm_medium: medium } : {}),
    ...(campaign ? { utm_campaign: campaign } : {}),
    ...(content ? { utm_content: content } : {}),
  };
}
