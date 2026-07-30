import { defineArrayMember, defineField, defineType } from "sanity";

export const seoSettings = defineType({
  name: "seoSettings",
  title: "SEO",
  type: "document",
  fields: [
    defineField({
      name: "metaTitle",
      title: "Título SEO",
      type: "string",
      validation: (Rule) => Rule.required().min(20).max(65),
    }),
    defineField({
      name: "metaDescription",
      title: "Descripción SEO",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().min(80).max(165),
    }),
    defineField({
      name: "canonicalOverride",
      title: "Canonical alternativo",
      type: "url",
      description: "Dejar vacío salvo una excepción revisada técnicamente.",
      validation: (Rule) => Rule.uri({ scheme: ["https"] }),
    }),
    defineField({
      name: "ogImage",
      title: "Imagen para redes",
      type: "image",
      fields: [
        defineField({
          name: "alt",
          title: "Texto alternativo",
          type: "string",
          validation: (Rule) => Rule.required().max(160),
        }),
      ],
    }),
    defineField({
      name: "businessType",
      title: "Tipo de negocio",
      type: "string",
      options: {
        list: ["ProfessionalService", "LocalBusiness"],
      },
    }),
    defineField({
      name: "areaServed",
      title: "Área atendida",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "socialProfiles",
      title: "Perfiles sociales oficiales",
      type: "array",
      of: [
        defineArrayMember({
          type: "url",
          validation: (Rule) => Rule.uri({ scheme: ["https"] }),
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "SEO" }),
  },
});
