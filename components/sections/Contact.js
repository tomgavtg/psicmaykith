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
            Demos el primer paso
          </h2>
          <p className="section-intro">
            Elige el servicio, la modalidad y el horario que prefieres. Recibirás una
            respuesta para revisar disponibilidad, resolver dudas y confirmar la cita.
            No necesitas explicar el motivo de consulta en este primer contacto.
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
              Envía un mensaje breve para solicitar una primera cita o preguntar por
              servicios y disponibilidad. La conversación inicial no te compromete a
              continuar un proceso.
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
              <p className="pending-contact">WhatsApp no disponible temporalmente.</p>
            )}
            {contactSettings.email ? (
              <TrackedLink
                className="button button-secondary contact-email-link"
                href={`mailto:${contactSettings.email}`}
                eventName="click_email"
                eventParameters={{ location: "contact" }}
              >
                Escribir por correo
              </TrackedLink>
            ) : null}
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
            <h3>Solicitud de cita</h3>
            <p>
              Indica una fecha y horario preferidos. Los datos se utilizan únicamente
              para responder; enviar el formulario no confirma la cita ni crea un
              expediente.
            </p>
            <ContactForm
              services={services}
              modalities={contactSettings.modalities || []}
              availableWeekdays={contactSettings.availableWeekdays || []}
              availableStartTimes={contactSettings.availableStartTimes || []}
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
