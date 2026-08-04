import { describe, expect, it } from "vitest";
import { getSafeAttribution } from "../lib/analytics/attribution";

describe("atribución segura", () => {
  it("conserva únicamente UTMs saneadas", () => {
    const result = getSafeAttribution(
      "https://example.test/?utm_source=google&utm_medium=cpc&utm_campaign=consulta_mx&utm_content=anuncio_1&utm_term=ansiedad",
      "https://www.google.com/search?q=privado",
    );

    expect(result).toEqual({
      referrer_class: "google",
      utm_source: "google",
      utm_medium: "cpc",
      utm_campaign: "consulta_mx",
      utm_content: "anuncio_1",
    });
    expect(result).not.toHaveProperty("utm_term");
  });

  it("descarta fuentes y valores libres no aprobados", () => {
    const result = getSafeAttribution(
      "https://example.test/?utm_source=correo%40example.com&utm_medium=unknown&utm_campaign=texto%20libre",
    );

    expect(result).toEqual({ referrer_class: "direct" });
  });
});
