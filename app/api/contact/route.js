import { Resend } from "resend";
import { getContactOptions } from "../../../lib/content/get-contact-options";
import { buildLeadEmail } from "../../../lib/contact/email";
import { consumeRateLimit } from "../../../lib/contact/rate-limit";
import { contactSchema } from "../../../lib/contact/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 10 * 1024;

function json(message, status, headers = {}) {
  return Response.json(
    { message },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
        ...headers,
      },
    },
  );
}

function requestIp(headers) {
  return (
    headers.get("cf-connecting-ip") ||
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

function validateRequestSource(request) {
  const allowedOrigin =
    process.env.ALLOWED_ORIGIN ||
    (process.env.NODE_ENV === "development" ? "https://localhost:3000" : "");

  if (!allowedOrigin) {
    return false;
  }

  try {
    const allowedUrl = new URL(allowedOrigin);
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");

    return origin === allowedUrl.origin && host === allowedUrl.host;
  } catch {
    return false;
  }
}

async function validateTurnstile(token, ip) {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    return false;
  }

  const body = new URLSearchParams({
    secret,
    response: token,
  });

  if (ip !== "unknown") {
    body.set("remoteip", ip);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body,
        signal: controller.signal,
        cache: "no-store",
      },
    );
    const result = await response.json();

    return (
      result.success === true &&
      (!result.action || result.action === "contact") &&
      (!result.hostname ||
        (process.env.ALLOWED_ORIGIN &&
          result.hostname === new URL(process.env.ALLOWED_ORIGIN).hostname))
    );
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

export async function POST(request) {
  if (!validateRequestSource(request)) {
    return json("No fue posible procesar la solicitud.", 403);
  }

  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().startsWith("application/json")) {
    return json("El formato de la solicitud no es compatible.", 415);
  }

  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (declaredLength > MAX_BODY_BYTES) {
    return json("La solicitud supera el tamaño permitido.", 413);
  }

  const bytes = await request.arrayBuffer();
  if (bytes.byteLength > MAX_BODY_BYTES) {
    return json("La solicitud supera el tamaño permitido.", 413);
  }

  let rawData;
  try {
    rawData = JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return json("Revisa los campos e intenta de nuevo.", 400);
  }

  const parsed = contactSchema.safeParse(rawData);
  if (!parsed.success) {
    return json("Revisa los campos e intenta de nuevo.", 400);
  }

  const ip = requestIp(request.headers);
  const rateLimit = consumeRateLimit(ip);
  if (!rateLimit.allowed) {
    return json("Espera unos minutos antes de volver a intentar.", 429, {
      "Retry-After": String(rateLimit.retryAfterSeconds),
    });
  }

  const contactOptions = await getContactOptions();
  if (
    !contactOptions.services.includes(parsed.data.service) ||
    !contactOptions.modalities.includes(parsed.data.modality) ||
    !contactOptions.schedules.includes(parsed.data.preferredSchedule)
  ) {
    return json("Alguna de las opciones seleccionadas no es válida.", 400);
  }

  const turnstileIsValid = await validateTurnstile(
    parsed.data.turnstileToken,
    ip,
  );
  if (!turnstileIsValid) {
    return json("No pudimos verificar la solicitud. Intenta de nuevo.", 403);
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEADS_TO_EMAIL;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    return json(
      "El formulario aún no está disponible. Utiliza WhatsApp como alternativa.",
      500,
    );
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: parsed.data.email,
      subject: `Solicitud de cita: ${parsed.data.service}`,
      html: buildLeadEmail(parsed.data),
    });

    if (error) {
      return json(
        "No pudimos enviar tu solicitud. Intenta de nuevo más tarde.",
        502,
      );
    }

    return json(
      "Gracias. Recibimos tu solicitud de cita; la fecha se confirmará después de revisar disponibilidad.",
      200,
    );
  } catch {
    return json(
      "No pudimos enviar tu solicitud. Intenta de nuevo más tarde.",
      502,
    );
  }
}

export function GET() {
  return json("Método no permitido.", 405, { Allow: "POST" });
}
