import { defineArrayMember, defineField, defineType } from "sanity";

export const service = defineType({
  name: "service",
  title: "Servicio",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Nombre",
      type: "string",
      validation: (Rule) => Rule.required().max(70),
    }),
    defineField({
      name: "slug",
      title: "Identificador",
      type: "slug",
      options: { source: "name", maxLength: 80 },
      validation: (Rule) =>
        Rule.required().custom((value) =>
          !value?.current || /^[a-z0-9-]{2,80}$/.test(value.current)
            ? true
            : "Usa entre 2 y 80 caracteres: minúsculas, números y guiones.",
        ),
    }),
    defineField({
      name: "shortDescription",
      title: "Descripción breve",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().min(40).max(280),
    }),
    defineField({
      name: "modality",
      title: "Modalidades",
      type: "array",
      of: [
        defineArrayMember({
          type: "string",
          options: { list: ["En línea", "Presencial"] },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "durationMinutes",
      title: "Duración en minutos",
      type: "number",
      description:
        "Adultos y adolescentes: 50 minutos. Pareja: 70 minutos.",
      validation: (Rule) =>
        Rule.required()
          .integer()
          .min(15)
          .max(240)
          .custom((value, context) => {
            const slug = context.document?.slug?.current;
            const expectedDuration = {
              "terapia-para-adultos": 50,
              "terapia-para-adolescentes": 50,
              "terapia-de-pareja": 70,
            }[slug];

            return !expectedDuration || value === expectedDuration
              ? true
              : `La duración confirmada para este servicio es ${expectedDuration} minutos.`;
          }),
    }),
    defineField({
      name: "fee",
      title: "Honorarios",
      type: "object",
      fields: [
        defineField({
          name: "amount",
          title: "Cantidad",
          type: "number",
          validation: (Rule) => Rule.positive(),
        }),
        defineField({
          name: "currency",
          title: "Moneda",
          type: "string",
          initialValue: "MXN",
          options: { list: ["MXN"] },
        }),
        defineField({
          name: "note",
          title: "Nota",
          type: "string",
          validation: (Rule) => Rule.max(80),
        }),
      ],
    }),
    defineField({
      name: "availabilityNote",
      title: "Nota de disponibilidad",
      type: "string",
      validation: (Rule) => Rule.max(100),
    }),
    defineField({
      name: "image",
      title: "Imagen",
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
    }),
    defineField({
      name: "order",
      title: "Orden",
      type: "number",
      validation: (Rule) => Rule.required().integer().min(1).max(20),
    }),
    defineField({
      name: "isActive",
      title: "Visible",
      type: "boolean",
      initialValue: false,
    }),
  ],
  orderings: [
    {
      title: "Orden de presentación",
      name: "presentationOrder",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "name", subtitle: "availabilityNote", media: "image" },
  },
});
