# Modelo de contenido

## Reglas generales

Sanity es la fuente editorial de producción. Cada documento tiene validaciones,
descripciones para la editora, preview y campos de auditoría nativos. Los textos se
limitan por longitud, los enlaces se restringen a esquemas seguros y sólo se publica
contenido completo. Los placeholders locales nunca sustituyen datos reales.

## `siteSettings` — singleton

| Campo | Tipo | Regla |
| --- | --- | --- |
| `siteName` | string | requerido, nombre confirmado |
| `headerName` | string | requerido, versión corta aprobada |
| `navigationLabels` | object | tres etiquetas, destinos fijos |
| `globalNotice` | text | aviso no-emergencia |
| `crisisNotice` | text | texto verificado antes de publicar |
| `footerText` | text | sin claims ni datos no confirmados |
| `consentCopy` | object | aceptar, rechazar, configurar, categorías |
| `locale` | string | fijo `es-MX` en v1 |

## `professionalProfile` — singleton

| Campo | Tipo | Regla |
| --- | --- | --- |
| `fullName` | string | requerido |
| `heroTitle` | string | requerido, mensaje principal sin promesas |
| `headline` | string | requerido, claro y comprobable |
| `shortBio` | text | requerido, máximo 55 palabras |
| `portrait` | image | hotspot, metadata y alt requeridos |
| `approach` | text | enfoque real, sin promesas |
| `validationItems` | array string | entre tres y cinco situaciones, sin diagnosticar |
| `licenseNumber` | string | opcional visualmente, verificado |
| `education` | array object | institución, grado, año opcional |
| `certifications` | array object | máximo según diseño, evidencia interna |
| `highlights` | array string | máximo tres, verificables |

## `service` — múltiples documentos

| Campo | Tipo | Regla |
| --- | --- | --- |
| `name` | string | requerido |
| `slug` | slug | genérico, único y no sensible |
| `shortDescription` | text | requerido, límite editorial |
| `modality` | array enum | sólo `En línea` en la versión vigente |
| `durationMinutes` | number | requerido; 50 o 70 según el servicio |
| `fee` | object | requerido: cantidad positiva, moneda MXN, nota |
| `bookingUrl` | URL HTTPS | opcional hasta activación; sólo Google Calendar |
| `availabilityNote` | string | opcional, no sustituye agenda |
| `image` | image | opcional, metadata/alt |
| `order` | number | único o criterio de desempate |
| `isActive` | boolean | sólo activos aparecen |

Entre tres y cuatro servicios activos en la landing. No se modelan diagnósticos de una
persona ni se capturan expedientes.

## `contactSettings` — singleton

| Campo | Tipo | Regla |
| --- | --- | --- |
| `email` | email | correo público aprobado |
| `phoneDisplay` | string | formato legible |
| `whatsappNumber` | string | sólo dígitos y código de país; para México, `52` + 10 dígitos, sin `+` ni el antiguo prefijo `1` |
| `whatsappMessage` | text | mensaje breve sin datos sensibles |
| `locationName` | string | zona aprobada, evita domicilio si no es público |
| `address` | object | opcional, sólo datos publicables |
| `serviceAreas` | array string | zonas reales |
| `modalities` | array string | temporalmente sólo `En línea` |
| `availableWeekdays` | array string | días ofrecidos como preferencia, no como reserva |
| `availableStartTimes` | array string | horas `HH:mm`; la interfaz calcula el fin según duración |
| `bookingPolicy` | object | ventana de cancelación, reprogramación y resolución de cancelaciones |
| `responseTimeCopy` | string | sólo con SLA operativo |
| `successMessage` | text | sin confirmar cita |
| `errorMessage` | text | ofrece alternativa |

Las tres preferencias de día/hora son datos transitorios del formulario y no forman
parte del contenido clínico. El servidor exige tres combinaciones distintas, valida
cada valor contra la configuración publicada y las incluye sólo en el correo de
solicitud. Ninguna selección confirma una cita.

Cuando un servicio tiene `bookingUrl`, su CTA abre la página pública de Google Calendar
en una pestaña nueva. El enlace no se embebe al cargar la landing, para no contactar al
tercero antes de una acción explícita. El pago y la creación del evento ocurren fuera
de la aplicación mediante Google Calendar y Stripe.

El motivo de consulta es un campo transaccional obligatorio de máximo 500 caracteres;
no se almacena en Sanity ni se envía a analítica. Por poder revelar información de
salud, requiere consentimiento expreso separado y una versión vigente del aviso que
describa su tratamiento.

## `seoSettings` — singleton

`metaTitle`, `metaDescription`, `canonicalOverride` excepcional, `ogImage`,
`ogImageAlt`, `robots` controlado, `businessType`, `areaServed`, perfiles oficiales y
campos JSON-LD permitidos. Las validaciones impiden ratings, claims o URLs inseguras.

## `privacyNotice` — singleton versionado

| Campo | Tipo | Regla |
| --- | --- | --- |
| `title` | string | requerido |
| `status` | enum | `draft`, `legalReview`, `approved` |
| `effectiveDate` | date | requerida al aprobar |
| `controllerIdentity` | text | responsable confirmado |
| `content` | portable text | finalidades, transferencias, ARCO, contacto |
| `contactEmail` | email | requerido al aprobar |
| `versionLabel` | string | permite trazabilidad |

La aplicación sólo muestra una versión `approved`. El contenido inicial se etiqueta
“Borrador sujeto a revisión legal en México”.

## `imageAssetMetadata` — documento referenciable

`asset`, `altText`, `caption` opcional, `credit`, `rightsHolder`,
`permissionStatus`, `permissionEvidenceReference`, `usageScope`, `expiryDate` opcional,
`containsPeople` y `reviewedAt`. Está prohibido cargar fotos de pacientes o información
clínica.

## Contenido de interfaz

Los labels estables y mensajes técnicos seguros pueden vivir en código para evitar una
configuración frágil; nombre, perfil, servicios, contacto, SEO, privacidad y mensajes de
resultado viven en Sanity. Las opciones enviadas al servidor se validan contra una lista
cerrada derivada de contenido publicado o configuración versionada.

## Roles y publicación

Rol editor para contenido; rol administrador sólo para schema y usuarios. La publicación
requiere preview, revisión de claims y verificación de campos legales. Los cambios de
dominio, scripts, IDs o secretos nunca se editan desde Sanity.
