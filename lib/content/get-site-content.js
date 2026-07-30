import { cache } from "react";
import { fallbackContent } from "./fallback";
import { hasSanityConfig, sanityClient } from "../sanity/client";
import { siteContentQuery } from "../sanity/queries";

function mergeContent(content) {
  if (!content?.siteSettings || !content?.professionalProfile) {
    return fallbackContent;
  }

  const hasPublishableCore = Boolean(
    content.siteSettings &&
      content.professionalProfile &&
      Array.isArray(content.services) &&
      content.services.length >= 3 &&
      content.contactSettings &&
      content.seoSettings &&
      content.privacyNotice?.status === "approved",
  );

  return {
    ...fallbackContent,
    ...content,
    isPlaceholder: !hasPublishableCore,
    services:
      Array.isArray(content.services) && content.services.length >= 3
        ? content.services
        : fallbackContent.services,
    contactSettings: {
      ...fallbackContent.contactSettings,
      ...content.contactSettings,
    },
    seoSettings: {
      ...fallbackContent.seoSettings,
      ...content.seoSettings,
    },
    privacyNotice: content.privacyNotice || fallbackContent.privacyNotice,
  };
}

export const getSiteContent = cache(async () => {
  if (!hasSanityConfig) {
    return fallbackContent;
  }

  try {
    const content = await sanityClient.fetch(
      siteContentQuery,
      {},
      { next: { revalidate: 3600, tags: ["site-content"] } },
    );

    return mergeContent(content);
  } catch {
    return fallbackContent;
  }
});
