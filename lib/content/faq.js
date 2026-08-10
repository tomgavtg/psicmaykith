function formatDuration(minutes) {
  if (!minutes) return "la duración indicada en la agenda";
  if (minutes < 60) return `${minutes} minutos`;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes
    ? `${hours} hora y ${remainingMinutes} minutos`
    : `${hours} hora`;
}

export function getFaqItems(content) {
  const individualService = content.services.find(
    (service) => service.slug === "terapia-para-adultos",
  );
  const coupleService = content.services.find(
    (service) => service.slug === "terapia-de-pareja",
  );
  const cancellationHours =
    content.contactSettings.bookingPolicy?.cancellationWindowHours;

  return [
    {
      question: "¿Las sesiones son presenciales o en línea?",
      answer:
        "Por el momento, las sesiones disponibles se realizan únicamente en línea mediante videollamada.",
    },
    {
      question: "¿Cuánto dura cada sesión?",
      answer: `Las sesiones individuales para adultos y adolescentes duran ${formatDuration(individualService?.durationMinutes)}. Las sesiones de pareja duran ${formatDuration(coupleService?.durationMinutes)}.`,
    },
    {
      question: "¿Cómo se confirma una cita?",
      answer:
        "La agenda de Google Calendar muestra los horarios disponibles. La cita se confirma únicamente después de completar los datos requeridos y el pago dentro del flujo de reserva.",
    },
    {
      question: "¿Dónde puedo consultar el precio?",
      answer:
        "El precio se muestra dentro del flujo de reserva antes de completar el pago. No se publica en las tarjetas de servicios del sitio.",
    },
    {
      question: "¿Cuál es la política de cancelación?",
      answer: cancellationHours
        ? `La cancelación sin penalización puede solicitarse hasta ${cancellationHours} horas antes de la sesión. Las cancelaciones tardías y las inasistencias no tienen reembolso. No se permiten reprogramaciones solicitadas por la persona usuaria.`
        : "La política aplicable se muestra antes de reservar la sesión.",
    },
    {
      question: "¿WhatsApp confirma o reserva una cita?",
      answer:
        "No. WhatsApp sirve para solicitar información y compartir un motivo de consulta breve. La reservación se confirma mediante la agenda y el pago correspondiente.",
    },
    {
      question: "¿Este sitio ofrece atención para emergencias?",
      answer:
        "No. Este sitio y WhatsApp no sustituyen servicios de emergencia ni atención en crisis. En una situación de emergencia o riesgo inmediato se debe llamar al 911.",
    },
  ];
}
