# Entrega de portada y preguntas frecuentes

Fecha: 10 de agosto de 2026

## Alcance implementado

- Se ajustó la portada con una jerarquía editorial más clara: título principal,
  título secundario, descripción breve, credenciales, una sola etiqueta de
  atención profesional y dos llamadas a la acción.
- Se eliminaron de la portada los dos paneles inferiores indicados en las
  observaciones: “Tal vez te resulte familiar” y “Enfoque terapéutico”.
- Se conservó la fotografía publicada, sin cambiar el archivo local ni el
  recurso de imagen administrado desde Sanity.
- Se añadió “Preguntas frecuentes” a la navegación de escritorio y a un menú
  móvil accesible.
- La página de preguntas frecuentes se organizó en cuatro categorías, con
  navegación interna, acordeones nativos, contador por categoría y un cierre
  orientado a agendar o solicitar información por WhatsApp.
- Se añadieron 26 respuestas editoriales. Se cubrieron los temas del documento
  de observaciones y se ajustó el lenguaje para evitar diagnósticos, promesas,
  afirmaciones médicas no sustentadas y servicios que no se ofrecen.
- Se incorporó el tipo de contenido `faqItem` a Sanity para permitir ajustes
  editoriales posteriores sin perder las respuestas locales de respaldo.
- El contenido visible y el marcado `FAQPage` se generan desde la misma fuente
  para evitar discrepancias.

## Decisiones

- No se utilizó “especialista” como credencial en el título secundario porque no
  existe una especialidad verificada registrada en el contenido del proyecto.
  Se utilizó una formulación descriptiva del enfoque profesional.
- “Atención profesional” se presenta como distintivo informativo y no como
  botón, ya que no ejecuta una acción.
- Las referencias a ansiedad y depresión indican que la psicoterapia puede ser
  parte del abordaje y que no sustituye la atención médica indicada.
- Los síntomas físicos se remiten primero a valoración profesional de salud.
- La atención en crisis distingue expresamente el sitio de un servicio de
  emergencia e incluye 911 y Línea de la Vida.

## Verificación

- `yarn lint`: correcto.
- `yarn test`: 14 archivos y 65 pruebas correctas.
- `yarn next build --webpack`: compilación de producción correcta.
- La salida HTML contiene 26 preguntas agrupadas en cuatro secciones y no
  contiene los dos paneles retirados.
- `next build` con Turbopack presenta en este entorno un error interno al
  procesar CSS de `@portabletext/plugin-table`; la misma aplicación compila
  correctamente con Webpack. El fallo no se origina en estos cambios.

## Publicación en Sanity

El 10 de agosto de 2026 se sincronizó el dataset `production` con:

- Los nuevos títulos, descripción breve y etiqueta profesional del documento
  `professionalProfile`.
- Las 26 preguntas frecuentes activas, organizadas en cuatro categorías.
- La misma referencia de imagen que ya utilizaba el retrato profesional. La
  sincronización no modificó la fotografía.

La operación se implementó como una transacción idempotente en
`scripts/sanity/sync-faq-hero-content.js` y se verificó mediante una consulta de
lectura posterior.
