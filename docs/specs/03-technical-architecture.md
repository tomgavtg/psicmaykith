# Arquitectura técnica

> **Enmienda de Fase 2 (2026-07-30):**
> [ADR-002](../decisions/ADR-002-docker-portability-with-vercel-production.md)
> autoriza Docker y Docker Compose como rutas adicionales de desarrollo y portabilidad.
> Vercel continúa siendo el destino de Production; no se agregan backend, base de datos,
> Redis, Celery ni Nginx.
>
> **Enmienda de HTTPS y dominio (2026-07-30):**
> [ADR-003](../decisions/ADR-003-https-domain-and-dns.md) exige HTTPS en toda ruta
> navegable, fija `https://www.psicologamayumikitahara.com` como URL canónica y
> mantiene la cadena Namecheap → Cloudflare → Vercel.

## Estado y alcance

Este documento especifica la arquitectura prevista para la primera versión. No autoriza
su implementación: el repositorio permanece en Fase 1 hasta recibir aprobación
explícita. Las versiones exactas de Node.js, Next.js, React, Tailwind CSS, Yarn y Sanity
quedan `[POR DEFINIR: fijar versiones compatibles y con soporte antes de Fase 2]`.

La solución debe publicar una landing rápida y autogestionable, recibir solicitudes de
contacto sin almacenarlas y reducir al mínimo la superficie operativa. No es un sistema
clínico, un expediente, un CRM ni un canal de emergencias.

## Atributos prioritarios

1. **Privacidad por diseño:** no debe existir base de datos de leads ni registro de sus
   campos; el contenido del formulario sólo transita hacia Resend.
2. **Rendimiento móvil:** las rutas públicas deben entregarse pre-renderizadas desde el
   CDN, con JavaScript cliente limitado a interacciones, consentimiento y formulario.
3. **Disponibilidad útil:** una caída de Sanity no debe retirar la última publicación
   válida; una caída de Turnstile o Resend debe conservar WhatsApp como alternativa.
4. **Administración acotada:** Sanity Studio debe estar disponible en `/admin` y exigir
   autenticación de Sanity, además de los controles perimetrales definidos por
   seguridad.
5. **Accesibilidad:** la implementación debe cumplir WCAG 2.2 AA y funcionar con
   contenido legible, anclas y enlace de WhatsApp aunque JavaScript no esté disponible.
6. **Operación simple:** Vercel gestiona ejecución, despliegue y TLS de origen;
   Cloudflare gestiona DNS, proxy, CDN y controles perimetrales.

## Vista de contexto

```text
Persona usuaria / buscador / navegador administrativo
                         |
                         v
              Cloudflare DNS + proxy + CDN
                WAF, bots, rate limiting
                         |
                         v
              Vercel + aplicación Next.js
        páginas estáticas/ISR | Studio | Route Handler
                 |                |            |
                 v                v            +--> Turnstile Siteverify
              Sanity CDN      Sanity Auth       +--> Resend --> buzón autorizado
                 |
                 +--> contenido e imágenes publicadas

Con consentimiento:
navegador --> GTM --> destinos de Google, Meta o TikTok
               (sólo eventos y parámetros sin datos personales o clínicos)
```

### Límites de confianza

- El navegador es una entrada no confiable. La validación cliente sólo mejora la
  experiencia; el servidor debe repetir todas las validaciones.
- Cloudflare es el primer control, pero el Route Handler no debe asumir que el proxy
  vuelve confiable una solicitud. Debe validar método, tipo, tamaño, `Origin`, `Host`,
  esquema, campos y Turnstile.
- Vercel y Resend procesan temporalmente una solicitud; no deben recibir más datos que
  los necesarios. Deben revisarse sus contratos, regiones, retención y acuerdos
  aplicables antes de publicar.
- Sanity contiene información pública del consultorio y configuración editorial, no
  leads ni expedientes. Los secretos no deben almacenarse en documentos del CMS.
- El navegador no debe escribir campos del formulario en URL, analítica,
  `localStorage`, `sessionStorage` ni cookies.

### Bypass del perímetro

