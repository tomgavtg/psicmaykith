import { describe, expect, it } from "vitest";
import { DEFAULT_SITE_URL, getSiteUrl } from "../lib/config/site-url";

describe("getSiteUrl", () => {
  it("conserva un origen HTTPS válido", () => {
    expect(getSiteUrl("https://example.test")).toBe("https://example.test");
    expect(getSiteUrl("https://localhost:3000")).toBe(
      "https://localhost:3000",
    );
  });

  it("elimina rutas y diagonales del origen configurado", () => {
    expect(getSiteUrl("https://example.test/ruta/")).toBe(
      "https://example.test",
    );
  });

  it("usa HTTPS local ante placeholders o protocolos inseguros", () => {
    expect(getSiteUrl("https://www.[DOMINIO].com")).toBe(DEFAULT_SITE_URL);
    expect(getSiteUrl("http://example.test")).toBe(DEFAULT_SITE_URL);
    expect(getSiteUrl("javascript:alert(1)")).toBe(DEFAULT_SITE_URL);
  });
});
