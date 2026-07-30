export function buildWhatsAppUrl(number, message) {
  const normalizedNumber = String(number || "").replace(/\D/g, "");

  if (!normalizedNumber) {
    return "";
  }

  return `https://wa.me/${normalizedNumber}?text=${encodeURIComponent(message || "")}`;
}
