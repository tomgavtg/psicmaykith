# Entrega de textos de la aplicación

## Alcance

Se adaptó `docs/copys/propuesta-sitio-web-psicoterapia.md` a los campos existentes de la
aplicación y a la landing de tres secciones. La fuente editorial consolidada quedó en
`docs/content/application-copy.md` y los mismos borradores se incorporaron al contenido
local de respaldo para permitir su revisión visual.

## Decisiones

- Se conservó el tono cálido, directo y no diagnóstico de la propuesta.
- Se cambió el H1 para comunicar primero la propuesta de valor; el nombre profesional
  sigue siendo un dato independiente y pendiente.
- Se incorporaron situaciones de identificación y una explicación breve del enfoque
  dentro de `#sobre-mi`, sin crear una cuarta sección de la landing.
- Los tres servicios se presentan como propuesta y la aplicación permanece en modo
  demostración hasta que la profesional los confirme en Sanity.
- No se publicaron duraciones, honorarios, horarios, cédula, formación ni biografía
  personal porque no existe evidencia aprobada en el repositorio.

## Cambios técnicos

- `professionalProfile` incorpora `heroTitle` y `validationItems`.
- La consulta de Sanity recupera ambos campos.
- La verificación de contenido publicable exige que ambos campos estén completos; un
  documento anterior sin ellos conserva la demostración en `noindex`.
- El Hero muestra el enfoque y las situaciones de identificación con jerarquía
  semántica y sin alterar los tres destinos principales de navegación.
- Se actualizaron textos de Servicios, Agenda, SEO y contenido de respaldo.

## Riesgos y pendientes

- Los documentos de Sanity creados antes de este cambio deben completar los dos campos
  nuevos para pasar la validación al volver a editarlos.
- La propuesta de atención a adolescentes requiere confirmar que forma parte de la
  práctica y revisar el encuadre aplicable a menores.
- El contenido de fallback no debe habilitarse como contenido definitivo: se mantiene
  `isPlaceholder: true` y debe seguir en `noindex`.
- FAQ, blog y recursos requieren una decisión de alcance y modelado editorial antes de
  implementarse.
