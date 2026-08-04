export const APPOINTMENT_SERVICE_EVENT = "appointment:select-service";

export const CONFIRMED_SERVICE_DURATIONS = {
  "terapia-para-adultos": 50,
  "terapia-para-adolescentes": 50,
  "terapia-de-pareja": 70,
};

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

export function getServiceDurationMinutes(serviceSlug) {
  return CONFIRMED_SERVICE_DURATIONS[serviceSlug] || null;
}

function timeParts(value) {
  const match = /^(\d{2}):(\d{2})$/.exec(String(value));
  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;

  return { hours, minutes };
}

function formatClock(totalMinutes) {
  const normalizedMinutes = totalMinutes % (24 * 60);
  const hours24 = Math.floor(normalizedMinutes / 60);
  const minutes = normalizedMinutes % 60;
  const period = hours24 < 12 ? "a. m." : "p. m.";
  const hours12 = hours24 % 12 || 12;

  return {
    clock: `${hours12}:${String(minutes).padStart(2, "0")}`,
    period,
  };
}

export function isValidStartTime(value) {
  return Boolean(timeParts(value));
}

export function formatTimeRange(startTime, durationMinutes) {
  const start = timeParts(startTime);
  if (!start || !Number.isInteger(durationMinutes) || durationMinutes <= 0) {
    return "Horario no disponible";
  }

  const startMinutes = start.hours * 60 + start.minutes;
  const formattedStart = formatClock(startMinutes);
  const formattedEnd = formatClock(startMinutes + durationMinutes);

  if (formattedStart.period === formattedEnd.period) {
    return `${formattedStart.clock}–${formattedEnd.clock} ${formattedEnd.period}`;
  }

  return `${formattedStart.clock} ${formattedStart.period}–${formattedEnd.clock} ${formattedEnd.period}`;
}

export function formatSchedulePreference(preference, durationMinutes) {
  if (!preference?.day || !preference?.startTime) {
    return "Sin preferencia";
  }

  return `${preference.day}, ${formatTimeRange(preference.startTime, durationMinutes)}`;
}
