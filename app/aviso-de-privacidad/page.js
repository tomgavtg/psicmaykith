import Link from "next/link";
import { PortableText } from "next-sanity";
import { getSiteContent } from "../../lib/content/get-site-content";
import { getSiteUrl } from "../../lib/config/site-url";
import {
  isPrivacyNoticePublishable,
  isProductionLaunchEnabled,
} from "../../lib/content/publication";

export async function generateMetadata() {
  const { privacyNotice } = await getSiteContent();
  const isPublishable =
    isProductionLaunchEnabled() &&
    isPrivacyNoticePublishable(privacyNotice);

  return {
    title: "Aviso de privacidad",
    description:
      "Información sobre el tratamiento de datos personales enviados por los medios de contacto.",
    alternates: {
      canonical: `${getSiteUrl()}/aviso-de-privacidad`,
    },
    robots: isPublishable
      ? { index: true, follow: true }
      : { index: false, follow: false },
  };
}

export default async function PrivacyNoticePage() {
  const { privacyNotice } = await getSiteContent();
  const isPublishable = isPrivacyNoticePublishable(privacyNotice);

  return (
    <main className="legal-page">
      <div className="legal-container">
        <Link className="back-link" href="/">
          ← Volver al sitio
        </Link>
        <p className="section-kicker">Privacidad</p>
        <h1>{privacyNotice.title}</h1>
        <p className="legal-version">
          {privacyNotice.versionLabel || "Sin versión aprobada"}
          {privacyNotice.effectiveDate
            ? ` · Vigente desde ${privacyNotice.effectiveDate}`
            : ""}
        </p>

        {!isPublishable ? (
          <div className="legal-draft" role="alert">
            <strong>Borrador sujeto a revisión legal en México.</strong>
            <p>
              Esta página todavía no constituye el aviso de privacidad definitivo y no
              debe publicarse como versión legal aprobada.
            </p>
          </div>
        ) : null}

        {privacyNotice.controllerIdentity ? (
          <section className="legal-contact" aria-labelledby="controller-title">
            <h2 id="controller-title">Responsable del tratamiento</h2>
            <p>{privacyNotice.controllerIdentity}</p>
            {privacyNotice.controllerAddress ? (
              <p>Domicilio: {privacyNotice.controllerAddress}</p>
            ) : null}
          </section>
        ) : null}

        {privacyNotice.content ? (
          <article className="portable-text">
            <PortableText value={privacyNotice.content} />
          </article>
        ) : (
          <article className="portable-text">
            {privacyNotice.controllerIdentity ? (
              <>
                <h2>Responsable</h2>
                <p>{privacyNotice.controllerIdentity}</p>
              </>
            ) : null}
            <h2>Información pendiente</h2>
            <p>
              Falta documentar las finalidades, datos tratados, fundamento, medios para
              ejercer derechos, transferencias, plazos de conservación, cookies,
              medidas de seguridad y datos de contacto de la persona responsable.
            </p>
            <h2>Uso del formulario</h2>
            <p>
              El formulario está diseñado para solicitar información y disponibilidad.
              No debe utilizarse para compartir diagnósticos, síntomas, historial
              clínico ni otros datos sensibles.
            </p>
          </article>
        )}

        <section className="legal-contact" aria-labelledby="arco-contact-title">
          <h2 id="arco-contact-title">Canales para derechos ARCO</h2>
          <p>
            Para solicitar acceso, rectificación, cancelación u oposición, así como
            revocar el consentimiento o limitar el uso de datos, puedes utilizar:
          </p>
          <ul>
            {privacyNotice.contactEmail ? (
              <li>
                Correo: {" "}
                <a href={`mailto:${privacyNotice.contactEmail}`}>
                  {privacyNotice.contactEmail}
                </a>
              </li>
            ) : null}
            {privacyNotice.contactWhatsapp ? (
              <li>
                WhatsApp: {" "}
                <a
                  href={`https://wa.me/${privacyNotice.contactWhatsapp}`}
                  rel="noreferrer"
                  target="_blank"
                >
                  +52 56 3955 1234
                </a>
              </li>
            ) : null}
          </ul>
          <p>
            Estos canales no brindan atención de emergencia ni sustituyen los
            procedimientos clínicos correspondientes.
          </p>
        </section>
      </div>
    </main>
  );
}
