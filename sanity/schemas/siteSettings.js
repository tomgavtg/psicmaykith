import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Configuración del sitio",
  type: "document",
  fields: [
    defineField({
      name: "siteName",
      title: "Nombre del sitio",
      type: "string",
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: "headerName",
      title: "Nombre corto en encabezado",
      type: "string",
      validation: (Rule) => Rule.required().max(50),
    }),
    defineField({
      name: "globalNotice",
      title: "Aviso de no emergencia",
      type: "text",
      rows: 2,
      validation: (Rule) => Rule.required().max(220),
    }),
    defineField({
      name: "crisisNotice",
      title: "Aviso de crisis",
      type: "text",
      rows: 3,
      description: "Verificar contra fuentes oficiales antes de publicar.",
      validation: (Rule) => Rule.required().max(400),
    }),
    defineField({
      name: "footerText",
      title: "Texto del pie",
      type: "text",
      rows: 2,
      validation: (Rule) => Rule.required().max(220),
    }),
  ],
  preview: {
    prepare: () => ({ title: "Configuración del sitio" }),
  },
});
