import { defineField, defineType } from "sanity";
import { FAQ_CATEGORIES } from "../../lib/content/faq";

export const faqItem = defineType({
  name: "faqItem",
  title: "Pregunta frecuente",
  type: "document",
  fields: [
    defineField({
      name: "question",
      title: "Pregunta",
      type: "string",
      validation: (Rule) => Rule.required().min(10).max(160),
    }),
    defineField({
      name: "slug",
      title: "Identificador",
      type: "slug",
      description:
        "Se utiliza para actualizar una pregunta existente sin duplicarla.",
      options: { source: "question", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "answer",
      title: "Respuesta",
      type: "text",
      rows: 6,
      description:
        "Usar lenguaje claro, profesional y prudente. No diagnosticar ni prometer resultados.",
      validation: (Rule) => Rule.required().min(40).max(900),
    }),
    defineField({
      name: "category",
      title: "Categoría",
      type: "string",
      options: {
        list: FAQ_CATEGORIES.map((category) => ({
          title: category.title,
          value: category.id,
        })),
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "order",
      title: "Orden",
      type: "number",
      initialValue: 100,
      validation: (Rule) => Rule.required().integer().min(0).max(999),
    }),
    defineField({
      name: "isActive",
      title: "Publicada",
      type: "boolean",
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: "Orden de aparición",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "question", category: "category", active: "isActive" },
    prepare({ title, category, active }) {
      const categoryTitle =
        FAQ_CATEGORIES.find((item) => item.id === category)?.title ||
        "Sin categoría";
      return {
        title,
        subtitle: `${categoryTitle}${active === false ? " · Oculta" : ""}`,
      };
    },
  },
});
