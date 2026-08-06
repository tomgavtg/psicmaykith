import Image from "next/image";
import { ArrowIcon } from "../icons";
import { TrackedLink } from "../analytics/TrackedLink";

function formatDuration(minutes) {
  if (!minutes) return "";
  if (minutes < 60) return `${minutes} min`;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes
    ? `${hours} h ${remainingMinutes} min`
    : `${hours} h`;
}

export function Services({ services }) {
  return (
    <section
      id="servicios"
      className="section services-section"
      aria-labelledby="services-title"
    >
      <div className="container">
        <div className="section-heading-row">
          <div>
            <p className="section-kicker">Servicios</p>
            <h2 id="services-title" className="section-title">
              Un espacio para cada momento del proceso
            </h2>
          </div>
          <p className="section-intro">
            No necesitas tener todo claro para comenzar. Elige el tipo de sesión para
            consultar la agenda en línea. La duración aparece aquí y el precio se
            muestra antes de completar la reserva.
          </p>
        </div>

        <div className="services-grid">
          {services.map((service, index) => (
            <article className="service-card" key={service._id || service.slug}>
              {service.image?.url ? (
                <div className="service-image">
                  <Image
                    src={service.image.url}
                    alt={service.image.alt || ""}
                    fill
                    sizes="(max-width: 767px) 100vw, 33vw"
                  />
                </div>
              ) : (
                <div className={`service-visual service-visual-${index + 1}`}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </div>
              )}
              <div className="service-card-body">
                <p className="service-meta">
                  {(service.modality || []).join(" · ")}
                  {service.durationMinutes
                    ? ` · ${formatDuration(service.durationMinutes)}`
                    : ""}
                </p>
                <h3>{service.name}</h3>
                <p>{service.shortDescription}</p>
                {service.availabilityNote ? (
                  <p className="service-detail">{service.availabilityNote}</p>
                ) : null}
                {service.bookingUrl ? (
                  <TrackedLink
                    className="service-link"
                    href={service.bookingUrl}
                    target="_blank"
                    rel="noreferrer"
                    eventName="click_booking"
                    eventParameters={{ location: "services" }}
                    aria-label={`Reservar ${service.name} en Google Calendar`}
                  >
                    Reservar y pagar
                    <ArrowIcon />
                  </TrackedLink>
                ) : (
                  <a
                    className="service-link"
                    href="#whatsapp-contact"
                    aria-label={`Solicitar información sobre ${service.name}`}
                  >
                    Consultar por WhatsApp
                    <ArrowIcon />
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
