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
        userAgent: [
          "Googlebot",
          "bingbot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "Claude-SearchBot",
          "Claude-User",
          "PerplexityBot",
          "Perplexity-User",
        ],
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
      {
        userAgent: ["GPTBot", "ClaudeBot", "Google-Extended"],
        disallow: "/",
      },
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
