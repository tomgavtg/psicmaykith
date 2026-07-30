import { defineField, defineType } from "sanity";

export const imageAssetMetadata = defineType({
  name: "imageAssetMetadata",
  title: "Imagen y permisos",
  type: "document",
  fields: [
    defineField({
      name: "asset",
      title: "Imagen",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "altText",
      title: "Texto alternativo",
      type: "string",
      validation: (Rule) => Rule.required().max(160),
    }),
    defineField({ name: "caption", title: "Pie de imagen", type: "string" }),
    defineField({ name: "credit", title: "Crédito", type: "string" }),
    defineField({
      name: "rightsHolder",
      title: "Titular de derechos",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "permissionStatus",
      title: "Estado del permiso",
      type: "string",
      options: {
        list: [
          { title: "Pendiente", value: "pending" },
          { title: "Aprobado", value: "approved" },
          { title: "Rechazado", value: "rejected" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "permissionEvidenceReference",
      title: "Referencia de evidencia",
      type: "string",
      description: "No incluir documentos personales ni secretos.",
    }),
    defineField({
      name: "usageScope",
      title: "Alcance de uso",
      type: "text",
      rows: 2,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "expiryDate",
      title: "Vencimiento",
      type: "date",
    }),
    defineField({
      name: "containsPeople",
      title: "Contiene personas",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "reviewedAt",
      title: "Fecha de revisión",
      type: "date",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "altText",
      subtitle: "permissionStatus",
      media: "asset",
    },
  },
});
