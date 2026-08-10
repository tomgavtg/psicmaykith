export const FAQ_CATEGORIES = [
  {
    id: "antes-de-comenzar",
    title: "Antes de comenzar",
    description:
      "Información para entender el enfoque y decidir si deseas solicitar una primera consulta.",
  },
  {
    id: "motivos-y-etapas",
    title: "Motivos de consulta y etapas de vida",
    description:
      "Respuestas generales sobre algunos motivos de consulta y las personas que pueden recibir atención.",
  },
  {
    id: "modalidad-y-acuerdos",
    title: "Modalidad, reserva y acuerdos",
    description:
      "Aspectos prácticos de las sesiones en línea, la agenda, el pago y las cancelaciones.",
  },
  {
    id: "privacidad-y-cuidado",
    title: "Privacidad, cuerpo y situaciones de crisis",
    description:
      "Consideraciones importantes para recibir una atención responsable y segura.",
  },
];

function formatDuration(minutes) {
  if (!minutes) return "la duración indicada en la agenda";
  if (minutes < 60) return `${minutes} minutos`;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes
    ? `${hours} hora y ${remainingMinutes} minutos`
    : `${hours} hora`;
}

function buildDefaultFaqItems(content) {
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
      slug: "que-es-psicoterapia-psicoanalitica",
      category: "antes-de-comenzar",
      question: "¿Qué es la psicoterapia psicoanalítica?",
      answer:
        "Es un proceso terapéutico orientado a comprender con mayor profundidad lo que una persona está viviendo: sus emociones, pensamientos, conflictos y formas de relacionarse. A través de la palabra y del vínculo terapéutico se construye un espacio de escucha, reflexión y elaboración.",
    },
    {
      slug: "para-quien-puede-ser-adecuada",
      category: "antes-de-comenzar",
      question: "¿Para quién puede ser adecuada?",
      answer:
        "Puede ser útil para personas que buscan comprender mejor lo que están viviendo o que atraviesan cambios, pérdidas, separaciones, dificultades en sus relaciones, ansiedad, tristeza u otras situaciones que afectan su bienestar. No es necesario contar con un diagnóstico para solicitar una primera consulta.",
    },
    {
      slug: "como-saber-si-puede-ayudarme",
      category: "antes-de-comenzar",
      question: "¿Cómo puedo saber si podría beneficiarme de la terapia?",
      answer:
        "Puedes considerar una consulta si llevas tiempo sintiéndote preocupado, triste o confundido; si tienes dificultades para afrontar alguna situación, si determinados conflictos se repiten o si deseas comprenderte mejor. Tampoco necesitas saber exactamente qué te ocurre antes de comenzar.",
    },
    {
      slug: "primera-sesion",
      category: "antes-de-comenzar",
      question: "¿Qué puedo esperar de la primera sesión?",
      answer:
        "La primera sesión permite hablar sobre el motivo de consulta, plantear dudas y conocer la forma de trabajo. A partir de esta conversación se valoran tus necesidades y la posibilidad de iniciar un proceso terapéutico.",
    },
    {
      slug: "saber-que-me-pasa",
      category: "antes-de-comenzar",
      question: "¿Tengo que saber exactamente qué me pasa antes de comenzar?",
      answer:
        "No. Es común llegar a terapia con la sensación de que algo no está bien sin poder explicarlo con claridad. No necesitas tener un diagnóstico ni definir de antemano todo lo que deseas trabajar; la primera consulta también sirve para comenzar a comprender tu situación y valorar la posibilidad de un tratamiento.",
    },
    {
      slug: "ansiedad-o-depresion",
      category: "motivos-y-etapas",
      question: "¿La psicoterapia puede acompañar problemas de ansiedad o depresión?",
      answer:
        "La psicoterapia puede formar parte del abordaje de la ansiedad o la depresión. Cada situación requiere una valoración individual y, cuando sea necesario, puede recomendarse atención médica o psiquiátrica complementaria. La psicoterapia no sustituye un tratamiento médico indicado.",
    },
    {
      slug: "dificultades-pareja-familia",
      category: "motivos-y-etapas",
      question: "¿Puede ayudarme si tengo dificultades con mi pareja o mi familia?",
      answer:
        "Sí. La terapia puede ayudar a comprender conflictos, formas de comunicación y dinámicas que generan malestar. Dependiendo del motivo de consulta, el trabajo puede realizarse de manera individual o en pareja.",
    },
    {
      slug: "psicoterapia-adolescentes",
      category: "motivos-y-etapas",
      question: "¿La psicoterapia es adecuada para adolescentes?",
      answer:
        "Puede ofrecer un espacio de escucha para hablar sobre cambios emocionales, familiares, escolares y sociales. Al trabajar con adolescentes se establecen desde el inicio los acuerdos de participación de madres, padres o personas tutoras, así como los límites de confidencialidad aplicables.",
    },
    {
      slug: "personas-adultas-mayores",
      category: "motivos-y-etapas",
      question: "¿También pueden acudir personas adultas mayores?",
      answer:
        "Sí. La terapia puede acompañar cambios, pérdidas, relaciones, soledad, preocupaciones y experiencias que adquieren un significado diferente con el paso del tiempo. La pertinencia del servicio se valora en la primera consulta.",
    },
    {
      slug: "orientacion-o-psicoterapia",
      category: "modalidad-y-acuerdos",
      question: "¿Cuál es la diferencia entre orientación psicológica y psicoterapia?",
      answer:
        "La orientación psicológica suele atender una necesidad específica y delimitada. La psicoterapia implica un proceso de mayor continuidad y profundidad. En la primera consulta puede valorarse cuál alternativa resulta más adecuada.",
    },
    {
      slug: "sesiones-en-linea",
      category: "modalidad-y-acuerdos",
      question: "¿Las sesiones son presenciales o en línea?",
      answer:
        "Actualmente, las sesiones se realizan únicamente en línea mediante videollamada. Se recomienda contar con un lugar privado, un dispositivo adecuado y una conexión estable para conversar con tranquilidad.",
    },
    {
      slug: "duracion-sesion",
      category: "modalidad-y-acuerdos",
      question: "¿Cuánto dura cada sesión?",
      answer: `Las sesiones individuales para adultos y adolescentes duran ${formatDuration(individualService?.durationMinutes)}. Las sesiones de pareja duran ${formatDuration(coupleService?.durationMinutes)}.`,
    },
    {
      slug: "duracion-proceso",
      category: "modalidad-y-acuerdos",
      question: "¿Cuánto tiempo dura un proceso terapéutico?",
      answer:
        "Cada proceso es diferente. Su duración depende del motivo de consulta, las necesidades de la persona y lo que se vaya trabajando durante las sesiones. Por ello, no es posible determinar de antemano un número de sesiones aplicable a todos los casos.",
    },
    {
      slug: "frecuencia-sesiones",
      category: "modalidad-y-acuerdos",
      question: "¿Con qué frecuencia se realizan las sesiones?",
      answer:
        "La frecuencia se acuerda según el motivo de consulta y las necesidades de la persona. Habitualmente se propone una sesión semanal para dar continuidad al proceso, aunque esto se define de manera individual.",
    },
    {
      slug: "confirmar-cita",
      category: "modalidad-y-acuerdos",
      question: "¿Cómo se confirma una cita?",
      answer:
        "La agenda de Google Calendar muestra los horarios disponibles. La cita se confirma únicamente después de completar los datos requeridos y el pago dentro del flujo de reserva.",
    },
    {
      slug: "precio-sesion",
      category: "modalidad-y-acuerdos",
      question: "¿Dónde puedo consultar el precio?",
      answer:
        "El precio se muestra dentro del flujo de reserva antes de completar el pago. No se publica en las tarjetas de servicios del sitio.",
    },
    {
      slug: "politica-cancelacion",
      category: "modalidad-y-acuerdos",
      question: "¿Cuál es la política de cancelación?",
      answer: cancellationHours
        ? `La cancelación sin penalización puede solicitarse hasta ${cancellationHours} horas antes de la sesión. Las cancelaciones tardías y las inasistencias no tienen reembolso. No se permiten reprogramaciones solicitadas por la persona usuaria.`
        : "La política aplicable se muestra antes de reservar la sesión.",
    },
    {
      slug: "contacto-whatsapp",
      category: "modalidad-y-acuerdos",
      question: "¿WhatsApp confirma o reserva una cita?",
      answer:
        "No. WhatsApp sirve para solicitar información y compartir un motivo de consulta breve. La reservación se confirma mediante la agenda y el pago correspondiente.",
    },
    {
      slug: "confidencialidad",
      category: "privacidad-y-cuidado",
      question: "¿Lo que se habla en terapia es confidencial?",
      answer:
        "La confidencialidad es una parte fundamental del proceso terapéutico. La información compartida se trata de acuerdo con las obligaciones éticas, profesionales y legales aplicables. En la primera consulta se explican sus alcances, límites y las consideraciones correspondientes cuando la persona atendida es menor de edad.",
    },
    {
      slug: "psicosomatica",
      category: "privacidad-y-cuidado",
      question: "¿Qué significa psicosomática?",
      answer:
        "La psicosomática estudia la relación compleja entre la experiencia emocional y el cuerpo. Esto no significa que los síntomas físicos sean imaginarios ni que una persona enferme por no controlar sus emociones. Cualquier síntoma físico debe recibir la valoración médica correspondiente.",
    },
    {
      slug: "sintomas-fisicos",
      category: "privacidad-y-cuidado",
      question: "¿Qué debo hacer si tengo síntomas físicos?",
      answer:
        "Los síntomas físicos nuevos, persistentes o preocupantes deben ser evaluados por profesionales de la salud. La psicoterapia puede ayudar a explorar cómo se viven emocionalmente esos síntomas, sin asumir que tienen una causa exclusivamente psicológica.",
    },
    {
      slug: "poner-en-palabras",
      category: "privacidad-y-cuidado",
      question: "¿Por qué puede ser importante hablar de lo que sentimos?",
      answer:
        "Poner en palabras una experiencia puede ayudar a reconocer emociones, comprender conflictos y relacionar lo que ocurre en el presente con la propia historia. El proceso terapéutico ofrece un espacio de escucha sin juicio para realizar esta exploración.",
    },
    {
      slug: "ocultar-lo-que-sentimos",
      category: "privacidad-y-cuidado",
      question: "¿Qué puede ocurrir cuando intentamos ocultar lo que sentimos?",
      answer:
        "Ante una pérdida, una separación, una enfermedad o un cambio importante, a veces intentamos seguir adelante sin reconocer lo que estamos viviendo. Evitar una experiencia puede influir en nuestro bienestar, nuestras relaciones o la manera de afrontar la vida. Hablar de ello permite explorarla sin asumir que existe una sola forma correcta de sentir.",
    },
    {
      slug: "elaborar-experiencia-dificil",
      category: "privacidad-y-cuidado",
      question: "¿Qué ocurre cuando resulta difícil elaborar una experiencia?",
      answer:
        "Cada persona atraviesa las experiencias de manera diferente. Algunas pueden dejar emociones difíciles de procesar y relacionarse con ansiedad, tristeza, conflictos, indecisión o un malestar que cuesta explicar. Explorar lo vivido puede ayudar a comprender su significado y a construir otras formas de relacionarse con esa experiencia.",
    },
    {
      slug: "mundo-interno",
      category: "privacidad-y-cuidado",
      question: "¿Qué significa explorar el mundo interno?",
      answer:
        "Significa observar emociones, pensamientos, deseos, temores y patrones que no siempre resultan evidentes. Comprenderlos puede ayudar a reconocer repeticiones, tomar decisiones con mayor conciencia y construir formas diferentes de relacionarse.",
    },
    {
      slug: "atencion-crisis",
      category: "privacidad-y-cuidado",
      question: "¿Puedo solicitar una consulta si estoy atravesando una crisis?",
      answer:
        "Puedes solicitar una consulta, pero este sitio, la agenda y WhatsApp no son servicios de emergencia. Si existe riesgo inmediato para ti o para alguien más, llama al 911. Para orientación en salud mental en México, comunícate con la Línea de la Vida al 800 911 2000, disponible las 24 horas, todos los días.",
    },
  ];
}

function mergeManagedItems(defaultItems, managedItems) {
  if (!Array.isArray(managedItems) || managedItems.length === 0) {
    return defaultItems;
  }

  const managedBySlug = new Map(
    managedItems
      .filter((item) => item?.slug && item?.question && item?.answer)
      .map((item) => [item.slug, item]),
  );

  const merged = defaultItems.map((item) => ({
    ...item,
    ...(managedBySlug.get(item.slug) || {}),
  }));
  const defaultSlugs = new Set(defaultItems.map((item) => item.slug));

  return [
    ...merged,
    ...managedItems.filter(
      (item) =>
        item?.slug &&
        item?.question &&
        item?.answer &&
        !defaultSlugs.has(item.slug),
    ),
  ];
}

export function getFaqItems(content) {
  return mergeManagedItems(buildDefaultFaqItems(content), content.faqItems);
}

export function getFaqGroups(items) {
  return FAQ_CATEGORIES.map((category) => ({
    ...category,
    items: items.filter((item) => item.category === category.id),
  })).filter((category) => category.items.length > 0);
}
