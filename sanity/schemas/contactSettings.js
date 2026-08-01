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
      name: "modalities",
      title: "Modalidades del formulario",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (Rule) => Rule.required().min(1).max(4),
    }),
    defineField({
      name: "preferredScheduleOptions",
      title: "Opciones de horario",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (Rule) => Rule.required().min(1).max(10),
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
