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

          <ul className="highlight-list" aria-label="Información destacada">
            {(profile.highlights || []).slice(0, 3).map((highlight) => (
              <li key={highlight}>
                <span aria-hidden="true">✓</span>
                {highlight}
              </li>
            ))}
          </ul>

          <div className="hero-actions">
            <a className="button button-primary" href="#agendar">
              Reservar una cita
              <ArrowIcon />
            </a>
            <a className="button button-secondary" href="#whatsapp-contact">
              <WhatsAppIcon />
              Contactar por WhatsApp
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

      <div className="container hero-context-grid">
        {profile.validationItems?.length ? (
          <div className="reflection-panel">
            <p className="section-kicker">Tal vez te resulte familiar</p>
            <h2>¿Te ha pasado que…?</h2>
            <ul>
              {profile.validationItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {profile.approach ? (
          <div className="approach-panel">
            <p className="section-kicker">Enfoque terapéutico</p>
            <h2>Comprender lo que se repite puede abrir algo distinto</h2>
            <p>{profile.approach}</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
