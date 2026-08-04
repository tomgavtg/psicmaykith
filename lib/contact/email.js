import {
  formatSchedulePreference,
  getServiceDurationMinutes,
} from "./appointment";

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function buildLeadEmail(data) {
  const durationMinutes = getServiceDurationMinutes(data.service) || 50;
  const rows = [
    ["Nombre", data.name],
    ["Correo", data.email],
    ["Teléfono", data.phone || "No proporcionado"],
    ["Servicio", data.service],
    ["Modalidad", data.modality],
    ...data.schedulePreferences.map((preference, index) => [
      `Preferencia ${index + 1}`,
      formatSchedulePreference(preference, durationMinutes),
    ]),
    ["Mensaje", data.message || "Sin mensaje"],
  ];

  return `
    <h1>Nueva solicitud de cita</h1>
    <p>Este mensaje no confirma una cita.</p>
    <table cellpadding="8" cellspacing="0" style="border-collapse:collapse">
      ${rows
        .map(
          ([label, value]) =>
            `<tr><th align="left" valign="top">${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`,
        )
        .join("")}
    </table>
  `;
}

export { escapeHtml };
