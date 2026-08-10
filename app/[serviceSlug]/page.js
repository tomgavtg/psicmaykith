import { notFound } from "next/navigation";
import Link from "next/link";
import { TrackedLink } from "../../components/analytics/TrackedLink";
import { PublicPageShell } from "../../components/layout/PublicPageShell";
import { Breadcrumbs } from "../../components/seo/Breadcrumbs";
import { JsonLd } from "../../components/seo/JsonLd";
import { getSiteUrl } from "../../lib/config/site-url";
import { getSiteContent } from "../../lib/content/get-site-content";
import {
  buildContentMetadata,
  buildServiceStructuredData,
  SERVICE_SLUGS,
} from "../../lib/seo/content-pages";

function formatDuration(minutes) {
  if (!minutes) return "";
  if (minutes < 60) return `${minutes} minutos`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return remaining ? `${hours} hora ${remaining} minutos` : `${hours} hora`;
}

async function getService(slug) {
  if (!SERVICE_SLUGS.includes(slug)) return null;
  const content = await getSiteContent();
  const service = content.services.find((item) => item.slug === slug);
  return service ? { content, service } : null;
}

export function generateStaticParams() {
  return SERVICE_SLUGS.map((serviceSlug) => ({ serviceSlug }));
}

export async function generateMetadata({ params }) {
  const { serviceSlug } = await params;
  const result = await getService(serviceSlug);
  if (!result) return {};

  return buildContentMetadata({
    content: result.content,
    siteUrl: getSiteUrl(),
    path: `/${serviceSlug}`,
    title: `${result.service.name} en línea | Psic. Mayumi Kitahara`,
    description: result.service.shortDescription,
  });
}

export default async function ServicePage({ params }) {
  const { serviceSlug } = await params;
  const result = await getService(serviceSlug);
  if (!result) notFound();

  const { content, service } = result;
  const policy = content.contactSettings.bookingPolicy;
  const structuredData = content.isPlaceholder
    ? null
    : buildServiceStructuredData({ content, service, siteUrl: getSiteUrl() });

  return (
    <PublicPageShell content={content}>
      <article className="content-page">
        <div className="container content-container">
          <Breadcrumbs current={service.name} />
          <header className="content-hero">
            <div>
              <p className="section-kicker">Psicoterapia en línea</p>
              <h1>{service.name}</h1>
              <p className="content-lead">{service.shortDescription}</p>
              <ul className="tag-list" aria-label="Datos de la sesión">
                <li>En línea</li>
                {service.durationMinutes ? (
                  <li>{formatDuration(service.durationMinutes)}</li>
                ) : null}
              </ul>
              <div className="content-actions">
                {service.bookingUrl ? (
                  <TrackedLink
                    className="button button-primary"
                    href={service.bookingUrl}
                    target="_blank"
                    rel="noreferrer"
                    eventName="click_booking"
                    eventParameters={{ location: `service_page_${service.slug}` }}
                  >
                    Ver horarios y reservar
                  </TrackedLink>
                ) : (
                  <Link className="button button-primary" href="/#agendar">
                    Consultar disponibilidad
                  </Link>
                )}
                <Link className="button button-secondary" href="/#whatsapp-contact">
                  Contactar por WhatsApp
                </Link>
              </div>
            </div>
          </header>

          <div className="content-grid">
            <section className="content-card">
              <p className="section-kicker">Antes de reservar</p>
              <h2>Información sobre la sesión</h2>
              <ul className="plain-list">
                <li>La sesión se realiza en línea mediante videollamada.</li>
                <li>La agenda muestra disponibilidad en tiempo real.</li>
                <li>El precio se presenta antes de completar la reserva.</li>
                <li>El espacio se confirma únicamente después del pago.</li>
              </ul>
            </section>
            <section className="content-card">
              <p className="section-kicker">Reserva y cancelación</p>
              <h2>Condiciones de la cita</h2>
              {policy ? (
                <ul className="plain-list">
                  <li>
                    Cancelación sin penalización hasta{" "}
                    {policy.cancellationWindowHours} horas antes.
                  </li>
                  <li>No se permiten reprogramaciones solicitadas por la persona usuaria.</li>
                  <li>Cancelación tardía e inasistencia: sin reembolso.</li>
                  <li>
                    Si la psicóloga cancela, se ofrecerá reprogramación.
                  </li>
                </ul>
              ) : (
                <p>Las condiciones aplicables se muestran en la agenda.</p>
              )}
            </section>
          </div>

          <div className="safety-card" role="note">
            <strong>Antes de compartir información</strong>
            <p>
              Proporciona sólo un motivo de consulta breve. No incluyas diagnósticos,
              medicamentos, antecedentes ni información de otras personas.
            </p>
            <p>{content.siteSettings.globalNotice}</p>
          </div>
        </div>
      </article>
      <JsonLd data={structuredData} />
    </PublicPageShell>
  );
}
