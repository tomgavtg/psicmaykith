import { describe, expect, it } from "vitest";
import { getFaqItems } from "../lib/content/faq";
import { fallbackContent } from "../lib/content/fallback";
import {
  buildFaqStructuredData,
  buildContentMetadata,
  buildProfileStructuredData,
  buildServiceStructuredData,
  PUBLIC_CONTENT_PATHS,
} from "../lib/seo/content-pages";

const siteUrl = "https://www.example.test";

function publishedContent() {
  return {
    ...fallbackContent,
    isPlaceholder: false,
    professionalProfile: {
      ...fallbackContent.professionalProfile,
      fullName: "Psic. Mayumi Kitahara",
      licenseNumber: "10630199",
    },
    contactSettings: {
      ...fallbackContent.contactSettings,
      serviceAreas: ["Ciudad de México", "Atención en línea"],
    },
    seoSettings: {
      ...fallbackContent.seoSettings,
      areaServed: ["Ciudad de México", "Atención en línea"],
      socialProfiles: [],
    },
  };
}

describe("SEO de páginas públicas", () => {
  it("mantiene previews fuera del índice y limita la descripción", () => {
    const previousMode = process.env.SITE_MODE;
    const previousApproval = process.env.CONTENT_APPROVED;
    process.env.SITE_MODE = "preview";
    process.env.CONTENT_APPROVED = "false";

    try {
      const metadata = buildContentMetadata({
        content: publishedContent(),
        siteUrl,
        path: "/sobre-mi",
        title: "Sobre Psic. Mayumi Kitahara",
        description: "Descripción profesional extensa ".repeat(12),
      });

      expect(metadata.robots).toEqual({ index: false, follow: false });
      expect(metadata.description.length).toBeLessThanOrEqual(160);
    } finally {
      if (previousMode === undefined) delete process.env.SITE_MODE;
      else process.env.SITE_MODE = previousMode;
      if (previousApproval === undefined) delete process.env.CONTENT_APPROVED;
      else process.env.CONTENT_APPROVED = previousApproval;
    }
  });

  it("incluye las rutas de perfil, modalidad, servicios y preguntas", () => {
    expect(PUBLIC_CONTENT_PATHS).toEqual([
      "/sobre-mi",
      "/psicoterapia-en-linea",
      "/terapia-para-adultos",
      "/terapia-para-adolescentes",
      "/terapia-de-pareja",
      "/preguntas-frecuentes",
    ]);
  });

  it("publica ProfilePage con nombre público y cédula, sin identidad legal", () => {
    const data = buildProfileStructuredData({
      content: publishedContent(),
      siteUrl,
    });
    const profilePage = data["@graph"].find(
      (item) => item["@type"] === "ProfilePage",
    );
    const person = data["@graph"].find((item) => item["@type"] === "Person");

    expect(profilePage.mainEntity["@id"]).toBe(`${siteUrl}/#professional`);
    expect(person.name).toBe("Psic. Mayumi Kitahara");
    expect(person.hasCredential.identifier).toBe("10630199");
    expect(JSON.stringify(data)).not.toContain("Marissa");
  });

  it("describe el servicio sin publicar honorarios", () => {
    const content = publishedContent();
    const service = content.services[0];
    const data = buildServiceStructuredData({ content, service, siteUrl });
    const serviceEntity = data["@graph"].find(
      (item) => item["@type"] === "Service",
    );

    expect(serviceEntity.name).toBe("Terapia para adultos");
    expect(serviceEntity.offers).toBeUndefined();
    expect(JSON.stringify(data)).not.toContain("750");
  });

  it("mantiene las respuestas visibles y el FAQ estructurado sincronizados", () => {
    const content = publishedContent();
    const questions = getFaqItems(content);
    const data = buildFaqStructuredData({ questions, siteUrl });
    const faq = data["@graph"].find((item) => item["@type"] === "FAQPage");

    expect(faq.mainEntity).toHaveLength(questions.length);
    expect(faq.mainEntity[0].name).toBe(questions[0].question);
    expect(faq.mainEntity[0].acceptedAnswer.text).toBe(questions[0].answer);
  });
});
