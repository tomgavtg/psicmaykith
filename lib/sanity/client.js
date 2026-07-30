import { createClient } from "next-sanity";

export const sanityConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-07-01",
};

export const hasSanityConfig = Boolean(sanityConfig.projectId);

export const sanityClient = hasSanityConfig
  ? createClient({
      ...sanityConfig,
      useCdn: true,
      perspective: "published",
      token: process.env.SANITY_API_READ_TOKEN || undefined,
    })
  : null;
