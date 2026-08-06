import { AnalyticsLoader } from "../components/analytics/AnalyticsLoader";
import { FloatingWhatsApp } from "../components/contact/FloatingWhatsApp";
import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";
import { ConsentManager } from "../components/privacy/ConsentManager";
import { Contact } from "../components/sections/Contact";
import { Hero } from "../components/sections/Hero";
import { Services } from "../components/sections/Services";
import { getSiteUrl } from "../lib/config/site-url";
import { getSiteContent } from "../lib/content/get-site-content";
import { headers } from "next/headers";

export async function generateMetadata() {
  const { seoSettings, isPlaceholder } = await getSiteContent();
  const siteUrl = getSiteUrl(
    seoSettings.canonicalOverride ||
      process.env.NEXT_PUBLIC_SITE_URL,
  );

  const socialImage = seoSettings.ogImage?.url
    ? {
        url: seoSettings.ogImage.url,
        alt:
          seoSettings.ogImage.alt ||
          seoSettings.ogImageAlt ||
          "Presentación de los servicios de psicoterapia",
      }
    : null;

  return {
    title: seoSettings.metaTitle,
    description: seoSettings.metaDescription,
    alternates: { canonical: siteUrl },
    openGraph: {
      type: "website",
      locale: "es_MX",
      url: siteUrl,
      siteName: "Psicóloga Mayumi Kitahara",
      title: seoSettings.metaTitle,
      description: seoSettings.metaDescription,
      ...(socialImage ? { images: [socialImage] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: seoSettings.metaTitle,
      description: seoSettings.metaDescription,
      ...(socialImage ? { images: [socialImage] } : {}),
    },
    robots: isPlaceholder ? { index: false, follow: false } : undefined,
  };
}

export default async function HomePage() {
  const content = await getSiteContent();
  const nonce = (await headers()).get("x-nonce") || undefined;
  const isPreview =
    process.env.SITE_MODE !== "production" ||
    process.env.CONTENT_APPROVED !== "true";
  const {
    siteSettings,
    professionalProfile,
    services,
    contactSettings,
    seoSettings,
  } = content;
  const siteUrl = getSiteUrl();
  const structuredData = content.isPlaceholder
    ? null
    : {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebSite",
            "@id": `${siteUrl}/#website`,
            url: siteUrl,
            name: siteSettings.siteName,
            inLanguage: "es-MX",
          },
          {
            "@type": seoSettings.businessType || "ProfessionalService",
            "@id": `${siteUrl}/#professional-service`,
            name: professionalProfile.fullName,
            url: siteUrl,
            description: seoSettings.metaDescription,
            ...(professionalProfile.portrait?.url
              ? { image: professionalProfile.portrait.url }
              : {}),
            ...(contactSettings.phoneDisplay
              ? { telephone: contactSettings.phoneDisplay }
              : {}),
            ...(contactSettings.email ? { email: contactSettings.email } : {}),
            ...(seoSettings.areaServed?.length
              ? { areaServed: seoSettings.areaServed }
              : contactSettings.serviceAreas?.length
                ? { areaServed: contactSettings.serviceAreas }
                : {}),
            ...(seoSettings.socialProfiles?.length
              ? { sameAs: seoSettings.socialProfiles }
              : {}),
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Servicios de psicoterapia",
              itemListElement: services.map((service) => ({
                "@type": "Offer",
                ...(service.bookingUrl ? { url: service.bookingUrl } : {}),
                itemOffered: {
                  "@type": "Service",
                  name: service.name,
                  description: service.shortDescription,
                  serviceType: "Psicoterapia en línea",
                },
              })),
            },
          },
        ],
      };

  return (
    <div className="page-shell">
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      {content.isPlaceholder || isPreview ? (
        <div className="demo-banner" role="status">
          Versión de demostración: el contenido profesional y legal está pendiente de
          aprobación.
        </div>
      ) : null}
      <Header name={siteSettings.headerName} />
      <main id="contenido">
        <Hero
          profile={professionalProfile}
          globalNotice={siteSettings.globalNotice}
        />
        <Services services={services} />
        <Contact
          contactSettings={contactSettings}
          services={services}
          crisisNotice={siteSettings.crisisNotice}
        />
      </main>
      <Footer
        siteSettings={siteSettings}
        contactSettings={contactSettings}
      />
      <ConsentManager />
      <AnalyticsLoader />
      <FloatingWhatsApp contactSettings={contactSettings} />
      {structuredData ? (
        <script
          nonce={nonce}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replaceAll("<", "\\u003c"),
          }}
        />
      ) : null}
    </div>
  );
}
