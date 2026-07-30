import { describe, expect, it } from "vitest";
import { contactSchema } from "../lib/contact/schema";

const validLead = {
  name: "Persona de prueba",
  email: "qa@example.test",
  phone: "+52 55 0000 0000",
  service: "servicio-uno",
  modality: "En línea",
  preferredSchedule: "Horario flexible",
  message: "Deseo conocer disponibilidad.",
  privacyAccepted: true,
  website: "",
  turnstileToken: "test-token",
};

describe("contactSchema", () => {
  it("acepta una solicitud sintética válida", () => {
    expect(contactSchema.safeParse(validLead).success).toBe(true);
  });

  it("rechaza campos inesperados", () => {
    expect(
      contactSchema.safeParse({ ...validLead, diagnosis: "dato sensible" })
        .success,
    ).toBe(false);
  });

  it("rechaza el honeypot lleno", () => {
    expect(
      contactSchema.safeParse({ ...validLead, website: "spam.example" })
        .success,
    ).toBe(false);
  });

  it("exige aceptación explícita del aviso", () => {
    expect(
      contactSchema.safeParse({ ...validLead, privacyAccepted: false }).success,
    ).toBe(false);
  });

  it("rechaza enlaces en campos de texto", () => {
    expect(
      contactSchema.safeParse({
        ...validLead,
        name: "https://spam.example",
      }).success,
    ).toBe(false);
  });
});