Los controles de Cloudflare sólo aplican al tráfico que cruza su proxy. Antes de
publicar debe resolverse y probarse el acceso mediante dominios `*.vercel.app` o
cualquier ruta directa al origen:

- Vercel Deployment Protection debe estar activa para previews y aliases generados, de
  acuerdo con el plan contratado.
- `/api/contact` debe rechazar todo `Host` y `Origin` que no sean canónicos.
- `/admin` debe devolver una respuesta no reveladora en hostnames no aprobados, además
  de exigir autenticación de Sanity en el hostname canónico.
- Debe seleccionarse una protección de origen compatible con el plan: restricción
  nativa en Vercel, encabezado autenticado que Cloudflare sobrescriba y el servidor
  valide, o control equivalente. El secreto de esa protección nunca debe ser público.
- Si ninguna opción impide el bypass de los controles que se consideren obligatorios,
  la publicación debe detenerse. `Host`/`Origin` y Turnstile son defensa en profundidad,
  no prueba de que la solicitud atravesó Cloudflare.

La opción final y la fuente confiable de IP quedan
`[POR DEFINIR: protección de origen según planes de Cloudflare y Vercel]`. Hasta
resolverlo, ningún header de IP remitido por cliente debe considerarse auténtico.

## Componentes y responsabilidades

| Componente | Responsabilidad | No debe hacer |
| --- | --- | --- |
| Next.js con App Router | Renderizar páginas, metadata, robots, sitemap, Studio y endpoint de contacto | Conservar leads o exponer secretos al cliente |
| React y JavaScript | Interacciones accesibles y estados del formulario | Convertir todo el documento en renderizado cliente |
| Tailwind CSS | Estilos mobile-first con salida purgada | Añadir una biblioteca visual pesada sin necesidad |
| Sanity Content Lake/CDN | Contenido público editable e imágenes finales | Guardar datos de prospectos o información clínica |
| Sanity Studio en `/admin` | Edición autenticada de los schemas aprobados | Sustituir la autorización de Sanity con una contraseña propia |
| Route Handler `/api/contact` | Validar, controlar abuso y solicitar el envío a Resend | Aceptar otros métodos, persistir el payload o registrarlo |
| Cloudflare Turnstile | Señal anti-automatización validada en servidor | Ser el único control antiabuso |
| Resend | Entregar el mensaje al buzón autorizado | Usar el correo del prospecto como remitente |
| Vercel | Build, funciones, CDN de origen, variables y TLS de origen | Exponer previews como endpoint de leads de producción |
| Cloudflare | DNS autoritativo, proxy, TLS de borde, CDN, WAF y rate limit | Bloquear buscadores verificados o toda la landing por país |
| Gestor de consentimiento | Impedir analítica de marketing antes de consentimiento | Enviar campos o datos de salud a etiquetas |

La decisión se desarrolla en
[`ADR-001-lightweight-vercel-architecture.md`](../decisions/ADR-001-lightweight-vercel-architecture.md).

## Rutas exactas

| Ruta | Implementación prevista | Renderizado y caché | Acceso |
| --- | --- | --- | --- |
| `/` | `app/page.js` | HTML estático con ISR; CDN público | pública, indexable |
| `/aviso-de-privacidad` | `app/aviso-de-privacidad/page.js` | HTML estático con ISR; CDN público | pública, indexable |
| `/admin` | `app/admin/[[...tool]]/page.js` | Studio cliente; `no-store`, no indexable | autenticación Sanity y controles Cloudflare |
| `/api/contact` | `app/api/contact/route.js` | dinámico; sólo `POST`; `no-store` | público, validado y limitado |
| `/robots.txt` | `app/robots.js` | salida estática; caché CDN | pública |
| `/sitemap.xml` | `app/sitemap.js` | salida estática; caché CDN | pública |

Las anclas de la landing son `#sobre-mi`, `#servicios` y `#agendar`; no son rutas
adicionales. `/admin` y `/api/contact` deben excluirse de robots y sitemap. La
implementación no debe añadir blog, endpoints de leads alternos ni páginas visibles sin
actualizar primero las especificaciones.

