import { defineArrayMember, defineField, defineType } from "sanity";

export const professionalProfile = defineType({
  name: "professionalProfile",
  title: "Perfil profesional",
  type: "document",
  fields: [
    defineField({
      name: "fullName",
      title: "Nombre profesional visible",
      type: "string",
      description:
        "Nombre comercial que se muestra públicamente en el sitio. Usar “Psic. Mayumi Kitahara”. La identidad legal se administra únicamente en el aviso de privacidad.",
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: "heroTitle",
      title: "Título principal",
      type: "string",
      description:
        "Idea principal de la portada. Debe ser clara, respetuosa y no prometer resultados.",
      validation: (Rule) => Rule.required().max(110),
    }),
    defineField({
      name: "headline",
      title: "Titular",
      type: "string",
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: "shortBio",
      title: "Descripción breve",
      type: "text",
      rows: 4,
      description: "Máximo 55 palabras; sin promesas de resultados.",
      validation: (Rule) =>
        Rule.required().custom((value) => {
          if (!value) return true;
          return value.trim().split(/\s+/).length <= 55
            ? true
            : "La descripción debe tener máximo 55 palabras.";
        }),
    }),
    defineField({
      name: "portrait",
      title: "Retrato profesional",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Texto alternativo",
          type: "string",
          validation: (Rule) => Rule.required().max(160),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "approach",
      title: "Enfoque",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().max(500),
    }),
    defineField({
      name: "validationItems",
      title: "Situaciones con las que puede identificarse quien visita",
      type: "array",
      description:
        "Entre tres y cinco situaciones, sin diagnosticar ni asumir que describen a todas las personas.",
      of: [
        defineArrayMember({
          type: "string",
          validation: (Rule) => Rule.max(180),
        }),
      ],
      validation: (Rule) => Rule.required().min(3).max(5),
    }),
    defineField({
      name: "licenseNumber",
      title: "Cédula profesional",
      type: "string",
      description: "Publicar únicamente después de verificarla.",
      validation: (Rule) => Rule.required().min(4).max(40),
    }),
    defineField({
      name: "education",
      title: "Formación",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "degree", title: "Grado", type: "string" }),
            defineField({
              name: "institution",
              title: "Institución",
              type: "string",
            }),
            defineField({ name: "year", title: "Año", type: "number" }),
          ],
        }),
      ],
      validation: (Rule) => Rule.required().min(1).max(6),
    }),
    defineField({
      name: "certifications",
      title: "Certificaciones",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "name", title: "Nombre", type: "string" }),
            defineField({
              name: "institution",
              title: "Institución",
              type: "string",
            }),
          ],
        }),
      ],
      validation: (Rule) => Rule.max(6),
    }),
    defineField({
      name: "highlights",
      title: "Elementos destacados",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (Rule) => Rule.required().min(1).max(3),
    }),
  ],
});
