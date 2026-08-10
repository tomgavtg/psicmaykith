export const fallbackContent = {
  isPlaceholder: true,
  siteSettings: {
    siteName: "Psicoterapia psicoanalítica en línea",
    headerName: "Psicoterapia en línea",
    globalNotice:
      "Este espacio no sustituye servicios de emergencia ni atención en crisis.",
    crisisNotice:
      "Si estás en una situación de emergencia o riesgo inmediato, llama al 911. Para orientación en salud mental en México, comunícate a la Línea de la Vida: 800 911 2000.",
    footerText:
      "Un espacio de escucha profesional para comprender lo que sientes y trabajar aquello que se repite. Atención en línea con cita previa.",
  },
  professionalProfile: {
    fullName: "",
    heroTitle: "Lo que sientes hoy tiene una historia. Podemos empezar a entenderla.",
    headline:
      "Psicoterapia psicoanalítica en línea para adolescentes, adultos y parejas.",
    shortBio:
      "Un espacio de escucha para comprender lo que sientes, reconocer patrones que se repiten y construir nuevas formas de relacionarte contigo y con otras personas. Las sesiones se realizan por videollamada y cada proceso se trabaja de manera particular.",
    approach:
      "El enfoque psicoanalítico parte de que no todo lo que sentimos o hacemos tiene una razón consciente. Explorar la historia de nuestros vínculos permite reconocer patrones, poner en palabras lo que ocurre y abrir la posibilidad de relacionarnos de otra manera. No se trata de quedarse en el pasado, sino de comprender cómo sigue presente.",
    validationItems: [
      "Sientes ansiedad y no logras explicar del todo de dónde viene.",
      "Repites discusiones o situaciones parecidas en tus relaciones.",
      "Por fuera parece que todo está bien, pero algo por dentro no termina de acomodarse.",
      "Te preocupa cómo acercarte a tu hija o hijo adolescente sin generar más distancia.",
      "Sabes que necesitas hablar con alguien, aunque todavía no tengas claro por dónde empezar.",
    ],
    highlights: [
      "Atención por videollamada",
      "Adolescentes, adultos y parejas",
      "Un proceso centrado en la escucha",
    ],
    portrait: {
      url: "/images/psychologist/PhotoMK1.jpeg",
      alt: "Retrato de la profesional sentada junto a una mesa en un espacio interior.",
    },
  },
  services: [
    {
      _id: "service-proposal-adults",
      slug: "terapia-para-adultos",
      name: "Terapia para adultos",
      shortDescription:
        "Un espacio para comprender lo que sientes, reconocer patrones en tus relaciones o decisiones y poner en palabras aquello que todavía resulta difícil nombrar.",
      modality: ["En línea"],
      durationMinutes: 50,
      fee: { amount: 750, currency: "MXN", note: "por sesión" },
      bookingUrl: "https://calendar.app.google/ASqcLDM3toM1cwU39",
      availabilityNote: null,
      image: null,
    },
    {
      _id: "service-proposal-adolescents",
      slug: "terapia-para-adolescentes",
      name: "Terapia para adolescentes",
      shortDescription:
        "Un espacio de escucha adaptado a su edad, donde pueda hablar sin sentirse juzgado o evaluado. El encuadre y la comunicación con madres, padres o tutores se acuerdan antes de comenzar.",
      modality: ["En línea"],
      durationMinutes: 50,
      fee: { amount: 750, currency: "MXN", note: "por sesión" },
      bookingUrl: "https://calendar.app.google/ASqcLDM3toM1cwU39",
      availabilityNote: null,
      image: null,
    },
    {
      _id: "service-proposal-couples",
      slug: "terapia-de-pareja",
      name: "Terapia de pareja",
      shortDescription:
        "Un espacio neutral para escuchar lo que sucede entre ambos, comprender los conflictos que se repiten y conversar sin buscar quién tiene la razón.",
      modality: ["En línea"],
      durationMinutes: 70,
      fee: { amount: 1200, currency: "MXN", note: "por sesión" },
      bookingUrl: "https://calendar.app.google/mYGWH7GsyeatowKMA",
      availabilityNote: null,
      image: null,
    },
  ],
  contactSettings: {
    email: "contacto@psicologamayumikitahara.com",
    phoneDisplay: "+52 55 1609 8584",
    whatsappNumber: "525516098584",
    whatsappMessage:
      "Hola, me gustaría solicitar información para agendar una primera sesión.",
    locationName: "Atención en línea",
    modalities: ["En línea"],
    availableWeekdays: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
    availableStartTimes: [
      "09:30",
      "10:00",
      "10:30",
      "11:00",
      "11:30",
      "12:00",
      "12:30",
      "13:00",
      "13:30",
      "14:00",
      "14:30",
      "15:00",
      "15:30",
      "16:00",
      "16:30",
      "17:00",
      "17:30",
    ],
    bookingPolicy: {
      cancellationWindowHours: 48,
      clientReschedulingAllowed: false,
      lateCancellationPolicy: "Sin reembolso",
      noShowPolicy: "Sin reembolso",
      providerCancellationPolicy: "Se ofrecerá reprogramación",
    },
    responseTimeCopy: "",
    successMessage:
      "Gracias. Recibimos tu solicitud de cita; la fecha se confirmará después de revisar disponibilidad.",
    errorMessage:
      "No pudimos enviar tu solicitud de cita. Intenta de nuevo o utiliza otro medio de contacto disponible.",
  },
  seoSettings: {
    metaTitle: "Psicóloga Mayumi Kitahara | Psicoterapia en línea",
    metaDescription:
      "Psicoterapia psicoanalítica en línea para adolescentes, adultos y parejas. Consulta disponibilidad y solicita una primera cita.",
    ogImage: null,
    ogImageAlt: "",
    businessType: "ProfessionalService",
  },
  privacyNotice: {
    title: "Aviso de privacidad",
    status: "draft",
    effectiveDate: null,
    versionLabel: "Borrador",
    controllerIdentity: "",
    controllerAddress: "",
    contactEmail: "",
    contactWhatsapp: "",
    content: null,
  },
};