## Estrategia de contenido, renderizado y caché

### Lectura de Sanity

- La lectura de contenido publicado debe ejecutarse en servidor. Sólo el identificador
  de proyecto, dataset y versión de API pueden ser públicos.
- Si el dataset es público, conviene leer mediante el CDN de Sanity sin token. Si es
  privado, `SANITY_API_READ_TOKEN` debe ser de sólo lectura, existir sólo en Vercel y no
  llevar prefijo `NEXT_PUBLIC_`.
- Las consultas deben seleccionar únicamente los campos requeridos y excluir borradores.
- Las imágenes finales deben usar el pipeline de Sanity y `next/image`, con dimensiones
  conocidas, `sizes` y texto alternativo editorial. Los placeholders locales sólo
  corresponden a preparación o contingencia editorial, no a fotografías de pacientes.

### Política propuesta

- `/` y `/aviso-de-privacidad` deben generarse estáticamente y usar ISR con ventana
  inicial propuesta de **3,600 segundos**, pendiente de validar la frecuencia editorial
  y límites del plan.
- Las lecturas deben etiquetarse por tipo de documento para que una futura invalidación
  sea selectiva. En v1, el mecanismo de publicación recomendado es un **Deploy Hook de
  Vercel llamado desde Sanity**; así no se agrega una ruta pública de revalidación ni un
  secreto de webhook al código.
- Si una revalidación de ISR falla, Vercel debe continuar sirviendo la versión
  previamente generada. Si un build iniciado por webhook no puede obtener contenido
  obligatorio, debe fallar sin promoverse y el despliegue de producción anterior debe
  permanecer activo.
- No debe reemplazarse contenido profesional faltante con texto inventado. La
  validación editorial debe impedir publicar documentos obligatorios incompletos; el
  build debe fallar con un mensaje sin datos sensibles cuando falte contenido crítico.
- `robots.txt` y `sitemap.xml` sólo deben reflejar el dominio canónico de
  `NEXT_PUBLIC_SITE_URL`. Deben regenerarse al desplegar.
- `/admin` y `/api/contact` deben enviar `Cache-Control: no-store`. Las respuestas del
  formulario tampoco deben almacenarse en Cloudflare.

La ventana de 3,600 segundos y el Deploy Hook son decisiones reversibles que deben
confirmarse en Fase 2. Si se requiere publicación casi inmediata sin redeploy, deberá
aprobarse una ruta autenticada de revalidación y actualizar el mapa del sitio antes de
implementarla.

### Compatibilidad de CSP con caché estática

Una CSP con nonce criptográfico distinto por respuesta suele obligar a renderizar HTML
dinámicamente, lo que entra en tensión con el objetivo de HTML estático/ISR. Antes de
implementar se debe hacer un spike con la versión fijada de Next.js y elegir una de dos
opciones aprobadas por seguridad:

1. conservar SSG/ISR y usar hashes reproducibles para scripts propios, más una política
   estricta que sólo permita cargadores de terceros después de consentimiento; o
2. usar nonce por respuesta y aceptar renderizado dinámico de las páginas afectadas,
   midiendo el impacto en caché, costo y Core Web Vitals.

No se debe declarar simultáneamente “HTML estático cacheable” y “nonce único por
respuesta” sin evidencia de que la plataforma reescribe de forma segura tanto header
como documento. La arquitectura prefiere SSG/ISR, pero la decisión de seguridad final
es `[POR DEFINIR: hashes estáticos o renderizado dinámico con nonce]`.

## Modelo de contenido y Studio

La aplicación debe consumir los schemas definidos en la especificación de contenido:

```text
siteSettings
professionalProfile
service
contactSettings
seoSettings
privacyNotice
imageAssetMetadata
```

Se propone Studio embebido en el mismo proyecto Next.js bajo `/admin` para conservar
una sola URL operativa. La persona responsable debe confirmar esta opción antes de
Fase 2; una redirección a Studio alojado requeriría documentar el destino y mantener
`/admin` protegido. El Studio debe:

