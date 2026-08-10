import Link from "next/link";
import { PublicPageShell } from "../../components/layout/PublicPageShell";
import { Breadcrumbs } from "../../components/seo/Breadcrumbs";
import { JsonLd } from "../../components/seo/JsonLd";
import { getSiteUrl } from "../../lib/config/site-url";
import { getFaqGroups, getFaqItems } from "../../lib/content/faq";
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
  const groups = getFaqGroups(questions);
  const structuredData = content.isPlaceholder
    ? null
    : buildFaqStructuredData({ questions, siteUrl: getSiteUrl() });

  return (
    <PublicPageShell content={content}>
      <article className="content-page">
        <div className="container content-container">
          <Breadcrumbs current="Preguntas frecuentes" />
          <header className="content-hero faq-hero">
            <div>
              <p className="section-kicker">Información antes de reservar</p>
              <h1>Preguntas frecuentes</h1>
              <p className="content-lead">{description}</p>
            </div>
            <aside className="faq-guide" aria-labelledby="faq-guide-title">
              <p className="section-kicker">Encuentra una respuesta</p>
              <h2 id="faq-guide-title">Consulta por tema</h2>
              <p>
                Elige una categoría y abre sólo las preguntas que te interesen.
              </p>
              <nav aria-label="Categorías de preguntas frecuentes">
                {groups.map((group) => (
                  <a key={group.id} href={`#${group.id}`}>
                    <span>{group.title}</span>
                    <small>{group.items.length}</small>
                  </a>
                ))}
              </nav>
            </aside>
          </header>

          <div className="faq-groups">
            {groups.map((group, groupIndex) => (
              <section
                key={group.id}
                id={group.id}
                className="faq-group"
                aria-labelledby={`${group.id}-title`}
              >
                <header className="faq-group-heading">
                  <span aria-hidden="true">{String(groupIndex + 1).padStart(2, "0")}</span>
                  <div>
                    <h2 id={`${group.id}-title`}>{group.title}</h2>
                    <p>{group.description}</p>
                  </div>
                </header>
                <div className="faq-list">
                  {group.items.map((item) => (
                    <details key={item.slug || item.question} className="faq-item">
                      <summary>{item.question}</summary>
                      <div className="faq-answer">
                        <p>{item.answer}</p>
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <aside className="faq-closing-card" aria-labelledby="faq-closing-title">
            <div>
              <p className="section-kicker">Siguiente paso</p>
              <h2 id="faq-closing-title">¿Quieres conversar sobre tu situación?</h2>
              <p>
                Puedes consultar horarios para agendar una sesión o solicitar
                información por WhatsApp antes de reservar.
              </p>
            </div>
            <div className="content-actions">
              <Link className="button button-primary" href="/#agendar">
                Agendar una cita
              </Link>
              <Link className="button button-secondary" href="/#whatsapp-contact">
                Contacto por WhatsApp
              </Link>
            </div>
          </aside>
        </div>
      </article>
      <JsonLd data={structuredData} />
    </PublicPageShell>
  );
}
