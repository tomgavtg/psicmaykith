import { defineArrayMember, defineField, defineType } from "sanity";

export const privacyNotice = defineType({
  name: "privacyNotice",
  title: "Aviso de privacidad",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Título",
      type: "string",
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: "status",
      title: "Estado",
      type: "string",
      options: {
        list: [
          { title: "Borrador", value: "draft" },
          { title: "En revisión legal", value: "legalReview" },
          { title: "Aprobado", value: "approved" },
        ],
        layout: "radio",
      },
      initialValue: "draft",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "effectiveDate",
      title: "Fecha de entrada en vigor",
      type: "date",
      validation: (Rule) =>
        Rule.custom((value, context) =>
          context.document?.status !== "approved" || value
            ? true
            : "La fecha es obligatoria al aprobar.",
        ),
    }),
    defineField({
      name: "versionLabel",
      title: "Versión",
      type: "string",
      validation: (Rule) => Rule.required().max(40),
    }),
    defineField({
      name: "controllerIdentity",
      title: "Identidad de la persona responsable",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().max(400),
    }),
    defineField({
      name: "content",
      title: "Contenido",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Título 2", value: "h2" },
            { title: "Título 3", value: "h3" },
          ],
          marks: {
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Enlace",
                fields: [
                  {
                    name: "href",
                    type: "url",
                    validation: (Rule) =>
                      Rule.uri({ scheme: ["https", "mailto"] }),
                  },
                ],
              },
            ],
          },
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "contactEmail",
      title: "Correo de privacidad",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
  ],
  preview: {
    select: { title: "title", status: "status", version: "versionLabel" },
    prepare: ({ title, status, version }) => ({
      title,
      subtitle: `${version || "Sin versión"} · ${status || "Sin estado"}`,
    }),
  },
});