- usar la autenticación y roles de Sanity;
- permitir sólo orígenes administrativos necesarios en CORS;
- excluirse de indexación;
- recibir `Managed Challenge` y geoprotección según la política aprobada;
- mantener al menos dos cuentas administrativas nominales si la operación lo permite,
  con MFA cuando el proveedor y el plan lo soporten;
- no contener llaves de Resend, Turnstile, Vercel ni Cloudflare.

## Flujo de publicación

1. Una persona autenticada modifica un borrador en Sanity.
2. Las validaciones del schema impiden publicar datos requeridos incompletos o formatos
   inválidos.
3. Al publicar, Sanity invoca el Deploy Hook secreto de Vercel.
4. Vercel construye las rutas estáticas con contenido publicado.
5. Las verificaciones automáticas de Fase 2 deben validar build, enlaces, accesibilidad
   básica y ausencia de secretos.
6. Sólo un build correcto se promueve a producción.
7. Cloudflare sirve el nuevo despliegue y conserva su política de seguridad.
8. Si falla la construcción, se conserva la versión de producción anterior y se alerta
   a la persona operadora; no se promueve contenido parcial.

El URL del Deploy Hook es secreto operativo y debe guardarse en la configuración segura
de Sanity, nunca en Git ni en un documento del Content Lake visible al cliente.

## Flujo de contacto

```text
formulario
  -> POST JSON <= 10 KB a /api/contact
  -> controles de método, Content-Type, Content-Length y lectura limitada
  -> validación estricta de Host y Origin
  -> Zod: campos conocidos, longitudes, formatos y normalización
  -> honeypot y reglas anti-automatización
  -> límite efímero de aplicación
  -> validación servidor de Turnstile
  -> Resend (from verificado, replyTo del prospecto)
  -> respuesta genérica no cacheable
```

### Contrato de entrada

El body debe ser un objeto JSON con una lista cerrada de campos equivalentes a: nombre,
correo, teléfono opcional, identificador de servicio, modalidad, tres preferencias de
día y hora, mensaje opcional, aceptación de privacidad, honeypot y token de Turnstile. Los nombres
y límites concretos del schema deben fijarse y probarse en Fase 2. No se deben aceptar
HTML, archivos, claves inesperadas ni valores de servicio/modalidad fuera de los
catálogos publicados.

El límite de 10 KB debe hacerse efectivo durante la lectura, no sólo confiar en
`Content-Length`, porque puede faltar o ser falso. Debe rechazarse antes de llamar a
Turnstile o Resend. `Origin`, `Host` y, tras el proxy confiable, el protocolo efectivo
deben coincidir exactamente con la configuración canónica. Las previews deben tener el
envío real deshabilitado por defecto.

### Antiabuso en dos capas

- Cloudflare debe aplicar el rate limit perimetral normado en seguridad: cinco
  solicitudes por IP cada diez minutos para `/api/contact`, con acción dependiente del
  plan aprobado.
- El Route Handler debe incorporar una protección adicional de mejor esfuerzo: contador
  acotado y con TTL en memoria efímera por instancia, indexado por un hash no reversible
  de la IP obtenida sólo de headers confiables de plataforma. No debe registrar el hash
  ni el payload.
- Ese contador local no es consistente entre instancias ni sustituye a Cloudflare. Su
  objeto es frenar ráfagas que alcancen una misma instancia sin añadir Redis ni otra
  persistencia. El tamaño máximo, ventana y umbral quedan
  `[POR DEFINIR: acordar límite operativo de aplicación en Fase 2]`.
- Turnstile debe validarse en el servidor con timeout corto y considerar expiración,
  hostname esperado y respuesta del proveedor. Un fallo de red debe fallar cerrado para
  el formulario y ofrecer WhatsApp, sin bloquear el contenido público.

### Correo, respuesta y logs

- `RESEND_FROM_EMAIL` debe pertenecer a un dominio verificado. El correo del prospecto
  sólo debe usarse como `replyTo`; nunca como `from`.
- El correo debe incluir únicamente los campos que la persona escribió y un aviso para
  el receptor de tratarlos como datos personales. No debe inferir diagnóstico.
