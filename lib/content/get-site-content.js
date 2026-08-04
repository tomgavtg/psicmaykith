import { cache } from "react";
import { fallbackContent } from "./fallback";
import { hasSanityConfig, sanityClient } from "../sanity/client";
import { siteContentQuery } from "../sanity/queries";
import { getServiceDurationMinutes } from "../contact/appointment";

function withoutPendingCopy(value) {
  return typeof value === "string" && value.includes("[POR DEFINIR") ? "" : value;
}

function normalizeServices(services) {
  return services.map((service) => ({
    ...service,
    durationMinutes:
      service.durationMinutes || getServiceDurationMinutes(service.slug),
    availabilityNote: withoutPendingCopy(service.availabilityNote),
  }));
}

function mergeContent(content) {
  if (!content?.siteSettings || !content?.professionalProfile) {
    return fallbackContent;
  }

  const hasPublishableCore = Boolean(
      content.siteSettings &&
      content.professionalProfile &&
      content.professionalProfile.heroTitle &&
      content.professionalProfile.portrait?.url &&
      Array.isArray(content.professionalProfile.validationItems) &&
      content.professionalProfile.validationItems.length >= 3 &&
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
    siteSettings: {
      ...fallbackContent.siteSettings,
      ...content.siteSettings,
    },
    professionalProfile: {
      ...fallbackContent.professionalProfile,
      ...content.professionalProfile,
      heroTitle:
        content.professionalProfile.heroTitle ||
        fallbackContent.professionalProfile.heroTitle,
      validationItems:
        content.professionalProfile.validationItems?.length >= 3
          ? content.professionalProfile.validationItems
          : fallbackContent.professionalProfile.validationItems,
      portrait:
        content.professionalProfile.portrait?.url
          ? content.professionalProfile.portrait
          : fallbackContent.professionalProfile.portrait,
      fullName: withoutPendingCopy(content.professionalProfile.fullName),
    },
    services:
      Array.isArray(content.services) && content.services.length >= 3
        ? normalizeServices(content.services)
        : normalizeServices(fallbackContent.services),
    contactSettings: {
      ...fallbackContent.contactSettings,
      ...content.contactSettings,
      responseTimeCopy: withoutPendingCopy(
        content.contactSettings?.responseTimeCopy,
      ),
      availableWeekdays:
        content.contactSettings?.availableWeekdays?.length > 0
          ? content.contactSettings.availableWeekdays
          : fallbackContent.contactSettings.availableWeekdays,
      availableStartTimes:
        content.contactSettings?.availableStartTimes?.length > 0
          ? content.contactSettings.availableStartTimes
          : fallbackContent.contactSettings.availableStartTimes,
    },
    seoSettings: {
      ...fallbackContent.seoSettings,
      ...content.seoSettings,
    },
    privacyNotice: content.privacyNotice
      ? {
          ...content.privacyNotice,
          controllerIdentity: withoutPendingCopy(
            content.privacyNotice.controllerIdentity,
          ),
        }
      : fallbackContent.privacyNotice,
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
