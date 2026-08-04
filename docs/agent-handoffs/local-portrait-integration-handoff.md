# Entrega de integración del retrato local

## Alcance

Se revisaron las fotografías `public/images/psychologist/PhotoMK.jpeg` y
`public/images/psychologist/PhotoMK1.jpeg`, ambas JPEG verticales de 960 × 1280 px.
`PhotoMK1.jpeg` se integró como retrato de respaldo del Hero porque ofrece un encuadre
más cercano para el contenedor 4:5. La otra fotografía se conserva como alternativa y
no se reutiliza artificialmente en Servicios.

## Decisiones y supuestos

- El texto alternativo describe únicamente el contenido visible y no asigna nombre,
  credenciales ni cualidades subjetivas.
- El archivo local permite revisar el diseño, pero Sanity continúa siendo la fuente de
  imágenes finales de producción.
- Una imagen publicada desde Sanity tiene prioridad sobre el respaldo local.
- Si el documento de Sanity no contiene retrato, la aplicación conserva el estado de
  demostración y `noindex` aunque muestre el archivo local para revisión.

## Riesgos y pendientes

- Falta confirmar que la profesional tiene derecho y autorización para publicar ambas
  fotografías, así como el alcance y vigencia de ese permiso.
- Falta aprobar el retrato seleccionado y su texto alternativo.
- Para producción conviene exportar una variante WebP o AVIF optimizada después de
  revisar el recorte final, o cargar el original aprobado en Sanity para que entregue
  variantes responsivas.
