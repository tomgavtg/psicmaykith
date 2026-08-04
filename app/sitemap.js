import { getSiteUrl } from "../lib/config/site-url";
import { getSiteContent } from "../lib/content/get-site-content";
import {
  isPrivacyNoticePublishable,
  isProductionLaunchEnabled,
} from "../lib/content/publication";

function lastUpdatedAt(content) {
  const candidates = [
    content.siteSettings?._updatedAt,
    content.professionalProfile?._updatedAt,
    content.contactSettings?._updatedAt,
    content.seoSettings?._updatedAt,
    content.privacyNotice?._updatedAt,
    ...(content.services || []).map((service) => service._updatedAt),
  ]
    .filter(Boolean)
    .map((value) => new Date(value))
    .filter((value) => !Number.isNaN(value.getTime()));

  return candidates.length
    ? new Date(Math.max(...candidates.map((value) => value.getTime())))
    : undefined;
}

export default async function sitemap() {
  const content = await getSiteContent();

  if (!isProductionLaunchEnabled() || content.isPlaceholder) {
    return [];
  }

  const baseUrl = getSiteUrl();
  const contentLastModified = lastUpdatedAt(content);

  const entries = [
    {
      url: baseUrl,
      ...(contentLastModified ? { lastModified: contentLastModified } : {}),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];

  if (isPrivacyNoticePublishable(content.privacyNotice)) {
    entries.push({
      url: `${baseUrl}/aviso-de-privacidad`,
      ...(content.privacyNotice?._updatedAt
        ? { lastModified: new Date(content.privacyNotice._updatedAt) }
        : {}),
      changeFrequency: "yearly",
      priority: 0.3,
    });
  }

  return entries;
}
