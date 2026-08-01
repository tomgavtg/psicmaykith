import { z } from "zod";
import { isCurrentOrFuturePreferredDate } from "./appointment";

const safeText = (minimum, maximum) =>
  z
    .string()
    .trim()
    .min(minimum)
    .max(maximum)
    .refine((value) => !/https?:\/\/|www\./i.test(value), {
      message: "No incluyas enlaces.",
    });

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
    modality: safeText(2, 50),
    preferredDate: z
      .string()
      .trim()
      .max(10)
      .refine(
        isCurrentOrFuturePreferredDate,
        "La fecha debe ser válida y no estar en el pasado.",
      ),
    preferredSchedule: safeText(2, 80),
    message: z
      .string()
      .trim()
      .max(500)
      .refine((value) => !/https?:\/\/|www\./i.test(value), {
        message: "No incluyas enlaces.",
      }),
    privacyAccepted: z.literal(true),
    website: z.string().max(0),
    turnstileToken: z.string().min(1).max(2048),
  })
  .strict();
