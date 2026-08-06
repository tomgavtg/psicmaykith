import { beforeEach, describe, expect, it } from "vitest";
import { buildLeadEmail, escapeHtml } from "../lib/contact/email";
import {
  formatSchedulePreference,
  formatTimeRange,
  formatPreferredDate,
  getServiceDurationMinutes,
  getTodayInMexico,
  isCurrentOrFuturePreferredDate,
  isValidPreferredDate,
} from "../lib/contact/appointment";
import {
  clearRateLimitsForTests,
  consumeRateLimit,
} from "../lib/contact/rate-limit";
import {
  buildWhatsAppUrl,
  normalizeWhatsAppNumber,
} from "../lib/contact/whatsapp";

describe("buildWhatsAppUrl", () => {
  it("normaliza el número y codifica el mensaje", () => {
    expect(buildWhatsAppUrl("+52 55-1234-5678", "Hola, información")).toBe(
      "https://wa.me/525512345678?text=Hola%2C%20informaci%C3%B3n",
    );
  });

  it("elimina el antiguo prefijo móvil 1 de México", () => {
    expect(normalizeWhatsAppNumber("+52 1 56 3955 1234")).toBe(
      "525639551234",
    );
    expect(buildWhatsAppUrl("+52 1 56 3955 1234", "Hola")).toBe(
      "https://wa.me/525639551234?text=Hola",
    );
  });

  it("no crea enlace cuando falta el número", () => {
    expect(buildWhatsAppUrl("", "Hola")).toBe("");
  });

  it("rechaza números demasiado cortos y omite text cuando falta mensaje", () => {
    expect(buildWhatsAppUrl("12345", "Hola")).toBe("");
    expect(buildWhatsAppUrl("525512345678", "")).toBe(
      "https://wa.me/525512345678",
    );
  });
});

describe("preferencia de fecha", () => {
  it("valida fechas reales y evita fechas anteriores en México", () => {
    const now = new Date("2026-08-02T03:00:00.000Z");

    expect(getTodayInMexico(now)).toBe("2026-08-01");
    expect(isValidPreferredDate("2026-02-29")).toBe(false);
    expect(isValidPreferredDate("2028-02-29")).toBe(true);
    expect(isCurrentOrFuturePreferredDate("2026-08-01", now)).toBe(true);
    expect(isCurrentOrFuturePreferredDate("2026-07-31", now)).toBe(false);
  });

  it("presenta la fecha sin cambiarla de día", () => {
    expect(formatPreferredDate("2026-08-15")).toContain("15");
    expect(formatPreferredDate("")).toBe("Sin fecha específica");
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
      schedulePreferences: [
        { day: "Lunes", startTime: "17:00" },
        { day: "Martes", startTime: "16:00" },
        { day: "Viernes", startTime: "11:00" },
      ],
      message: "<img src=x onerror=alert(1)>",
      sensitiveDataAccepted: true,
    });

    expect(html).toContain("&lt;b&gt;Nombre&lt;/b&gt;");
    expect(html).toContain("Lunes, 5:00–5:50 p. m.");
    expect(html).not.toContain("<img src=x");
  });
});

describe("horarios de preferencia", () => {
  it("calcula la hora final según la duración del servicio", () => {
    expect(formatTimeRange("17:00", 50)).toBe("5:00–5:50 p. m.");
    expect(formatTimeRange("16:00", 70)).toBe("4:00–5:10 p. m.");
    expect(getServiceDurationMinutes("terapia-de-pareja")).toBe(70);
  });

  it("presenta el día y el rango completo", () => {
    expect(
      formatSchedulePreference(
        { day: "Viernes", startTime: "11:30" },
        70,
      ),
    ).toBe("Viernes, 11:30 a. m.–12:40 p. m.");
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
