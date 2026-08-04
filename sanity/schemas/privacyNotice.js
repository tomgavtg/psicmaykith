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
      validation: (Rule) =>
        Rule.required()
          .min(8)
          .max(400)
          .custom((value) =>
            !value || !/^mk\.?$/i.test(value.trim())
              ? true
              : "Indica la identidad legal completa; una abreviatura no es suficiente.",
          ),
    }),
    defineField({
      name: "controllerAddress",
      title: "Domicilio de la responsable",
      type: "text",
      rows: 3,
      description:
        "Domicilio profesional aprobado para publicarse en el aviso de privacidad.",
      validation: (Rule) =>
        Rule.max(400).custom((value, context) =>
          context.document?.status !== "approved" ||
          (typeof value === "string" && value.trim().length >= 10)
            ? true
            : "El domicilio es obligatorio al aprobar el aviso.",
        ),
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
      validation: (Rule) =>
        Rule.required().custom((value, context) =>
          context.document?.status !== "approved" ||
          (Array.isArray(value) && value.length >= 3)
            ? true
            : "Un aviso aprobado debe contener al menos tres bloques estructurados.",
        ),
    }),
    defineField({
      name: "contactEmail",
      title: "Correo de privacidad",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "contactWhatsapp",
      title: "WhatsApp para solicitudes ARCO",
      type: "string",
      description:
        "Sólo dígitos con código de país. Debe ser un canal aprobado para privacidad.",
      validation: (Rule) =>
        Rule.required().regex(/^\d{10,15}$/, {
          name: "número internacional",
        }),
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
