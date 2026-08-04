# Entrega: optimización de marketing y preparación de Production

Fecha: 4 de agosto de 2026.

## Alcance entregado

- Se auditó y actualizó el dataset `production` de Sanity mediante una transacción.
- Se normalizaron los tres servicios y sus slugs; las duraciones quedaron en 50, 50 y
  70 minutos.
- Se actualizaron copy, horarios de preferencia, área de atención, mensajes de
  seguridad, SEO y fotografía principal/OG.
- El aviso previamente marcado como aprobado se movió a `legalReview` porque sólo
  contenía la identidad `Mk` y un bloque de contenido.
- Se añadió un gate que revisa contenido profesional y legal antes de habilitar robots,
  sitemap, JSON-LD e indexación.
- Se generó imagen Open Graph de respaldo y metadata para Open Graph/Twitter.
- Se añadió JSON-LD `WebSite` y `ProfessionalService` con catálogo de servicios, sin
  reseñas, precios, horarios ni credenciales inventadas.
- Se implementó consentimiento independiente para analítica y marketing, migración
  conservadora del consentimiento anterior y revocación desde la interfaz.
- Se implementaron Google Consent Mode v2, carga condicional de GTM/Meta/TikTok,
  atribución UTM saneada y eventos con parámetros permitidos.
- Se añadieron scripts repetibles de preparación, aplicación y verificación de Sanity.

## Decisiones

- No se transmite a analítica el servicio seleccionado: en psicoterapia puede revelar
  información sensible o permitir inferencias innecesarias.
- Se descarta `utm_term` y no se guardan identificadores publicitarios manualmente.
- `ad_personalization` permanece en `denied`; no se habilitan conversiones mejoradas,
  matching avanzado, CAPI ni audiencias de salud.
- La preferencia expira a los 180 días. Es un valor operativo sujeto a revisión legal.
- La carga directa de Meta/TikTok y su carga por GTM son alternativas; no deben
  habilitarse ambas para el mismo píxel.
- Los honorarios no confirmados no se inventaron. La migración retiró el valor del
  servicio de pareja y no introdujo precios nuevos.

## Cambios externos realizados

La transacción principal de Sanity Production fue `DvfO6FWkGERd0VkSPs4mjj`; las
limpiezas idempotentes fueron `yabMzAkPecmhFpnOGkTE7A` y
`yabMzAkPecmhFpnOGkUM6H`. La incorporación de nombre completo y cédula se realizó en
`10uTorhZQdrO7efa5wlvXV`; los canales ARCO se guardaron en
`yabMzAkPecmhFpnOGkW2eD` y el aviso integral `v1.0` se publicó en
`yabMzAkPecmhFpnOGkWcKx`. Actualizaron
`siteSettings`, `professionalProfile`, `contactSettings`, `seoSettings`, tres
documentos `service` y el aviso de privacidad. La verificación posterior confirmó
fotografía, SEO, 5 días, 17 horas iniciales y los tres servicios.

## Estado del gate de publicación

La cédula `10630199`, la identidad, domicilio, canales ARCO y aviso integral `v1.0`
quedaron resueltos. La verificación posterior reporta `publicationIssues: []`.

Los controles de Vercel deben conservarse en Preview hasta aprobar el deployment y el
checklist; al configurar `SITE_MODE=production` y `CONTENT_APPROVED=true`, robots y
sitemap se habilitan automáticamente.

## Riesgos y pendientes

- Confirmar formación publicada, derecho de uso de `PhotoMK1.jpeg`, modalidades,
  población adolescente y horarios reales.
- Mantener revisados los inventarios, contratos, retención y cambios de proveedores;
  los avisos clínicos y consentimientos para pacientes siguen separados y en borrador.
- Crear y configurar IDs por ambiente; ejecutar las pruebas de red, Tag Assistant y
  Pixel Helpers documentadas en los runbooks.
- Ejecutar QA móvil, accesibilidad, Lighthouse, formulario real controlado y checklist
  completo antes de habilitar indexación.
- No se hizo commit, push ni deployment de Vercel como parte de esta entrega.
