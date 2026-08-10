const DEFAULT_SOCIAL_IMAGE = {
  width: 1200,
  height: 630,
};

function hasSuitableSocialRatio(image) {
  const width = Number(image?.dimensions?.width);
  const height = Number(image?.dimensions?.height);
  const ratio = Number(image?.dimensions?.aspectRatio) || width / height;

  return width >= 600 && height >= 315 && ratio >= 1.5 && ratio <= 2.1;
}

export function getSocialImage({
  seoSettings,
  siteUrl,
  professionalName,
}) {
  if (seoSettings?.ogImage?.url && hasSuitableSocialRatio(seoSettings.ogImage)) {
    return {
      url: seoSettings.ogImage.url,
      width: seoSettings.ogImage.dimensions.width,
      height: seoSettings.ogImage.dimensions.height,
      alt:
        seoSettings.ogImage.alt ||
        seoSettings.ogImageAlt ||
        `Presentación profesional de ${professionalName}`,
    };
  }

  return {
    url: `${siteUrl}/opengraph-image`,
    ...DEFAULT_SOCIAL_IMAGE,
    alt: `${professionalName}, psicoterapia en línea para CDMX`,
  };
}

export function buildHomeStructuredData({ content, siteUrl }) {
  const {
    siteSettings,
    professionalProfile,
    services = [],
    contactSettings,
    seoSettings,
  } = content;
  const websiteId = `${siteUrl}/#website`;
  const webpageId = `${siteUrl}/#webpage`;
  const organizationId = `${siteUrl}/#organization`;
  const professionalId = `${siteUrl}/#professional`;
  const areaServed = seoSettings.areaServed?.length
    ? seoSettings.areaServed
    : contactSettings.serviceAreas;

  const professional = {
    "@type": "Person",
    "@id": professionalId,
    name: professionalProfile.fullName,
    jobTitle: "Psicóloga",
    url: siteUrl,
    ...(professionalProfile.portrait?.url
      ? { image: professionalProfile.portrait.url }
      : {}),
    ...(professionalProfile.licenseNumber
      ? {
          hasCredential: {
            "@type": "EducationalOccupationalCredential",
            credentialCategory: "Cédula profesional",
            identifier: professionalProfile.licenseNumber,
          },
        }
      : {}),
  };

  const organization = {
    "@type": "Organization",
    "@id": organizationId,
    name: siteSettings.headerName,
    url: siteUrl,
    description: seoSettings.metaDescription,
    ...(professionalProfile.portrait?.url
      ? { image: professionalProfile.portrait.url }
      : {}),
    ...(contactSettings.phoneDisplay
      ? { telephone: contactSettings.phoneDisplay }
      : {}),
    ...(contactSettings.email ? { email: contactSettings.email } : {}),
    ...(areaServed?.length ? { areaServed } : {}),
    ...(seoSettings.socialProfiles?.length
      ? { sameAs: seoSettings.socialProfiles }
      : {}),
    member: { "@id": professionalId },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Servicios de psicoterapia en línea",
      itemListElement: services.map((service) => ({
        "@type": "Offer",
        ...(service.bookingUrl ? { url: service.bookingUrl } : {}),
        offeredBy: { "@id": organizationId },
        itemOffered: {
          "@type": "Service",
          name: service.name,
          description: service.shortDescription,
          serviceType: "Psicoterapia en línea",
          provider: { "@id": professionalId },
          ...(areaServed?.length ? { areaServed } : {}),
        },
      })),
    },
  };

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: siteUrl,
        name: siteSettings.headerName,
        description: seoSettings.metaDescription,
        inLanguage: "es-MX",
        publisher: { "@id": organizationId },
      },
      {
        "@type": "WebPage",
        "@id": webpageId,
        url: siteUrl,
        name: seoSettings.metaTitle,
        description: seoSettings.metaDescription,
        inLanguage: "es-MX",
        isPartOf: { "@id": websiteId },
        about: [{ "@id": organizationId }, { "@id": professionalId }],
      },
      organization,
      professional,
    ],
  };
}
