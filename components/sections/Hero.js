import Image from "next/image";
import { ArrowIcon, WhatsAppIcon } from "../icons";

export function Hero({ profile, globalNotice }) {
  const hasProfessionalName =
    profile.fullName && !profile.fullName.includes("[POR DEFINIR");
  const credentials = [
    profile.licenseNumber
      ? `Cédula profesional: ${profile.licenseNumber}`
      : null,
    ...(profile.education || [])
      .filter((item) => item?.degree && item?.institution)
      .slice(0, 2)
      .map((item) => `${item.degree} · ${item.institution}`),
  ].filter(Boolean);

  return (
    <section id="sobre-mi" className="hero section" aria-labelledby="hero-title">
      <div className="hero-orb hero-orb-one" aria-hidden="true" />
      <div className="hero-orb hero-orb-two" aria-hidden="true" />
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="section-kicker">
            {hasProfessionalName ? profile.fullName : "Atención psicológica"}
          </p>
          <h1 id="hero-title">
            {profile.headline || profile.heroTitle || profile.fullName}
          </h1>
          {profile.heroTitle ? (
            <p className="hero-headline">{profile.heroTitle}</p>
          ) : null}
          <p className="hero-bio">{profile.shortBio}</p>

          {credentials.length ? (
            <ul className="credential-list" aria-label="Formación profesional">
              {credentials.map((credential) => (
                <li key={credential}>{credential}</li>
              ))}
            </ul>
          ) : null}

          <p className="professional-label">
            <span aria-hidden="true">✓</span>
            {profile.professionalLabel || "Atención profesional"}
          </p>

          <div className="hero-actions">
            <a className="button button-primary" href="#agendar">
              Agendar una cita
              <ArrowIcon />
            </a>
            <a className="button button-secondary" href="#whatsapp-contact">
              <WhatsAppIcon size={24} />
              Contacto por WhatsApp
            </a>
          </div>

          <p className="safety-note">{globalNotice}</p>
        </div>

        <div className="portrait-frame">
          {profile.portrait?.url ? (
            <Image
              src={profile.portrait.url}
              alt={profile.portrait.alt || "Retrato profesional"}
              fill
              priority
              sizes="(max-width: 767px) 100vw, 45vw"
              className="portrait-image"
            />
          ) : (
            <div className="portrait-placeholder">
              <span className="portrait-leaf" aria-hidden="true" />
              <p>Retrato profesional no disponible</p>
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
