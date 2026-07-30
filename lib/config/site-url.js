export const DEFAULT_SITE_URL = "https://localhost:3000";

export function getSiteUrl(
  candidate = process.env.NEXT_PUBLIC_SITE_URL,
  fallback = DEFAULT_SITE_URL,
) {
  try {
    const url = new URL(candidate || fallback);

    if (url.protocol !== "https:") {
      return fallback;
    }

    return url.origin;
  } catch {
    return fallback;
  }
}
