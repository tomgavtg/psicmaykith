import { WhatsAppIcon } from "../icons";
import { buildWhatsAppUrl } from "../../lib/contact/whatsapp";
import { ContactForm } from "../contact/ContactForm";
import { TrackedLink } from "../analytics/TrackedLink";

export function Contact({
  contactSettings,
  services,
  crisisNotice,
}) {
  const whatsappUrl = buildWhatsAppUrl(
    contactSettings.whatsappNumber,
    contactSettings.whatsappMessage,
  );

  return (
    <section
      id="agendar"
      className="section contact-section"
      aria-labelledby="agendar-title"
    >
      <div className="container">
        <div className="contact-heading">
          <p className="section-kicker">Agendar</p>
          <h2 id="agendar-title" className="section-title" tabIndex={-1}>
            Elige la forma más cómoda de iniciar
          </h2>
          <p className="section-intro">
            Solicita información sobre disponibilidad por WhatsApp o mediante el
            formulario. No necesitas explicar el motivo de consulta en este primer
            contacto.
          </p>
        </div>

        <div className="contact-grid">
          <aside className="whatsapp-panel" aria-labelledby="whatsapp-title">
            <div className="whatsapp-icon-wrap">
              <WhatsAppIcon />
            </div>
            <p className="section-kicker">Ruta directa</p>
            <h3 id="whatsapp-title">WhatsApp Business</h3>
            <p>
              Envía un mensaje breve para preguntar por servicios, modalidades y
              disponibilidad.
            </p>
            {whatsappUrl ? (
              <TrackedLink
                className="button button-primary"
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                eventName="click_whatsapp"
                eventParameters={{ location: "contact" }}
              >
                <WhatsAppIcon />
                Abrir WhatsApp
              </TrackedLink>
            ) : (
              <p className="pending-contact">
                [POR DEFINIR: número de WhatsApp Business]
              </p>
            )}
            <p className="privacy-reminder">
              Por tu privacidad, evita compartir información clínica o sensible por
              este medio.
            </p>
            {contactSettings.responseTimeCopy ? (
              <p className="response-time">
                Tiempo de respuesta: {contactSettings.responseTimeCopy}
              </p>
            ) : null}
          </aside>

          <div className="form-panel">
            <h3>Formulario de contacto</h3>
            <p>
              Los datos se utilizan únicamente para responder tu solicitud. El sitio
              no crea un expediente ni almacena leads en una base de datos.
            </p>
            <ContactForm
              services={services}
              modalities={contactSettings.modalities || []}
              scheduleOptions={contactSettings.preferredScheduleOptions || []}
              successMessage={contactSettings.successMessage}
              errorMessage={contactSettings.errorMessage}
              hasWhatsApp={Boolean(whatsappUrl)}
            />
          </div>
        </div>

        <div className="crisis-note" role="note">
          <strong>Atención en situaciones de emergencia</strong>
          <p>{crisisNotice}</p>
        </div>
      </div>
    </section>
  );
}
