import Image from "next/image";
import { ArrowIcon, WhatsAppIcon } from "../icons";
import { buildWhatsAppUrl } from "../../lib/contact/whatsapp";
import { TrackedLink } from "../analytics/TrackedLink";

export function Hero({ profile, contactSettings, globalNotice }) {
  const whatsappUrl = buildWhatsAppUrl(
    contactSettings.whatsappNumber,
    contactSettings.whatsappMessage,
  );

  return (
    <section id="sobre-mi" className="hero section" aria-labelledby="hero-title">
      <div className="hero-orb hero-orb-one" aria-hidden="true" />
      <div className="hero-orb hero-orb-two" aria-hidden="true" />
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="section-kicker">Atención psicológica</p>
          <h1 id="hero-title">{profile.fullName}</h1>
          <p className="hero-headline">{profile.headline}</p>
          <p className="hero-bio">{profile.shortBio}</p>

          <ul className="highlight-list" aria-label="Información destacada">
            {(profile.highlights || []).slice(0, 3).map((highlight) => (
              <li key={highlight}>
                <span aria-hidden="true">✓</span>
                {highlight}
              </li>
            ))}
          </ul>

          <div className="hero-actions">
            {whatsappUrl ? (
              <TrackedLink
                className="button button-primary"
                href={whatsappUrl}
                eventName="click_whatsapp"
                eventParameters={{ location: "hero" }}
                target="_blank"
                rel="noreferrer"
              >
                <WhatsAppIcon />
                Agendar por WhatsApp
              </TrackedLink>
            ) : (
              <a className="button button-primary" href="#agendar">
                Consultar disponibilidad
              </a>
            )}
            <a className="button button-secondary" href="#servicios">
              Conocer servicios
              <ArrowIcon />
            </a>
          </div>

          <p className="safety-note">{globalNotice}</p>
        </div>

        <div className="portrait-frame">
          {profile.portrait?.url ? (
            <Image
              src={profile.portrait.url}
              alt={profile.portrait.alt || `Retrato profesional de ${profile.fullName}`}
              fill
              priority
              sizes="(max-width: 767px) 100vw, 45vw"
              className="portrait-image"
            />
          ) : (
            <div className="portrait-placeholder">
              <span className="portrait-leaf" aria-hidden="true" />
              <p>Fotografía profesional</p>
              <small>[POR DEFINIR: imagen aprobada]</small>
            </div>
          )}
          <div className="portrait-caption">
            <span>Un primer contacto</span>
            <strong>claro, humano y respetuoso</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
