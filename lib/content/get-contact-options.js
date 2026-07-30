import { fallbackContent } from "./fallback";
import { hasSanityConfig, sanityClient } from "../sanity/client";

const contactOptionsQuery = `{
  "services": *[_type == "service" && isActive == true].slug.current,
  "modalities": *[_type == "contactSettings"][0].modalities,
  "schedules": *[_type == "contactSettings"][0].preferredScheduleOptions
}`;

export async function getContactOptions() {
  const fallback = {
    services: fallbackContent.services.map((service) => service.slug),
    modalities: fallbackContent.contactSettings.modalities,
    schedules: fallbackContent.contactSettings.preferredScheduleOptions,
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
      !content?.schedules?.length
    ) {
      return fallback;
    }

    return content;
  } catch {
    return fallback;
  }
}
