import { z } from "zod";
import { isValidStartTime } from "./appointment";

const safeText = (minimum, maximum) =>
  z
    .string()
    .trim()
    .min(minimum)
    .max(maximum)
    .refine((value) => !/https?:\/\/|www\./i.test(value), {
      message: "No incluyas enlaces.",
    });

const schedulePreferenceSchema = z
  .object({
    day: safeText(2, 20),
    startTime: z.string().refine(isValidStartTime, "Horario inválido."),
  })
  .strict();

export const contactSchema = z
  .object({
    name: safeText(2, 80),
    email: z.string().trim().email().max(160),
    phone: z
      .string()
      .trim()
      .max(25)
      .refine(
        (value) => value === "" || /^[+()\d\s.-]{7,25}$/.test(value),
        "Teléfono inválido.",
      ),
    service: z.string().trim().regex(/^[a-z0-9-]{2,80}$/),
    modality: z.literal("En línea"),
    schedulePreferences: z
      .array(schedulePreferenceSchema)
      .length(3)
      .refine(
        (preferences) =>
          new Set(
            preferences.map(({ day, startTime }) => `${day}|${startTime}`),
          ).size === preferences.length,
        "Las tres preferencias deben ser distintas.",
      ),
    message: safeText(2, 500),
    sensitiveDataAccepted: z.literal(true),
    privacyAccepted: z.literal(true),
    website: z.string().max(0),
    turnstileToken: z.string().min(1).max(2048),
  })
  .strict();
