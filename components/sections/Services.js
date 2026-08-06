"use client";

import Image from "next/image";
import { ArrowIcon } from "../icons";
import { APPOINTMENT_SERVICE_EVENT } from "../../lib/contact/appointment";
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
  function selectService(serviceSlug) {
    const heading = document.querySelector("#agendar-title");

    window.dispatchEvent(
      new CustomEvent(APPOINTMENT_SERVICE_EVENT, {
        detail: { serviceSlug },
      }),
    );

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    document
      .querySelector("#agendar")
      ?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
    window.setTimeout(() => heading?.focus(), reducedMotion ? 0 : 350);
  }

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
            No necesitas tener todo claro para comenzar. Revisa las opciones propuestas
            y solicita información compartiendo sólo lo necesario. La disponibilidad
            se consulta en la agenda o se confirma personalmente.
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
                {service.fee?.amount ? (
                  <p className="service-detail">
                    {new Intl.NumberFormat("es-MX", {
                      style: "currency",
                      currency: service.fee.currency || "MXN",
                      maximumFractionDigits: 0,
                    }).format(service.fee.amount)}
                    {service.fee.note ? ` · ${service.fee.note}` : ""}
                  </p>
                ) : null}
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
                    eventParameters={{
                      location: "services",
                      service: service.slug,
                    }}
                    aria-label={`Consultar horarios y reservar ${service.name} en Google Calendar`}
                  >
                    Consultar horarios y reservar
                    <ArrowIcon />
                  </TrackedLink>
                ) : (
                  <button
                    type="button"
                    className="service-link"
                    onClick={() => selectService(service.slug)}
                    aria-label={`Solicitar información sobre ${service.name}`}
                  >
                    Solicitar información sobre este servicio
                    <ArrowIcon />
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
