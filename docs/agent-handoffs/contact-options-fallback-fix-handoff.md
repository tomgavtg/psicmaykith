# Entrega de corrección del catálogo de contacto

## Incidente

El endpoint respondió `400` con “Alguna de las opciones seleccionadas no es válida”
después de incorporar los campos `availableWeekdays` y `availableStartTimes`. El
documento de Contacto existente en Sanity todavía no contenía esos campos.

La lectura del servidor aplicaba un fallback de todo el objeto cuando faltaba cualquier
catálogo. Esto reemplazaba también los slugs reales de Servicios y las modalidades de
Sanity por valores locales, aunque la interfaz sí había enviado los valores publicados.

## Corrección

- Cada catálogo se combina de manera independiente.
- Servicios y modalidades publicados en Sanity se conservan.
- Sólo días u horas ausentes usan el contenido de respaldo.
- Se eliminan valores nulos o que no sean texto antes de validar la solicitud.
- Una prueba de regresión reproduce el documento antiguo de Sanity.

## Seguimiento

Conviene abrir el singleton Contacto en `/admin`, completar y publicar Días disponibles
y Horas de inicio disponibles. El fallback permite una migración sin interrumpir el
formulario, pero Sanity debe volver a ser la fuente editorial completa.

La consulta de producción del 4 de agosto de 2026 encontró únicamente dos servicios
activos: `Psicoterapia Psicoanalitica` con slug `2` y `Psicoterapia` con slug
`Psicoterapia`. Ninguno cumple el contrato de slugs y la landing requiere al menos tres
servicios. El API ahora aplica exactamente la misma regla que la landing: sólo usa
Sanity cuando existen al menos tres slugs válidos; en otro caso usa los tres servicios
de respaldo. El schema también impide publicar nuevos slugs con mayúsculas, longitud
insuficiente o caracteres fuera de minúsculas, números y guiones.
