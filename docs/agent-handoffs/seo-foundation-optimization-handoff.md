# Entrega: revisión y optimización SEO inicial

Fecha: 10 de agosto de 2026

## Objetivo

Fortalecer la capacidad de Google para comprender la página y mejorar la claridad del
resultado de búsqueda sin utilizar relleno de palabras clave, testimonios, reseñas,
calificaciones, ubicaciones físicas o afirmaciones profesionales no verificadas.

## Hallazgos de la auditoría

- La aplicación ya contaba con renderizado del servidor, canonical HTTPS, `lang` en
  español de México, `robots.txt`, sitemap, metadatos editables, Open Graph y JSON-LD.
- El H1 era emocional pero no describía directamente el servicio.
- El título SEO no incluía la zona atendida por la campaña.
- La imagen configurada para redes era el retrato vertical; esa proporción no es la
  adecuada para una tarjeta social grande.
- El JSON-LD declaraba `ProfessionalService` sin una ubicación física visible. Para la
  modalidad exclusivamente en línea se decidió usar `Organization`, junto con una
  entidad `Person` para la profesional y un catálogo de servicios.

## Cambios implementados

- Nombre público uniforme: **Psic. Mayumi Kitahara**.
- Título SEO: **Psicoterapia en línea en CDMX | Psic. Mayumi Kitahara**.
- Descripción SEO de 133 caracteres, específica para adolescentes, adultos, parejas,
  CDMX, disponibilidad y reserva.
- El titular descriptivo del servicio se convirtió en el H1; la frase emocional se
  conserva como apoyo inmediato.
- Open Graph y Twitter usan una tarjeta generada de 1200 × 630 px cuando la imagen de
  Sanity no es horizontal.
- Se permiten vistas previas grandes de imágenes y snippets mediante directivas para
  Googlebot.
- JSON-LD incluye `WebSite`, `WebPage`, `Organization`, `Person`, cédula profesional y
  servicios reales, sin dirección de atención, precio, reseñas o rating inventados.
- Sanity explica la proporción recomendada para imágenes sociales y el tipo adecuado
  para una práctica exclusivamente en línea.
- Se añadieron pruebas automatizadas para la imagen social y los datos estructurados.

## Acciones externas pendientes

- [ ] Verificar o confirmar la propiedad de dominio en Google Search Console.
- [ ] Enviar `https://www.psicologamayumikitahara.com/sitemap.xml` en Search Console.
- [ ] Inspeccionar y solicitar indexación de la portada tras este despliegue.
- [ ] Revisar en Search Console consultas, páginas, CTR y posición después de 28 días;
  no tomar decisiones con los datos iniciales incompletos.
- [ ] Confirmar perfiles oficiales antes de llenar `sameAs` en Sanity.
- [ ] Evaluar páginas específicas de servicios sólo si se aprueba ampliar la
  arquitectura actual de landing de tres secciones. Cada página requeriría contenido
  original y útil; no se crearán páginas delgadas para repetir palabras clave.
- [ ] Evaluar un Perfil de Negocio de Google únicamente después de confirmar que la
  práctica cumple los requisitos vigentes del producto; no publicar una dirección de
  atención que no reciba pacientes.

## Criterios editoriales permanentes

- No usar meta keywords: Google no las utiliza.
- No repetir de forma artificial “psicóloga”, “terapia” o nombres de alcaldías.
- No añadir FAQ, reseñas, calificaciones o resultados clínicos estructurados sin
  contenido visible, evidencia y revisión aplicable.
- Mantener iguales el nombre público, número, servicios y modalidad en el sitio y las
  plataformas externas.
