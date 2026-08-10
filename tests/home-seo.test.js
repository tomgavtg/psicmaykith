import { describe, expect, it } from "vitest";
import {
  buildHomeStructuredData,
  getSocialImage,
} from "../lib/seo/home-seo";

const siteUrl = "https://www.example.test";

function contentFixture() {
  return {
    siteSettings: {
      headerName: "Psic. Mayumi Kitahara",
    },
    professionalProfile: {
      fullName: "Psic. Mayumi Kitahara",
      licenseNumber: "10630199",
      portrait: {
        url: "https://cdn.example.test/portrait.jpg",
        alt: "Retrato profesional de Psic. Mayumi Kitahara",
      },
    },
    services: [
      {
        name: "Terapia para adultos",
        shortDescription: "Sesiones de psicoterapia en línea.",
        bookingUrl: "https://calendar.app.google/example",
      },
    ],
    contactSettings: {
      email: "contacto@example.test",
      phoneDisplay: "+52 55 0000 0000",
      serviceAreas: ["Ciudad de México", "Atención en línea"],
    },
    seoSettings: {
      metaTitle: "Psicoterapia en línea en CDMX | Psic. Mayumi Kitahara",
      metaDescription:
        "Psicoterapia psicoanalítica en línea para adolescentes, adultos y parejas en CDMX.",
      areaServed: ["Ciudad de México", "Atención en línea"],
      socialProfiles: [],
    },
  };
}

describe("SEO de la portada", () => {
  it("usa la tarjeta social horizontal cuando la imagen de Sanity es vertical", () => {
    const image = getSocialImage({
      siteUrl,
      professionalName: "Psic. Mayumi Kitahara",
      seoSettings: {
        ogImage: {
          url: "https://cdn.example.test/portrait.jpg",
          dimensions: { width: 960, height: 1280, aspectRatio: 0.75 },
        },
      },
    });

    expect(image).toEqual({
      url: `${siteUrl}/opengraph-image`,
      width: 1200,
      height: 630,
      alt: "Psic. Mayumi Kitahara, psicoterapia en línea para CDMX",
    });
  });

  it("conserva una imagen horizontal aprobada desde Sanity", () => {
    const image = getSocialImage({
      siteUrl,
      professionalName: "Psic. Mayumi Kitahara",
      seoSettings: {
        ogImage: {
          url: "https://cdn.example.test/social.jpg",
          alt: "Presentación profesional",
          dimensions: { width: 1200, height: 630, aspectRatio: 1.9 },
        },
      },
    });

    expect(image.url).toBe("https://cdn.example.test/social.jpg");
    expect(image.width).toBe(1200);
    expect(image.height).toBe(630);
  });

  it("describe la práctica en línea sin inventar una ubicación física", () => {
    const data = buildHomeStructuredData({
      content: contentFixture(),
      siteUrl,
    });
    const organization = data["@graph"].find(
      (item) => item["@id"] === `${siteUrl}/#organization`,
    );
    const professional = data["@graph"].find(
      (item) => item["@id"] === `${siteUrl}/#professional`,
    );

    expect(organization["@type"]).toBe("Organization");
    expect(organization.address).toBeUndefined();
    expect(organization.name).toBe("Psic. Mayumi Kitahara");
    expect(professional.name).toBe("Psic. Mayumi Kitahara");
    expect(professional.hasCredential.identifier).toBe("10630199");
    expect(JSON.stringify(data)).not.toContain("Marissa");
  });
});
