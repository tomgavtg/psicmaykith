import { getSocialImage } from "./home-seo";
import { isProductionLaunchEnabled } from "../content/publication";

export const SERVICE_SLUGS = [
  "terapia-para-adultos",
  "terapia-para-adolescentes",
  "terapia-de-pareja",
];

export const PUBLIC_CONTENT_PATHS = [
  "/sobre-mi",
  "/psicoterapia-en-linea",
  ...SERVICE_SLUGS.map((slug) => `/${slug}`),
  "/preguntas-frecuentes",
];

function pageUrl(siteUrl, path) {
  return new URL(path, `${siteUrl}/`).toString();
}

function metaDescription(value, maximumLength = 160) {
  const normalized = String(value || "").replace(/\s+/g, " ").trim();
  if (normalized.length <= maximumLength) return normalized;

  const candidate = normalized.slice(0, maximumLength - 1);
  const lastSpace = candidate.lastIndexOf(" ");
  return `${candidate.slice(0, Math.max(lastSpace, 80)).trim()}…`;
}

function professionalEntity(content, siteUrl) {
  const profile = content.professionalProfile;

  return {
    "@type": "Person",
    "@id": `${siteUrl}/#professional`,
    name: profile.fullName,
    jobTitle: "Psicóloga",
    url: pageUrl(siteUrl, "/sobre-mi"),
    ...(profile.portrait?.url ? { image: profile.portrait.url } : {}),
    ...(profile.licenseNumber
      ? {
          hasCredential: {
            "@type": "EducationalOccupationalCredential",
            credentialCategory: "Cédula profesional",
            identifier: profile.licenseNumber,
          },
        }
      : {}),
    ...(content.seoSettings.socialProfiles?.length
      ? { sameAs: content.seoSettings.socialProfiles }
      : {}),
  };
}

function breadcrumbEntity(siteUrl, name, path) {
  return {
    "@type": "BreadcrumbList",
    "@id": `${pageUrl(siteUrl, path)}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name,
        item: pageUrl(siteUrl, path),
      },
    ],
  };
}

export function buildContentMetadata({
  content,
  siteUrl,
  path,
  title,
  description,
}) {
  const canonical = pageUrl(siteUrl, path);
  const normalizedDescription = metaDescription(description);
  const socialImage = getSocialImage({
    seoSettings: content.seoSettings,
    siteUrl,
    professionalName: content.siteSettings.headerName,
  });
  const robots = !isProductionLaunchEnabled() || content.isPlaceholder
    ? { index: false, follow: false }
    : {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large",
          "max-snippet": -1,
          "max-video-preview": -1,
        },
      };

  return {
    title: { absolute: title },
    description: normalizedDescription,
    alternates: { canonical },
    openGraph: {
      type: "website",
      locale: "es_MX",
      url: canonical,
      siteName: content.siteSettings.headerName,
      title,
      description: normalizedDescription,
      images: [socialImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: normalizedDescription,
      images: [socialImage],
    },
    robots,
  };
}

export function buildProfileStructuredData({ content, siteUrl }) {
  const path = "/sobre-mi";
  const url = pageUrl(siteUrl, path);
  const profile = content.professionalProfile;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": `${url}#webpage`,
        url,
        name: `Sobre ${profile.fullName}`,
        description: profile.shortBio,
        inLanguage: "es-MX",
        isPartOf: { "@id": `${siteUrl}/#website` },
        mainEntity: { "@id": `${siteUrl}/#professional` },
        breadcrumb: { "@id": `${url}#breadcrumb` },
      },
      professionalEntity(content, siteUrl),
      breadcrumbEntity(siteUrl, "Sobre mí", path),
    ],
  };
}

export function buildServiceStructuredData({ content, service, siteUrl }) {
  const path = `/${service.slug}`;
  const url = pageUrl(siteUrl, path);
  const areaServed = content.seoSettings.areaServed?.length
    ? content.seoSettings.areaServed
    : content.contactSettings.serviceAreas;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: `${service.name} en línea`,
        description: service.shortDescription,
        inLanguage: "es-MX",
        isPartOf: { "@id": `${siteUrl}/#website` },
        about: { "@id": `${url}#service` },
        breadcrumb: { "@id": `${url}#breadcrumb` },
      },
      {
        "@type": "Service",
        "@id": `${url}#service`,
        url,
        name: service.name,
        description: service.shortDescription,
        serviceType: "Psicoterapia en línea",
        provider: { "@id": `${siteUrl}/#professional` },
        ...(areaServed?.length ? { areaServed } : {}),
        ...(service.bookingUrl
          ? { potentialAction: { "@type": "ReserveAction", target: service.bookingUrl } }
          : {}),
      },
      professionalEntity(content, siteUrl),
      breadcrumbEntity(siteUrl, service.name, path),
    ],
  };
}

export function buildOnlineTherapyStructuredData({ content, siteUrl }) {
  const path = "/psicoterapia-en-linea";
  const url = pageUrl(siteUrl, path);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: "Psicoterapia psicoanalítica en línea",
        description: content.seoSettings.metaDescription,
        inLanguage: "es-MX",
        isPartOf: { "@id": `${siteUrl}/#website` },
        about: { "@id": `${siteUrl}/#professional` },
        breadcrumb: { "@id": `${url}#breadcrumb` },
      },
      professionalEntity(content, siteUrl),
      breadcrumbEntity(siteUrl, "Psicoterapia en línea", path),
    ],
  };
}

export function buildFaqStructuredData({ questions, siteUrl }) {
  const path = "/preguntas-frecuentes";
  const url = pageUrl(siteUrl, path);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        "@id": `${url}#webpage`,
        url,
        name: "Preguntas frecuentes sobre psicoterapia en línea",
        inLanguage: "es-MX",
        isPartOf: { "@id": `${siteUrl}/#website` },
        breadcrumb: { "@id": `${url}#breadcrumb` },
        mainEntity: questions.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
      breadcrumbEntity(siteUrl, "Preguntas frecuentes", path),
    ],
  };
}
