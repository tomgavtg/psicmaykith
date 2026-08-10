import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "../../components/seo/Breadcrumbs";
import { JsonLd } from "../../components/seo/JsonLd";
import { PublicPageShell } from "../../components/layout/PublicPageShell";
import { getSiteUrl } from "../../lib/config/site-url";
import { getSiteContent } from "../../lib/content/get-site-content";
import {
  buildContentMetadata,
  buildProfileStructuredData,
} from "../../lib/seo/content-pages";

export async function generateMetadata() {
  const content = await getSiteContent();
  const profile = content.professionalProfile;

  return buildContentMetadata({
    content,
    siteUrl: getSiteUrl(),
    path: "/sobre-mi",
    title: `Sobre ${profile.fullName} | Psicóloga en línea`,
    description: profile.shortBio,
  });
}

export default async function AboutPage() {
  const content = await getSiteContent();
  const profile = content.professionalProfile;
  const structuredData = content.isPlaceholder
    ? null
    : buildProfileStructuredData({ content, siteUrl: getSiteUrl() });
  const education = (profile.education || []).filter(
    (item) => item?.degree && item?.institution,
  );
  const certifications = (profile.certifications || []).filter(
    (item) => item?.name && item?.institution,
  );

  return (
    <PublicPageShell content={content}>
      <article className="content-page">
        <div className="container content-container">
          <Breadcrumbs current="Sobre mí" />
          <div className="content-hero content-hero-profile">
            <div>
              <p className="section-kicker">Perfil profesional</p>
              <h1>{profile.fullName}</h1>
              <p className="content-lead">{profile.shortBio}</p>
              {profile.licenseNumber ? (
                <p className="credential-badge">
                  Cédula profesional: {profile.licenseNumber}
                </p>
              ) : null}
              <div className="content-actions">
                <Link className="button button-primary" href="/#agendar">
                  Reservar una cita
                </Link>
                <Link className="button button-secondary" href="/#whatsapp-contact">
                  Contactar por WhatsApp
                </Link>
              </div>
            </div>
            {profile.portrait?.url ? (
              <div className="content-portrait">
                <Image
                  src={profile.portrait.url}
                  alt={profile.portrait.alt || "Retrato profesional"}
                  fill
                  priority
                  sizes="(max-width: 767px) 100vw, 36vw"
                />
              </div>
            ) : null}
          </div>

          <div className="content-grid">
            <section className="content-card" aria-labelledby="approach-title">
              <p className="section-kicker">Enfoque terapéutico</p>
              <h2 id="approach-title">Una escucha centrada en cada proceso</h2>
              <p>{profile.approach}</p>
            </section>

            <section className="content-card" aria-labelledby="profile-data-title">
              <p className="section-kicker">Información verificable</p>
              <h2 id="profile-data-title">Formación y práctica</h2>
              {education.length ? (
                <ul className="content-list">
                  {education.map((item) => (
                    <li key={`${item.degree}-${item.institution}`}>
                      <strong>{item.degree}</strong>
                      <span>
                        {item.institution}
                        {item.year ? ` · ${item.year}` : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : null}
              {certifications.length ? (
                <ul className="content-list">
                  {certifications.map((item) => (
                    <li key={`${item.name}-${item.institution}`}>
                      <strong>{item.name}</strong>
                      <span>{item.institution}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
              {(profile.highlights || []).length ? (
                <ul className="tag-list" aria-label="Características de la atención">
                  {profile.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          </div>

          <div className="safety-card" role="note">
            <strong>Alcance del servicio</strong>
            <p>{content.siteSettings.globalNotice}</p>
            <p>{content.siteSettings.crisisNotice}</p>
          </div>
        </div>
      </article>
      <JsonLd data={structuredData} />
    </PublicPageShell>
  );
}
