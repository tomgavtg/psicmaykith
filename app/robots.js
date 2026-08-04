import { getSiteUrl } from "../lib/config/site-url";
import { getSiteContent } from "../lib/content/get-site-content";
import { isProductionLaunchEnabled } from "../lib/content/publication";

export default async function robots() {
  const baseUrl = getSiteUrl();
  const content = await getSiteContent();
  const isProduction =
    isProductionLaunchEnabled() && !content.isPlaceholder;

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
