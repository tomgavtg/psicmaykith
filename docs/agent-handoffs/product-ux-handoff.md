# Entrega de producto/UX

## Alcance entregado

- Brief, especificación funcional y UX/UI.
- SEO, analítica, consentimiento y runbooks publicitarios.
- Modelo de Sanity, matriz de contenidos y guía de imágenes.
- Base del repositorio, variables documentadas y asuntos pendientes.

## Decisiones

- WhatsApp es conversión primaria; formulario por correo es alternativa equivalente.
- Una landing con tres secciones y página legal independiente.
- Medición agregada, consentida y sin PII; ningún SDK publicitario antes de aceptar.
- Placeholders sólo para preparación; Sanity administra imágenes finales.
- Copy estructural con marcadores, sin inventar credenciales, servicios ni resultados.

## Supuestos y riesgos

- El público concreto, dominio, oferta, SLA, contenido legal y activos están pendientes.
- Un slug de servicio sólo es analíticamente seguro si no revela una condición sensible.
- La información de crisis indicada en el encargo se corroboró para Fase 1, pero debe
  volver a comprobarse antes del lanzamiento.
- La selección `ProfessionalService`/`LocalBusiness` requiere datos comerciales reales.

## Dependencias

Arquitectura define caché, Studio y despliegue; seguridad endurece endpoint y
consentimiento; QA transforma estos criterios en evidencia de aceptación.