- Estados previstos: `200`, `400`, `403`, `413`, `415`, `429`, `500` y `502`. Todos
  deben tener cuerpo pequeño, mensaje público neutral y `Cache-Control: no-store`.
- Los logs deben limitarse a código de resultado, timestamp, request ID generado,
  latencia y nombre interno de etapa. No deben incluir body, nombre, correo, teléfono,
  token Turnstile, IP, hash de IP ni respuesta completa de proveedores.
- No se debe incluir payload en herramientas de errores, traces, replay de sesión o
  analítica. Deben revisarse las funciones automáticas de observabilidad de Vercel.

## Analítica y consentimiento

El HTML inicial no debe solicitar scripts de GTM, Meta o TikTok. Después de una elección
de consentimiento válida, un cargador aislado puede inicializar los proveedores
aprobados. Sólo se emiten `view_landing`, `click_whatsapp`, `form_start`,
`generate_lead` y `click_email`, con identificadores de campaña permitidos y sin valores
de formulario, teléfonos, correos, texto libre, diagnósticos o síntomas.

Los UTMs pueden leerse para atribución, pero no deben incorporar parámetros arbitrarios
a correos ni almacenarse junto con campos personales. Debe definirse una lista cerrada
de parámetros y una política de consentimiento antes de Fase 2.

## Variables de entorno

