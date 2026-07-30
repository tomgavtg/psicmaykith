"use client";

import Image from "next/image";
import { ArrowIcon } from "../icons";

export function Services({ services }) {
  function selectService(serviceSlug) {
    const select = document.querySelector("#service");
    const heading = document.querySelector("#agendar-title");

    if (select) {
      select.value = serviceSlug;
      select.dispatchEvent(new Event("change", { bubbles: true }));
    }

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
              Opciones de atención, explicadas con claridad
            </h2>
          </div>
          <p className="section-intro">
            Revisa las modalidades disponibles y solicita información. El primer
            mensaje no confirma una cita ni requiere que compartas información clínica.
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
                    ? ` · ${service.durationMinutes} min`
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
                <button
                  type="button"
                  className="service-link"
                  onClick={() => selectService(service.slug)}
                  aria-label={`Solicitar información sobre ${service.name}`}
                >
                  Solicitar información
                  <ArrowIcon />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
