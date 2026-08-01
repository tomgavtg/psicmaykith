export const APPOINTMENT_SERVICE_EVENT = "appointment:select-service";

const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export function isValidPreferredDate(value) {
  if (value === "") {
    return true;
  }

  const match = ISO_DATE_PATTERN.exec(String(value));
  if (!match) {
    return false;
  }

  const [, year, month, day] = match;
  const date = new Date(
    Date.UTC(Number(year), Number(month) - 1, Number(day)),
  );

  return (
    date.getUTCFullYear() === Number(year) &&
    date.getUTCMonth() === Number(month) - 1 &&
    date.getUTCDate() === Number(day)
  );
}

export function formatPreferredDate(value) {
  if (!value || !isValidPreferredDate(value)) {
    return "Sin fecha específica";
  }

  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

export function getTodayInMexico(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Mexico_City",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const values = Object.fromEntries(
    parts
      .filter((part) => ["year", "month", "day"].includes(part.type))
      .map((part) => [part.type, part.value]),
  );

  return `${values.year}-${values.month}-${values.day}`;
}

export function isCurrentOrFuturePreferredDate(value, now = new Date()) {
  return (
    value === "" ||
    (isValidPreferredDate(value) && value >= getTodayInMexico(now))
  );
}
