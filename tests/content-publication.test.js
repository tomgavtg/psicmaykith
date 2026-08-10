import { describe, expect, it } from "vitest";
import {
  getPublicationIssues,
  isPrivacyNoticePublishable,
} from "../lib/content/publication";

function publishableContent() {
  return {
    siteSettings: {
      siteName: "Psicoterapia",
      headerName: "Psic. Mayumi Kitahara",
      globalNotice: "Este espacio no sustituye atención de emergencia.",
      crisisNotice:
        "Si existe una situación de riesgo inmediato, contacta a los servicios de emergencia correspondientes.",
    },
    professionalProfile: {
      fullName: "Psic. Mayumi Kitahara",
      heroTitle: "Psicoterapia psicoanalítica con atención profesional",
      shortBio:
        "Información profesional suficiente para describir el servicio sin realizar promesas de resultados.",
      approach:
        "El enfoque se presenta con información suficiente, respetuosa y comprensible para quien visita el sitio.",
      licenseNumber: "1234567",
      portrait: {
        url: "https://cdn.example.test/image.jpg",
        alt: "Retrato profesional de Psic. Mayumi Kitahara",
      },
      validationItems: ["Uno", "Dos", "Tres"],
      education: [{ degree: "Licenciatura", institution: "Institución" }],
    },
    services: [
      {
        slug: "terapia-para-adultos",
        modality: ["En línea"],
        fee: { amount: 750, currency: "MXN" },
        bookingUrl: "https://calendar.app.google/individual",
      },
      {
        slug: "terapia-para-adolescentes",
        modality: ["En línea"],
        fee: { amount: 750, currency: "MXN" },
        bookingUrl: "https://calendar.app.google/individual",
      },
      {
        slug: "terapia-de-pareja",
        modality: ["En línea"],
        fee: { amount: 1200, currency: "MXN" },
        bookingUrl: "https://calendar.app.google/couple",
      },
    ],
    contactSettings: {
      email: "contacto@example.test",
      whatsappNumber: "525500000000",
      modalities: ["En línea"],
    },
    seoSettings: {
      metaTitle: "Psicoterapia profesional en línea y presencial",
      metaDescription:
        "Información clara y suficiente acerca de servicios profesionales de psicoterapia y medios para solicitar disponibilidad de una primera cita.",
      businessType: "Organization",
    },
    privacyNotice: {
      status: "approved",
      controllerIdentity: "Nombre legal completo",
      controllerAddress: "Domicilio profesional completo y aprobado",
      contactEmail: "privacidad@example.test",
      contactWhatsapp: "525500000000",
      versionLabel: "1.1",
      effectiveDate: "2026-08-04",
      content: [{}, {}, {}],
    },
  };
}

describe("gate de publicación", () => {
  it("acepta contenido completo", () => {
    expect(getPublicationIssues(publishableContent())).toEqual([]);
  });

  it("bloquea una abreviatura como identidad legal", () => {
    const content = publishableContent();
    content.privacyNotice.controllerIdentity = "Mk";

    expect(getPublicationIssues(content)).toContain(
      "privacy-controller-incomplete",
    );
    expect(isPrivacyNoticePublishable(content.privacyNotice)).toBe(false);
  });

  it("bloquea el aviso v1.0 porque no cubre motivo de consulta, agenda y pago", () => {
    const content = publishableContent();
    content.privacyNotice.versionLabel = "1.0";

    expect(getPublicationIssues(content)).toContain(
      "privacy-notice-version-outdated",
    );
  });

  it("bloquea servicios con slugs no canónicos", () => {
    const content = publishableContent();
    content.services[1].slug = "2";

    expect(getPublicationIssues(content)).toContain(
      "required-services-incomplete",
    );
  });

  it("bloquea una oferta sin honorarios confirmados o con modalidad presencial", () => {
    const content = publishableContent();
    content.services[0].fee = null;
    content.services[1].modality = ["Presencial"];

    expect(getPublicationIssues(content)).toContain("service-offer-incomplete");
  });

  it("bloquea un servicio sin enlace público de Google Calendar", () => {
    const content = publishableContent();
    content.services[2].bookingUrl = null;

    expect(getPublicationIssues(content)).toContain(
      "service-booking-incomplete",
    );
  });
});
