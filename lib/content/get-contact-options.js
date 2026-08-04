import { fallbackContent } from "./fallback";
import { hasSanityConfig, sanityClient } from "../sanity/client";

const contactOptionsQuery = `{
  "services": *[_type == "service" && isActive == true].slug.current,
  "modalities": *[_type == "contactSettings"][0].modalities,
  "weekdays": *[_type == "contactSettings"][0].availableWeekdays,
  "startTimes": *[_type == "contactSettings"][0].availableStartTimes
}`;

export async function getContactOptions() {
  const fallback = {
    services: fallbackContent.services.map((service) => service.slug),
    modalities: fallbackContent.contactSettings.modalities,
    weekdays: fallbackContent.contactSettings.availableWeekdays,
    startTimes: fallbackContent.contactSettings.availableStartTimes,
  };

  if (!hasSanityConfig) {
    return fallback;
  }

  try {
    const content = await sanityClient.fetch(
      contactOptionsQuery,
      {},
      { cache: "no-store" },
    );

    if (
      !content?.services?.length ||
      !content?.modalities?.length ||
      !content?.weekdays?.length ||
      !content?.startTimes?.length
    ) {
      return fallback;
    }

    return content;
  } catch {
    return fallback;
  }
}