| Variable | Exposición | Uso y validación |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | cliente y servidor | URL canónica absoluta, sin `/` final |
| `ALLOWED_ORIGIN` | servidor | origen exacto permitido para `/api/contact` |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | pública | identificador de proyecto, nunca una llave |
| `NEXT_PUBLIC_SANITY_DATASET` | pública | dataset aprobado; inicialmente `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | pública | fecha de API fijada, no `latest` |
| `SANITY_API_READ_TOKEN` | secreta, opcional | sólo lectura si el dataset es privado |
| `RESEND_API_KEY` | secreta | llamada servidor a Resend |
| `LEADS_TO_EMAIL` | secreta operativa | buzón receptor aprobado |
| `RESEND_FROM_EMAIL` | servidor | remitente del dominio verificado |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | pública | widget cliente asociado a host permitido |
| `TURNSTILE_SECRET_KEY` | secreta | validación servidor |
| `NEXT_PUBLIC_GTM_ID` | pública | carga sólo tras consentimiento |
| `NEXT_PUBLIC_META_PIXEL_ID` | pública | carga sólo tras consentimiento |
| `NEXT_PUBLIC_TIKTOK_PIXEL_ID` | pública | carga sólo tras consentimiento |

Las variables deben validarse al iniciar/build según su ámbito, sin imprimir valores
secretos. Desarrollo, preview y producción deben usar valores separados. Las llaves de
prueba de Turnstile y el modo sandbox de correo deben usarse sólo donde corresponda. El
dominio, buzones, IDs y valores reales permanecen
`[POR DEFINIR: confirmar valores con sus responsables]`.

## Estructura prevista de aplicación

Esta estructura es una especificación para Fase 2, no archivos que deban crearse ahora:

```text
/
├── app/
│   ├── admin/[[...tool]]/page.js
│   ├── api/contact/route.js
│   ├── aviso-de-privacidad/page.js
│   ├── layout.js
│   ├── page.js
│   ├── robots.js
│   └── sitemap.js
├── components/
│   ├── analytics/
│   ├── contact/
│   ├── layout/
│   └── sections/
├── lib/
│   ├── analytics/
│   ├── contact/
│   ├── env/
│   └── sanity/
├── sanity/
│   ├── schemas/
│   └── structure/
├── public/images/
│   ├── booking/
│   ├── brand/
│   ├── psychologist/
│   └── services/
├── certs/local/
├── docs/
├── sanity.config.js
├── sanity.cli.js
├── next.config.js
├── package.json
└── yarn.lock
```

La organización final puede ajustar nombres sin cambiar límites: validación de contacto
y acceso a proveedores deben vivir fuera de componentes visuales; schemas y consultas
de Sanity deben estar centralizados; no debe existir un módulo de persistencia de leads.

## Despliegue y entornos

### Desarrollo

- Debe usar datos ficticios claramente marcados o contenido editorial aprobado.
- HTTPS local es obligatorio y se documenta en
  [`local-https-certificates.md`](../runbooks/local-https-certificates.md).
- Ningún correo debe enviarse a un buzón real sin una prueba autorizada.
- Los archivos `.env*`, certificados y llaves deben permanecer fuera de Git.

### Preview

- Cada cambio debe producir un deployment aislado de Vercel.
- `/api/contact` debe estar desactivado o apuntar a un receptor de prueba; nunca debe
  aceptar `Origin` de producción con secretos de producción.
- Los previews deben llevar `noindex` y no cargarse en campañas.
- El Studio de preview debe usar proyecto/dataset y CORS explícitamente aprobados.
- Vercel Deployment Protection debe impedir que previews y aliases generados eviten el
  perímetro; el alcance exacto depende del plan.

### Producción

1. Fijar versiones y ejecutar build, lint y pruebas.
2. Configurar variables de producción en Vercel sin copiarlas al repositorio.
3. Crear el proyecto Sanity, schemas, roles, CORS y Deploy Hook aprobados.
4. Verificar dominio remitente y buzón receptor en Resend.
5. Configurar Turnstile para los hostnames canónicos.
6. Desplegar en Vercel y agregar los dominios.
7. Configurar en Cloudflare exactamente los DNS indicados por Vercel y activar proxy.
8. Aplicar TLS, WAF, rate limit, protección de `/admin` y métodos.
9. Cerrar y probar el bypass directo de Vercel y la fuente confiable de IP.
10. Validar rutas, headers, CSP/caché, consentimiento, formulario, correo y rollback.
11. Promover el dominio canónico sólo al aprobar el checklist de lanzamiento.

Los pasos operativos se detallan en los runbooks de
[dominio](../runbooks/domain-cloudflare-vercel.md),
[WhatsApp](../runbooks/whatsapp-business.md) y
[Resend](../runbooks/resend-email.md).

## Recuperación y operación

- **Contenido incorrecto:** corregir/publicar en Sanity y disparar un nuevo deploy; si
  el riesgo es material, hacer rollback al deployment válido anterior en Vercel.
- **Build fallido:** no promoverlo; revisar errores sin copiar secretos ni contenido de
  formularios.
- **Sanity caído:** mantener el último deployment/ISR válido y posponer publicaciones.
- **Resend o Turnstile caído:** formulario indisponible con mensaje neutral; mantener
  WhatsApp visible.
- **Abuso:** revisar Security Events, ajustar la regla específica de `/api/contact` y
  conservar acceso a bots verificados; no ampliar bloqueos geográficos a toda la web.
- **Llave expuesta:** revocar en el proveedor, crear otra, actualizar sólo los entornos
  afectados y volver a desplegar; después revisar logs y alcance.

Cada cambio de configuración material debe registrar responsable, fecha, motivo,
evidencia de prueba y procedimiento de reversión, sin incluir secretos.

## Decisiones pendientes

- Titular, responsables y ventana de migración del dominio; la variante canónica ya es
  `https://www.psicologamayumikitahara.com`.
- Versiones fijadas de runtime y dependencias.
- Dataset público o privado de Sanity.
- Studio embebido en `/admin` o redirección a Studio alojado.
- Ventana de ISR y uso final del Deploy Hook.
- Umbral y ventana del límite efímero del Route Handler.
- Planes y funciones realmente disponibles en Cloudflare, Vercel, Sanity y Resend.
- Protección contra bypass directo de Vercel y fuente confiable de IP.
- Compatibilidad entre CSP con nonce y estrategia SSG/ISR.
- Países atendidos y alcance administrativo de `/admin`.
- Buzón receptor, dominio remitente y política operativa de respuesta.
- Proveedor/mecanismo de consentimiento y destinos analíticos aprobados.
- Revisión legal de aviso, encargados, retención y transferencias aplicables.

Estas decisiones deben consolidarse en `docs/agent-handoffs/open-items.md` por el agente
integrador.
