import { getSiteUrl } from "../lib/config/site-url";

export default function robots() {
  const baseUrl = getSiteUrl();
  const isProduction =
    process.env.SITE_MODE === "production" &&
    process.env.CONTENT_APPROVED === "true";

  if (!isProduction) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
