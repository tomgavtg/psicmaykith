# Marketing, analítica y SEO

## Principios

La medición responde qué canal genera una solicitud, no quién la realizó ni por qué
busca atención. No se envían nombres, correos, teléfonos, mensajes, diagnósticos,
síntomas ni ningún dato clínico a plataformas publicitarias.

## SEO técnico

- Documento con `lang="es-MX"`, título y descripción únicos editables en Sanity.
- Canonical absoluto construido con `NEXT_PUBLIC_SITE_URL`.
- Open Graph con imagen aprobada; no usar datos o fotografías de pacientes.
- `/sitemap.xml` sólo incluye `/` y `/aviso-de-privacidad` publicables.
- `/robots.txt` permite contenido público y excluye `/admin` y `/api/`.
- `/admin` además usa `noindex, nofollow`; el aviso legal se indexa salvo decisión legal.
- Redirección permanente hacia una sola variante de dominio y una sola forma de URL.
- Favicon y manifest/íconos de marca con rutas confirmadas.
- JSON-LD `ProfessionalService` o `LocalBusiness` sólo si sus propiedades son reales.
  No añadir `aggregateRating`, reseñas, precios, horarios ni `sameAs` sin evidencia.
- Contenido renderizado en servidor, estructura semántica y enlaces rastreables.

## Datos estructurados propuestos

Campos permitidos una vez confirmados: `name`, `url`, `image`, `telephone`, `email`,
`address` o `areaServed`, `openingHoursSpecification`, `priceRange` y perfiles oficiales.
La selección final entre tipos se valida contra la naturaleza fiscal/comercial real.
No usar schema `Physician` por inferencia.

## UTMs y atribución

Se admiten `utm_source`, `utm_medium`, `utm_campaign`, `utm_content` y `utm_term`.
Las UTMs:

- se leen sólo para analítica consentida;
- nunca incluyen nombre, teléfono, diagnóstico, audiencia clínica ni texto libre;
- no se copian al cuerpo del correo salvo aprobación de privacidad;
- se eliminan de logs y errores;
- conservan nombres normalizados acordados en una matriz de campañas.

Ejemplo seguro: `utm_source=google&utm_medium=cpc&utm_campaign=consulta_mx_brand`.
Las páginas de destino no cambian afirmaciones profesionales según la UTM.

## Modelo de consentimiento

Estado inicial: `denied` para almacenamiento analítico y publicitario. Antes de una
acción afirmativa no se descargan GTM, Meta Pixel ni TikTok Pixel y no se disparan
requests a sus dominios. Rechazar es tan sencillo como aceptar y no afecta funciones.

La elección se conserva sólo durante el plazo aprobado y puede revocarse. El texto,
categorías, proveedor, plazo y evidencia de consentimiento requieren revisión legal.
Google Consent Mode, si se activa, debe evaluarse específicamente: no se supone que una
señal “denied” sin cookies equivalga por sí sola a no tratar datos.

## Eventos

| Evento | Disparador | Parámetros permitidos |
| --- | --- | --- |
| `view_landing` | primera vista consentida | ruta, referrer clasificado, UTMs saneadas |
| `click_whatsapp` | clic antes de abrir WhatsApp | ubicación del CTA, servicio slug |
| `form_start` | primera interacción | servicio slug opcional |
| `generate_lead` | confirmación 200 del servidor | método `form`, servicio slug |
| `click_email` | clic en correo | ubicación |

No se usan IDs persistentes propios para unir una persona entre plataformas. Un `slug`
de servicio debe ser genérico y no revelar condición de salud. No usar conversiones
mejoradas ni audiencias basadas en datos del formulario.

## Google Ads

GTM se instala tras consentimiento y publica los eventos aprobados. La conversión
principal puede mapear `generate_lead`; `click_whatsapp` será secundaria hasta validar
calidad. Activar linker/cookies sólo con base legal y consentimiento correspondiente.
Verificar anuncios, claims, ubicación, teléfonos y política de servicios de salud antes
de cada campaña.

## Meta y TikTok

Los píxeles cargan únicamente después del consentimiento de marketing. Usar eventos
genéricos y parámetros permitidos; no enviar contenido, hashes de PII, Advanced Matching
ni datos clínicos. Audiencias sensibles o inferidas quedan prohibidas. Click-to-WhatsApp
usa el mismo número comercial confirmado y mensaje aprobado.

## Rendimiento y calidad

Scripts publicitarios se cargan tarde, de forma condicional y nunca bloquean el LCP.
Se valida con red del navegador que no haya llamadas previas al consentimiento. Los
entornos Preview no envían datos a propiedades de producción.

## Métricas y gobierno

Reporte agregado por canal/campaña: sesiones consentidas, clics a WhatsApp, formularios
iniciados, leads generados y tasa de error. Acceso de mínimo privilegio, revisión
trimestral de etiquetas y registro de publicación de contenedores. El SLA comercial,
objetivos y responsable quedan `[POR DEFINIR]`.
