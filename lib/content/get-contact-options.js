import { fallbackContent } from "./fallback";
import { hasSanityConfig, sanityClient } from "../sanity/client";

const contactOptionsQuery = `{
  "services": *[_type == "service" && isActive == true].slug.current,
  "modalities": *[_type == "contactSettings"][0].modalities,
  "weekdays": *[_type == "contactSettings"][0].availableWeekdays,
  "startTimes": *[_type == "contactSettings"][0].availableStartTimes
}`;

function validOptions(value) {
  return Array.isArray(value)
    ? value.filter((option) => typeof option === "string" && option.length > 0)
    : [];
}

function validServiceOptions(value) {
  return validOptions(value).filter((slug) => /^[a-z0-9-]{2,80}$/.test(slug));
}

export function mergeContactOptions(content, fallback) {
  const services = validServiceOptions(content?.services);
  const modalities = validOptions(content?.modalities);
  const weekdays = validOptions(content?.weekdays);
  const startTimes = validOptions(content?.startTimes);

  return {
    services: services.length >= 3 ? services : fallback.services,
    modalities: modalities.length > 0 ? modalities : fallback.modalities,
    weekdays: weekdays.length > 0 ? weekdays : fallback.weekdays,
    startTimes: startTimes.length > 0 ? startTimes : fallback.startTimes,
  };
}

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

    return mergeContactOptions(content, fallback);
  } catch {
    return fallback;
  }
}
