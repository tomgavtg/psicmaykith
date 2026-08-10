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
import {
  buildHomeStructuredData,
  getSocialImage,
} from "../lib/seo/home-seo";
import { isProductionLaunchEnabled } from "../lib/content/publication";
import { headers } from "next/headers";

export async function generateMetadata() {
  const { seoSettings, siteSettings, isPlaceholder } = await getSiteContent();
  const siteUrl = getSiteUrl(
    seoSettings.canonicalOverride ||
      process.env.NEXT_PUBLIC_SITE_URL,
  );

  const socialImage = getSocialImage({
    seoSettings,
    siteUrl,
    professionalName: siteSettings.headerName,
  });

  return {
    title: { absolute: seoSettings.metaTitle },
    description: seoSettings.metaDescription,
    alternates: { canonical: siteUrl },
    openGraph: {
      type: "website",
      locale: "es_MX",
      url: siteUrl,
      siteName: siteSettings.headerName,
      title: seoSettings.metaTitle,
      description: seoSettings.metaDescription,
      images: [socialImage],
    },
    twitter: {
      card: "summary_large_image",
      title: seoSettings.metaTitle,
      description: seoSettings.metaDescription,
      images: [socialImage],
    },
    robots: !isProductionLaunchEnabled() || isPlaceholder
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
        },
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
    : buildHomeStructuredData({ content, siteUrl });

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
