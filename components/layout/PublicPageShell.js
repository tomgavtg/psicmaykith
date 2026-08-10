import { AnalyticsLoader } from "../analytics/AnalyticsLoader";
import { FloatingWhatsApp } from "../contact/FloatingWhatsApp";
import { ConsentManager } from "../privacy/ConsentManager";
import { Footer } from "./Footer";
import { Header } from "./Header";

export function PublicPageShell({ content, children }) {
  const { siteSettings, contactSettings } = content;
  const isPreview =
    content.isPlaceholder ||
    process.env.SITE_MODE !== "production" ||
    process.env.CONTENT_APPROVED !== "true";

  return (
    <div className="page-shell">
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      {isPreview ? (
        <div className="demo-banner" role="status">
          Versión de demostración: el contenido profesional y legal está pendiente de
          aprobación.
        </div>
      ) : null}
      <Header name={siteSettings.headerName} />
      <main id="contenido">{children}</main>
      <Footer
        siteSettings={siteSettings}
        contactSettings={contactSettings}
      />
      <ConsentManager />
      <AnalyticsLoader />
      <FloatingWhatsApp contactSettings={contactSettings} />
    </div>
  );
}
