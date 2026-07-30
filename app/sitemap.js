import { getSiteUrl } from "../lib/config/site-url";

export default function sitemap() {
  if (
    process.env.SITE_MODE !== "production" ||
    process.env.CONTENT_APPROVED !== "true"
  ) {
    return [];
  }

  const baseUrl = getSiteUrl();
  const now = new Date();

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/aviso-de-privacidad`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
