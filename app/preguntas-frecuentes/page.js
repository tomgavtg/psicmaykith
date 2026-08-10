import Link from "next/link";
import { PublicPageShell } from "../../components/layout/PublicPageShell";
import { Breadcrumbs } from "../../components/seo/Breadcrumbs";
import { JsonLd } from "../../components/seo/JsonLd";
import { getSiteUrl } from "../../lib/config/site-url";
import { getFaqItems } from "../../lib/content/faq";
import { getSiteContent } from "../../lib/content/get-site-content";
import {
  buildContentMetadata,
  buildFaqStructuredData,
} from "../../lib/seo/content-pages";

const description =
  "Respuestas sobre modalidad, duración, reserva, pago, cancelación y contacto para las sesiones en línea con Psic. Mayumi Kitahara.";

export async function generateMetadata() {
  const content = await getSiteContent();
  return buildContentMetadata({
    content,
    siteUrl: getSiteUrl(),
    path: "/preguntas-frecuentes",
    title: "Preguntas frecuentes sobre psicoterapia en línea",
    description,
  });
}

export default async function FaqPage() {
  const content = await getSiteContent();
  const questions = getFaqItems(content);
  const structuredData = content.isPlaceholder
    ? null
    : buildFaqStructuredData({ questions, siteUrl: getSiteUrl() });

  return (
    <PublicPageShell content={content}>
      <article className="content-page">
        <div className="container content-container content-container-narrow">
          <Breadcrumbs current="Preguntas frecuentes" />
          <header className="content-hero">
            <div>
              <p className="section-kicker">Información antes de reservar</p>
              <h1>Preguntas frecuentes</h1>
              <p className="content-lead">{description}</p>
            </div>
          </header>

          <div className="faq-list">
            {questions.map((item) => (
              <details key={item.question} className="faq-item">
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>

          <div className="content-actions">
            <Link className="button button-primary" href="/#agendar">
              Reservar una cita
            </Link>
            <Link className="button button-secondary" href="/#whatsapp-contact">
              Contactar por WhatsApp
            </Link>
          </div>
        </div>
      </article>
      <JsonLd data={structuredData} />
    </PublicPageShell>
  );
}
