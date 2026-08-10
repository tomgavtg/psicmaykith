const singletonTypes = new Set([
  "siteSettings",
  "professionalProfile",
  "contactSettings",
  "seoSettings",
]);

export const structure = (S) =>
  S.list()
    .title("Contenido")
    .items([
      S.listItem()
        .title("Configuración del sitio")
        .id("siteSettings")
        .child(
          S.document()
            .schemaType("siteSettings")
            .documentId("siteSettings"),
        ),
      S.listItem()
        .title("Perfil profesional")
        .id("professionalProfile")
        .child(
          S.document()
            .schemaType("professionalProfile")
            .documentId("professionalProfile"),
        ),
      S.documentTypeListItem("service").title("Servicios"),
      S.documentTypeListItem("faqItem").title("Preguntas frecuentes"),
      S.listItem()
        .title("Contacto")
        .id("contactSettings")
        .child(
          S.document()
            .schemaType("contactSettings")
            .documentId("contactSettings"),
        ),
      S.listItem()
        .title("SEO")
        .id("seoSettings")
        .child(
          S.document().schemaType("seoSettings").documentId("seoSettings"),
        ),
      S.documentTypeListItem("privacyNotice").title("Avisos de privacidad"),
      S.documentTypeListItem("imageAssetMetadata").title("Imágenes y permisos"),
      ...S.documentTypeListItems().filter(
        (item) =>
          !singletonTypes.has(item.getId()) &&
          !["service", "faqItem", "privacyNotice", "imageAssetMetadata"].includes(
            item.getId(),
          ),
      ),
    ]);
