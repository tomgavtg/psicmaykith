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

  return {
    title: seoSettings.metaTitle,
    description: seoSettings.metaDescription,
    alternates: { canonical: siteUrl },
    openGraph: {
      type: "website",
      locale: "es_MX",
      url: siteUrl,
      title: seoSettings.metaTitle,
      description: seoSettings.metaDescription,
      images: seoSettings.ogImage?.url
        ? [
            {
              url: seoSettings.ogImage.url,
              alt:
                seoSettings.ogImage.alt ||
                seoSettings.ogImageAlt ||
                "Imagen de presentación",
            },
          ]
        : [],
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
        "@type": seoSettings.businessType || "ProfessionalService",
        name: professionalProfile.fullName,
        url: siteUrl,
        ...(professionalProfile.portrait?.url
          ? { image: professionalProfile.portrait.url }
          : {}),
        ...(contactSettings.phoneDisplay
          ? { telephone: contactSettings.phoneDisplay }
          : {}),
        ...(contactSettings.email ? { email: contactSettings.email } : {}),
        ...(contactSettings.locationName
          ? { areaServed: contactSettings.locationName }
          : {}),
        ...(seoSettings.socialProfiles?.length
          ? { sameAs: seoSettings.socialProfiles }
          : {}),
      };

  return (
    <div className="page-shell">
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      {content.isPlaceholder || isPreview ? (
        <div className="demo-banner" role="status">
          Versión de demostración: el contenido profesional y los datos de contacto
          están pendientes de aprobación.
        </div>
      ) : null}
      <Header name={siteSettings.headerName} contactSettings={contactSettings} />
      <main id="contenido">
        <Hero
          profile={professionalProfile}
          contactSettings={contactSettings}
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
