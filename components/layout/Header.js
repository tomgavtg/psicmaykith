import { WhatsAppIcon } from "../icons";
import { buildWhatsAppUrl } from "../../lib/contact/whatsapp";
import { TrackedLink } from "../analytics/TrackedLink";

export function Header({ name, contactSettings }) {
  const whatsappUrl = buildWhatsAppUrl(
    contactSettings.whatsappNumber,
    contactSettings.whatsappMessage,
  );

  return (
    <header className="site-header">
      <div className="container header-inner">
        <a className="brand" href="#sobre-mi" aria-label={`${name}, inicio`}>
          <span className="brand-mark" aria-hidden="true">
            M
          </span>
          <span>{name}</span>
        </a>

        <nav className="main-nav" aria-label="Navegación principal">
          <a href="#sobre-mi">Inicio</a>
          <a href="#servicios">Servicios</a>
          <a href="#agendar">Agendar</a>
        </nav>

        {whatsappUrl ? (
          <TrackedLink
            className="button button-primary header-cta"
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            eventName="click_whatsapp"
            eventParameters={{ location: "header" }}
          >
            <WhatsAppIcon />
            <span>Agendar</span>
          </TrackedLink>
        ) : (
          <a className="button button-primary header-cta" href="#agendar">
            Agendar
          </a>
        )}
      </div>
    </header>
  );
}
