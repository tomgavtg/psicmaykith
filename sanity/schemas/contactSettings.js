import { defineArrayMember, defineField, defineType } from "sanity";

export const contactSettings = defineType({
  name: "contactSettings",
  title: "Contacto",
  type: "document",
  fields: [
    defineField({
      name: "email",
      title: "Correo público",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "phoneDisplay",
      title: "Teléfono visible",
      type: "string",
      validation: (Rule) => Rule.max(30),
    }),
    defineField({
      name: "whatsappNumber",
      title: "Número de WhatsApp",
      type: "string",
      description:
        "Sólo dígitos, con código de país, sin +, espacios o guiones. Para México usar 52 + 10 dígitos, sin el antiguo prefijo 1.",
      validation: (Rule) =>
        Rule.required().regex(/^\d{10,15}$/, {
          name: "número internacional",
        }),
    }),
    defineField({
      name: "whatsappMessage",
      title: "Mensaje inicial de WhatsApp",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().max(300),
    }),
    defineField({
      name: "locationName",
      title: "Zona de atención",
      type: "string",
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: "serviceAreas",
      title: "Áreas atendidas",
      type: "array",
      description:
        "Zonas o modalidades geográficas reales utilizadas en SEO y datos estructurados.",
      of: [defineArrayMember({ type: "string" })],
      validation: (Rule) => Rule.required().min(1).max(6).unique(),
    }),
    defineField({
      name: "modalities",
      title: "Modalidades del formulario",
      type: "array",
      description: "Por el momento, el formulario sólo admite la modalidad En línea.",
      of: [
        defineArrayMember({
          type: "string",
          options: { list: ["En línea"] },
        }),
      ],
      validation: (Rule) => Rule.required().length(1).unique(),
    }),
    defineField({
      name: "availableWeekdays",
      title: "Días disponibles",
      type: "array",
      description:
        "Días que pueden elegirse como preferencia. Seleccionar un día no confirma una cita.",
      of: [
        defineArrayMember({
          type: "string",
          options: {
            list: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
          },
        }),
      ],
      validation: (Rule) => Rule.required().min(1).max(5).unique(),
    }),
    defineField({
      name: "availableStartTimes",
      title: "Horas de inicio disponibles",
      type: "array",
      description:
        "Formato de 24 horas HH:mm. La interfaz calcula la hora final según el servicio.",
      of: [
        defineArrayMember({
          type: "string",
          validation: (Rule) =>
            Rule.regex(/^([01]\d|2[0-3]):[0-5]\d$/, {
              name: "hora HH:mm",
            }),
        }),
      ],
      validation: (Rule) => Rule.required().min(1).max(24).unique(),
    }),
    defineField({
      name: "bookingPolicy",
      title: "Política de reserva y cancelación",
      type: "object",
      fields: [
        defineField({
          name: "cancellationWindowHours",
          title: "Cancelación sin penalización (horas antes)",
          type: "number",
          validation: (Rule) => Rule.required().integer().min(1).max(720),
        }),
        defineField({
          name: "clientReschedulingAllowed",
          title: "Reprogramación solicitada por la persona usuaria",
          type: "boolean",
          initialValue: false,
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "lateCancellationPolicy",
          title: "Cancelación tardía",
          type: "string",
          options: { list: ["Sin reembolso"] },
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "noShowPolicy",
          title: "Inasistencia",
          type: "string",
          options: { list: ["Sin reembolso"] },
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "providerCancellationPolicy",
          title: "Cancelación por parte de la psicóloga",
          type: "string",
          options: { list: ["Se ofrecerá reprogramación"] },
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: "responseTimeCopy",
      title: "Plazo real de respuesta",
      type: "string",
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: "successMessage",
      title: "Mensaje de éxito",
      type: "text",
      rows: 2,
      validation: (Rule) => Rule.required().max(250),
    }),
    defineField({
      name: "errorMessage",
      title: "Mensaje de error",
      type: "text",
      rows: 2,
      validation: (Rule) => Rule.required().max(250),
    }),
  ],
  preview: {
    prepare: () => ({ title: "Contacto" }),
  },
});
