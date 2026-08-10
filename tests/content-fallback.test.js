import { describe, expect, it } from "vitest";
import { fallbackContent } from "../lib/content/fallback";

describe("contenido editorial de respaldo", () => {
  it("conserva el contenido propuesto en modo demostración", () => {
    expect(fallbackContent.isPlaceholder).toBe(true);
  });

  it("respeta los límites editoriales del perfil", () => {
    const {
      headline,
      heroTitle,
      shortBio,
      professionalLabel,
      validationItems,
      portrait,
    } =
      fallbackContent.professionalProfile;

    expect(headline).toBe(
      "Psicoterapia psicoanalítica | Orientación psicológica profunda",
    );
    expect(heroTitle).toBe(
      "Especialista en terapia psicoanalítica y orientación psicológica en situaciones de transformación de vida. Sesiones en línea.",
    );
    expect(headline.length).toBeLessThanOrEqual(120);
    expect(heroTitle.length).toBeLessThanOrEqual(160);
    expect(shortBio.trim().split(/\s+/).length).toBeLessThanOrEqual(55);
    expect(professionalLabel).toBe("Atención profesional");
    expect(validationItems.length).toBeGreaterThanOrEqual(3);
    expect(validationItems.length).toBeLessThanOrEqual(5);
    expect(portrait.url).toBe("/images/psychologist/PhotoMK1.jpeg");
    expect(portrait.alt.length).toBeGreaterThan(0);
  });

  it("incluye tres servicios con descripciones válidas", () => {
    expect(fallbackContent.services).toHaveLength(3);

    for (const service of fallbackContent.services) {
      expect(service.slug).toMatch(/^[a-z0-9-]{2,80}$/);
      expect(service.shortDescription.length).toBeGreaterThanOrEqual(40);
      expect(service.shortDescription.length).toBeLessThanOrEqual(280);
      expect(service.modality).toEqual(["En línea"]);
    }

    expect(fallbackContent.services.map((service) => service.durationMinutes)).toEqual([
      50,
      50,
      70,
    ]);
  });

  it("respeta la longitud de metadatos SEO", () => {
    const { metaTitle, metaDescription } = fallbackContent.seoSettings;

    expect(metaTitle.length).toBeGreaterThanOrEqual(20);
    expect(metaTitle.length).toBeLessThanOrEqual(65);
    expect(metaDescription.length).toBeGreaterThanOrEqual(80);
    expect(metaDescription.length).toBeLessThanOrEqual(165);
  });
});
