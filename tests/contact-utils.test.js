import { beforeEach, describe, expect, it } from "vitest";
import { buildLeadEmail, escapeHtml } from "../lib/contact/email";
import {
  clearRateLimitsForTests,
  consumeRateLimit,
} from "../lib/contact/rate-limit";
import { buildWhatsAppUrl } from "../lib/contact/whatsapp";

describe("buildWhatsAppUrl", () => {
  it("normaliza el número y codifica el mensaje", () => {
    expect(buildWhatsAppUrl("+52 55-1234-5678", "Hola, información")).toBe(
      "https://wa.me/525512345678?text=Hola%2C%20informaci%C3%B3n",
    );
  });

  it("no crea enlace cuando falta el número", () => {
    expect(buildWhatsAppUrl("", "Hola")).toBe("");
  });
});

describe("correo seguro", () => {
  it("escapa HTML", () => {
    expect(escapeHtml("<script>alert('x')</script>")).not.toContain("<script>");
  });

  it("no inserta HTML sin escapar en el mensaje", () => {
    const html = buildLeadEmail({
      name: "<b>Nombre</b>",
      email: "qa@example.test",
      phone: "",
      service: "servicio-uno",
      modality: "En línea",
      preferredSchedule: "Horario flexible",
      message: "<img src=x onerror=alert(1)>",
    });

    expect(html).toContain("&lt;b&gt;Nombre&lt;/b&gt;");
    expect(html).not.toContain("<img src=x");
  });
});

describe("rate limit efímero", () => {
  beforeEach(() => clearRateLimitsForTests());

  it("permite cinco intentos y rechaza el sexto", () => {
    for (let index = 0; index < 5; index += 1) {
      expect(consumeRateLimit("test-ip", 1_000).allowed).toBe(true);
    }
    expect(consumeRateLimit("test-ip", 1_000).allowed).toBe(false);
  });

  it("reinicia la ventana al vencer", () => {
    consumeRateLimit("test-ip", 1_000);
    expect(consumeRateLimit("test-ip", 601_001).allowed).toBe(true);
  });
});
