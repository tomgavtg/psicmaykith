import Link from "next/link";
import { Breadcrumbs } from "../../components/seo/Breadcrumbs";
import { JsonLd } from "../../components/seo/JsonLd";
import { PublicPageShell } from "../../components/layout/PublicPageShell";
import { getSiteUrl } from "../../lib/config/site-url";
import { getSiteContent } from "../../lib/content/get-site-content";
import {
  buildContentMetadata,
  buildOnlineTherapyStructuredData,
} from "../../lib/seo/content-pages";

const description =
  "Conoce cómo funciona la psicoterapia psicoanalítica en línea para adolescentes, adultos y parejas con Psic. Mayumi Kitahara.";

export async function generateMetadata() {
  const content = await getSiteContent();

  return buildContentMetadata({
    content,
    siteUrl: getSiteUrl(),
    path: "/psicoterapia-en-linea",
    title: "Psicoterapia psicoanalítica en línea | Psic. Mayumi Kitahara",
    description,
  });
}

export default async function OnlineTherapyPage() {
  const content = await getSiteContent();
  const structuredData = content.isPlaceholder
    ? null
    : buildOnlineTherapyStructuredData({ content, siteUrl: getSiteUrl() });

  return (
    <PublicPageShell content={content}>
      <article className="content-page">
        <div className="container content-container">
          <Breadcrumbs current="Psicoterapia en línea" />
          <header className="content-hero">
            <div>
              <p className="section-kicker">Modalidad en línea</p>
              <h1>Psicoterapia psicoanalítica en línea</h1>
              <p className="content-lead">
                {content.professionalProfile.headline}
              </p>
            </div>
          </header>

          <div className="content-grid">
            <section className="content-card">
              <p className="section-kicker">El enfoque</p>
              <h2>Comprender lo que ocurre y lo que se repite</h2>
              <p>{content.professionalProfile.approach}</p>
            </section>
            <section className="content-card">
              <p className="section-kicker">Cómo comenzar</p>
              <h2>Reserva con información clara</h2>
              <ol className="steps-list">
                <li>Elige el tipo de sesión que corresponde a tu consulta.</li>
                <li>Consulta la disponibilidad en la agenda de Google Calendar.</li>
                <li>Completa los datos requeridos y revisa el precio.</li>
                <li>La cita se confirma después de completar el pago.</li>
              </ol>
            </section>
          </div>

          <section className="content-section" aria-labelledby="online-services-title">
            <p className="section-kicker">Servicios disponibles</p>
            <h2 id="online-services-title">Elige el espacio adecuado</h2>
            <div className="content-service-links">
              {content.services.map((service) => (
                <Link href={`/${service.slug}`} key={service._id || service.slug}>
                  <strong>{service.name}</strong>
                  <span>{service.shortDescription}</span>
                </Link>
              ))}
            </div>
          </section>

          <div className="content-actions">
            <Link className="button button-primary" href="/#agendar">
              Ver agenda y reservar
            </Link>
            <Link className="button button-secondary" href="/preguntas-frecuentes">
              Consultar preguntas frecuentes
            </Link>
          </div>

          <div className="safety-card" role="note">
            <strong>Privacidad y emergencias</strong>
            <p>
              Evita compartir diagnósticos, medicamentos, antecedentes u otra
              información clínica extensa mediante formularios o WhatsApp.
            </p>
            <p>{content.siteSettings.crisisNotice}</p>
          </div>
        </div>
      </article>
      <JsonLd data={structuredData} />
    </PublicPageShell>
  );
}
