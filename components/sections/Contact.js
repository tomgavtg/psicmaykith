import { TrackedLink } from "../analytics/TrackedLink";
import { WhatsAppInquiryForm } from "../contact/WhatsAppInquiryForm";
import { ArrowIcon, WhatsAppIcon } from "../icons";

function formatDuration(minutes) {
  if (!minutes) return "";
  if (minutes < 60) return `${minutes} min`;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes
    ? `${hours} h ${remainingMinutes} min`
    : `${hours} h`;
}

export function Contact({ contactSettings, services, crisisNotice }) {
  const bookingServices = services.filter((service) => service.bookingUrl);
  const bookingPolicy = contactSettings.bookingPolicy;
  const hasWhatsApp = Boolean(contactSettings.whatsappNumber);

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
            Reserva tu sesión en línea
          </h2>
          <p className="section-intro">
            Consulta los horarios disponibles, completa tus datos y realiza el pago
            para confirmar tu cita. Si antes necesitas orientación, puedes enviar tu
            nombre, el servicio de interés y un motivo de consulta breve por WhatsApp.
          </p>
        </div>

        <div className="contact-grid">
          <div className="form-panel booking-panel">
            <p className="section-kicker">Reserva y pago</p>
            <h3>Elige tu tipo de sesión</h3>
            <p>
              La agenda de Google muestra disponibilidad en tiempo real. El precio se
              presenta dentro del flujo de reserva y el espacio se confirma únicamente
              después de completar el pago.
            </p>

            {bookingServices.length ? (
              <div className="booking-actions">
                {bookingServices.map((service) => (
                  <TrackedLink
                    className="booking-action"
                    href={service.bookingUrl}
                    target="_blank"
                    rel="noreferrer"
                    eventName="click_booking"
                    eventParameters={{ location: "booking_panel" }}
                    key={service._id || service.slug}
                    aria-label={`Ver horarios y reservar ${service.name} en Google Calendar`}
                  >
                    <span>
                      <strong>{service.name}</strong>
                      <small>
                        En línea
                        {service.durationMinutes
                          ? ` · ${formatDuration(service.durationMinutes)}`
                          : ""}
                      </small>
                    </span>
                    <ArrowIcon />
                  </TrackedLink>
                ))}
              </div>
            ) : (
              <p className="pending-contact">
                La agenda en línea no está disponible temporalmente.
              </p>
            )}

            <p className="privacy-reminder">
              Antes del pago, la agenda debe solicitar nombre, correo, teléfono, tipo
              de sesión, motivo de consulta y aceptación del Aviso de Privacidad.
            </p>

            {bookingServices.length && bookingPolicy ? (
              <div className="booking-policy" role="note">
                <h4>Reserva y cancelación</h4>
                <ul>
                  <li>
                    Cancelación sin penalización hasta{" "}
                    {bookingPolicy.cancellationWindowHours} horas antes de la sesión.
                  </li>
                  <li>
                    {bookingPolicy.clientReschedulingAllowed
                      ? "Se permiten reprogramaciones conforme a la disponibilidad de la agenda."
                      : "No se permiten reprogramaciones solicitadas por la persona usuaria."}
                  </li>
                  <li>
                    Cancelación tardía:{" "}
                    {bookingPolicy.lateCancellationPolicy.toLowerCase()}.
                  </li>
                  <li>
                    Inasistencia: {bookingPolicy.noShowPolicy.toLowerCase()}.
                  </li>
                  <li>
                    Cancelación por parte de la psicóloga:{" "}
                    {bookingPolicy.providerCancellationPolicy.toLowerCase()}.
                  </li>
                </ul>
              </div>
            ) : null}
          </div>

          <aside
            id="whatsapp-contact"
            className="whatsapp-panel"
            aria-labelledby="whatsapp-title"
          >
            <div className="whatsapp-icon-wrap">
              <WhatsAppIcon />
            </div>
            <p className="section-kicker">Alternativa de contacto</p>
            <h3 id="whatsapp-title">Contactar por WhatsApp</h3>
            <p>
              Completa estos datos para preparar el mensaje. Podrás revisarlo antes de
              enviarlo desde WhatsApp; completar este paso no reserva una cita ni
              realiza un cobro.
            </p>

            {hasWhatsApp ? (
              <WhatsAppInquiryForm
                whatsappNumber={contactSettings.whatsappNumber}
                services={services}
              />
            ) : (
              <p className="pending-contact">
                WhatsApp no está disponible temporalmente.
              </p>
            )}

            {contactSettings.responseTimeCopy ? (
              <p className="response-time">
                Tiempo de respuesta: {contactSettings.responseTimeCopy}
              </p>
            ) : null}
          </aside>
        </div>

        <div className="crisis-note" role="note">
          <strong>Atención en situaciones de emergencia</strong>
          <p>{crisisNotice}</p>
        </div>
      </div>
    </section>
  );
}
