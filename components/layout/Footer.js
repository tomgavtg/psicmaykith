import Link from "next/link";
import { ConsentPreferencesButton } from "../privacy/ConsentPreferencesButton";
import { TrackedLink } from "../analytics/TrackedLink";

export function Footer({ siteSettings, contactSettings }) {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <p className="footer-brand">{siteSettings.siteName}</p>
          <p className="footer-copy">{siteSettings.footerText}</p>
        </div>
        <div className="footer-links" aria-label="Enlaces del pie de página">
          <Link href="/aviso-de-privacidad">Aviso de privacidad</Link>
          {contactSettings.email ? (
            <TrackedLink
              href={`mailto:${contactSettings.email}`}
              eventName="click_email"
              eventParameters={{ location: "footer" }}
            >
              Correo
            </TrackedLink>
          ) : null}
          <ConsentPreferencesButton />
        </div>
      </div>
    </footer>
  );
}
