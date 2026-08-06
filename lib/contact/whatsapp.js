export function normalizeWhatsAppNumber(number) {
  const digits = String(number || "").replace(/\D/g, "");

  // México eliminó el prefijo móvil internacional 1. Convierte +52 1 + 10 dígitos
  // al formato E.164 vigente: +52 + 10 dígitos.
  return /^521\d{10}$/.test(digits) ? `52${digits.slice(3)}` : digits;
}

export function buildWhatsAppUrl(number, message) {
  const normalizedNumber = normalizeWhatsAppNumber(number);

  if (!/^\d{10,15}$/.test(normalizedNumber)) {
    return "";
  }

  const normalizedMessage = String(message || "").trim();
  const baseUrl = `https://wa.me/${normalizedNumber}`;

  return normalizedMessage
    ? `${baseUrl}?text=${encodeURIComponent(normalizedMessage)}`
    : baseUrl;
}

export function buildWhatsAppInquiryMessage({ name, service, motive }) {
  const normalizedName = String(name || "").trim();
  const normalizedService = String(service || "").trim();
  const normalizedMotive = String(motive || "").trim();

  return [
    "Hola, me gustaría recibir orientación para reservar una sesión.",
    "",
    `Nombre: ${normalizedName}`,
    `Servicio: ${normalizedService}`,
    `Motivo de consulta: ${normalizedMotive}`,
    "",
    "Confirmo que leí el Aviso de Privacidad y consiento el tratamiento de este motivo de consulta únicamente para atender mi solicitud.",
  ].join("\n");
}
