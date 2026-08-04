import Link from "next/link";
import { PortableText } from "next-sanity";
import { getSiteContent } from "../../lib/content/get-site-content";

export const metadata = {
  title: "Aviso de privacidad",
  description:
    "Información sobre el tratamiento de datos personales enviados por los medios de contacto.",
};

export default async function PrivacyNoticePage() {
  const { privacyNotice, isPlaceholder } = await getSiteContent();

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

        {isPlaceholder || privacyNotice.status !== "approved" ? (
          <div className="legal-draft" role="alert">
            <strong>Borrador sujeto a revisión legal en México.</strong>
            <p>
              Esta página todavía no constituye el aviso de privacidad definitivo y no
              debe publicarse como versión legal aprobada.
            </p>
          </div>
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
      </div>
    </main>
  );
}
