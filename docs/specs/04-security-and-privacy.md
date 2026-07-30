# Especificación de seguridad y privacidad

## Estado y alcance

Este documento es normativo para la futura Fase 2. En la Fase 1 no se han creado
controles, cuentas ni reglas en proveedores. La publicación debe bloquearse hasta
validar esta especificación mediante el plan de QA y cerrar los valores
`[POR DEFINIR: ...]`.

El alcance comprende `/`, `/api/contact`, `/admin`, `/aviso-de-privacidad`, activos
públicos, Sanity, Resend, Turnstile, Cloudflare, Vercel y las etiquetas de marketing.
No sustituye asesoría jurídica. El aviso, las bases de tratamiento, los encargados,
las transferencias y el procedimiento para ejercer derechos deben ser revisados por
una persona especialista en privacidad en México.

## Objetivos y principios

- La aplicación debe solicitar sólo datos necesarios para responder una solicitud.
- El formulario no debe funcionar como expediente, canal terapéutico ni canal de
  emergencia.
- Los datos del lead no deben entrar en base de datos, Sanity, analítica, URL,
  `localStorage`, `sessionStorage`, herramientas de sesión ni logs de aplicación.
- Todo dato recibido debe tratarse como no confiable y codificarse como texto al salir.
- Los controles perimetrales deben complementar, no sustituir, la validación del
  servidor.
- Un fallo de Turnstile, Resend o de una dependencia debe cerrarse de forma segura y
  ofrecer una alternativa sin revelar detalles internos.
- Debe aplicarse mínimo privilegio, MFA, separación entre producción y preview, y
  rotación de secretos.
- Las etiquetas de Google, Meta y TikTok no deben descargarse ni ejecutarse antes del
  consentimiento correspondiente.

## Datos y minimización

### Inventario

| Dato | Necesidad | Destino permitido | Persistencia prevista |
| --- | --- | --- | --- |
| nombre | identificar la solicitud | correo a la profesional | transitoria en la app; copia en proveedores de correo |
| correo | responder y `replyTo` | Resend y buzón de destino | según retención aprobada |
| teléfono opcional | canal alternativo solicitado | cuerpo del correo | según retención aprobada |
| servicio, modalidad y horario | contextualizar disponibilidad | cuerpo del correo | según retención aprobada |
| mensaje opcional | duda breve no clínica | cuerpo del correo | según retención aprobada |
| aceptación y versión del aviso | acreditar el flujo presentado | correo o metadato mínimo `[POR DEFINIR: mecanismo legal y técnico]` | `[POR DEFINIR: plazo]` |
| token Turnstile | reducir abuso | Cloudflare Siteverify | vida técnica del proveedor |
| IP y metadatos de red | seguridad y entrega | Cloudflare, Vercel, Turnstile y proveedores de red | según plan y configuración |
| UTM y eventos sin PII | atribución agregada | analítica consentida | `[POR DEFINIR: plazo]` |

“Sin persistencia de leads” significa que la aplicación no crea una base de datos.
No significa retención cero: Resend y el buzón receptor pueden conservar el correo y
Cloudflare/Vercel pueden conservar metadatos de red. El aviso debe describir el flujo
real, no una promesa absoluta.

### Datos excluidos

El formulario no debe pedir diagnóstico, síntomas, motivo clínico detallado, historial,
medicación, fecha de nacimiento, identificaciones, documentos, datos financieros,
fotografías ni información de terceros. No debe admitir archivos adjuntos. El copy debe
decir: “No compartas información clínica o sensible en este formulario.”

Un mensaje libre puede contener información de salud aunque no se solicite. Debe
tratarse como potencialmente sensible: no analizarlo para publicidad, no incorporarlo
a analítica, limitar su longitud, restringir accesos y eliminarlo conforme al plazo
aprobado. La revisión jurídica debe decidir si el mensaje se conserva, se reduce a una
pregunta estructurada o requiere un consentimiento adicional.

### Retención y eliminación

- La aplicación debe descartar el cuerpo al terminar la solicitud y no debe incluirlo
  en logs, trazas, excepciones ni respuestas.
- El buzón receptor debe usar acceso individual con MFA, no una cuenta compartida, y
  debe aplicar un plazo de eliminación de `[POR DEFINIR: número de días]`.
- Debe definirse si Resend conserva contenido, eventos o supresiones, por cuánto tiempo
  y cómo se solicita su eliminación antes de contratarlo.
- Los logs operativos permitidos deben conservarse
  `[POR DEFINIR: plazo corto, por ejemplo 14 o 30 días]` y eliminarse automáticamente.
- Los datos de analítica deben usar la menor retención disponible compatible con el
  objetivo aprobado.
- Las copias de seguridad, exportaciones y dispositivos sincronizados con el buzón
  deben respetar el mismo ciclo o documentar su excepción.
- Las solicitudes de acceso, rectificación, cancelación, oposición, limitación o
  revocación deben dirigirse al canal `[POR DEFINIR: canal de privacidad]` y seguir un
  procedimiento revisado jurídicamente.

## Flujo y fronteras de confianza

```text
Navegador
  ├── GET / y /aviso-de-privacidad ── Cloudflare ── Vercel/Next.js ── Sanity
  ├── POST /api/contact ───────────── Cloudflare ── Vercel/Route Handler
  │                                                   ├── Turnstile Siteverify
  │                                                   └── Resend ── buzón receptor
  └── etiquetas consentidas ───────── Google / Meta / TikTok
```

Cada salto a un proveedor es una frontera de confianza. WhatsApp es una ruta externa
independiente; el aviso cercano al CTA debe prevenir el envío de información clínica y
explicar que se aplican las condiciones de esa plataforma.

## Activos y modelo de amenazas

Activos prioritarios: datos de contacto y mensajes, credenciales de Sanity y del buzón,
secretos de Resend/Turnstile, dominio y DNS, integridad del contenido profesional,
disponibilidad del formulario, consentimiento y reputación de la profesional.

| Amenaza | Escenario | Controles obligatorios | Riesgo residual |
| --- | --- | --- | --- |
| spam y agotamiento de correo | bot automatiza `POST` y consume cuota | honeypot, Turnstile servidor, rate limit perimetral y de aplicación, límites de tamaño, circuito operativo | bot distribuido o humano |
| bypass de Cloudflare | atacante llega a una URL/origen de Vercel | protección de deployments, dominio/host canónico, origen exacto, regla de origen acordada con arquitectura | control dependiente del plan |
| inyección | HTML, saltos de cabecera o claves inesperadas llegan al correo | Zod estricto, normalización, longitudes, texto plano/escape, `replyTo` validado, nunca interpolar headers | phishing visual en el cuerpo |
| CSRF y envío cross-site | otro sitio dispara solicitudes | sólo JSON, `Origin` y `Host` exactos, Fetch Metadata cuando exista, sin CORS amplio, Turnstile | clientes no navegador pueden falsificar headers |
| replay de Turnstile | reutilización de token | Siteverify servidor, token de un solo uso, validar `hostname` y `action`, timeout | indisponibilidad del proveedor |
| fuga por observabilidad | payload o PII aparece en logs/errores | lista positiva de metadatos, redacción, no captura de cuerpos, pruebas con canarios | logs propios del proveedor |
| XSS almacenado | contenido de Sanity o metadatos de imagen incluyen markup | renderizado seguro, esquema limitado, sanitización si se admite rich text, CSP con nonce | extensiones o tercero comprometido |
| cuenta CMS comprometida | se alteran credenciales, CTAs o aviso | MFA, roles mínimos, `/admin` protegido, auditoría y revisión editorial | ingeniería social |
| cadena de suministro | paquete o etiqueta de marketing comprometida | mínimo de dependencias, lockfile, revisión, CSP, consentimiento y parcheo | scripts de terceros autorizados |
| exfiltración por píxeles | PII o salud llega a analítica | eventos cerrados sin valores del formulario, sin conversiones mejoradas, auditoría de red | configuración posterior incorrecta |
| abuso del buzón | acceso interno o cuenta robada | MFA, acceso individual, retención, revisión de sesiones y reenvíos | dispositivos sincronizados |
| disponibilidad | DDoS, WAF falso positivo o caída de Resend | DDoS de proveedor, reglas graduales, alertas, rollback y WhatsApp alternativo | dependencia de SaaS |
| filtración de secretos | clave en repo, cliente o error | variables sólo servidor, escaneo, rotación, separación de entornos | acceso privilegiado al proveedor |
| rastreo/scraping | bots copian contacto o credenciales | bot management compatible con bots verificados; minimización pública | el contenido público es copiable |
| carga maliciosa en CMS | SVG/script o imagen con metadatos sensibles | tipos permitidos, rasterización, revisión de derechos/metadatos, sin fotos de pacientes | moderación humana |

## Contrato de seguridad de `/api/contact`

### Método, procedencia y transporte

1. Debe aceptar únicamente `POST`; cualquier otro método debe responder `405` con
   `Allow: POST`. Cloudflare debe bloquear además `TRACE`, `CONNECT`, `PUT`, `PATCH` y
   `DELETE`.
2. Debe exigir HTTPS en todos los ambientes navegables.
3. Debe comparar el `Host` normalizado, sin confiar en cabeceras arbitrarias de proxy,
   con `www.psicologamayumikitahara.com` en producción.
4. Debe exigir `Origin` y compararlo por igualdad exacta con `ALLOWED_ORIGIN`; no debe
   usar coincidencias por sufijo, comodines ni reflejar el origen recibido.
5. Si `Sec-Fetch-Site` está presente, debe admitir sólo `same-origin`. Su ausencia no
   debe reemplazar los demás controles.
6. No debe habilitar CORS para terceros. Si el navegador usa la misma procedencia, no
   se requiere preflight.
7. Debe aceptar sólo `application/json` con un `charset` compatible y responder `415`
   a otros tipos.

`Origin` y `Host` son defensa en profundidad, no autenticación: un cliente automatizado
puede falsificarlos. La protección contra abuso depende también de Turnstile, límites y
de impedir el bypass del perímetro.

### Tamaño y parseo

- Debe rechazar antes de parsear un `Content-Length` mayor a 10 KB, pero no confiar
  sólo en esa cabecera.
- La lectura real del stream debe detenerse al superar 10 KB, incluso si no existe
  `Content-Length` o es incorrecto, y responder `413`.
- Debe existir timeout de lectura y de llamadas salientes
  `[POR DEFINIR: valores según plataforma]`.
- Una falla de parseo debe responder `400`; nunca debe incluir el cuerpo ni el error
  interno en la respuesta o log.

### Esquema estricto

Zod debe rechazar claves desconocidas y aplicar normalización Unicode, `trim` y límites
antes de construir el correo. Lista propuesta para validar en implementación:

| Campo | Regla de seguridad |
| --- | --- |
| `name` | texto, 2–120 caracteres, sin controles |
| `email` | formato válido, máximo 254, usado sólo como `replyTo` |
| `phone` | opcional, 7–20 caracteres, caracteres telefónicos permitidos |
| `serviceId` | identificador de máximo 80 y perteneciente a la lista publicada |
| `modality` | enumeración cerrada definida por contenido aprobado |
| `preferredTime` | texto, máximo 120, sin controles |
| `message` | opcional, máximo 1,000, texto plano |
| `privacyAccepted` | debe ser literalmente `true` |
| `privacyNoticeVersion` | versión pública vigente, no texto libre |
| `website` | honeypot; debe existir vacío o según contrato acordado |
| `turnstileToken` | texto no vacío, máximo técnico de 2,048 caracteres |

Las reglas exactas de teléfono y modalidad deben permitir los valores legítimos
aprobados; no deben inferir un diagnóstico. Los valores que se inserten en HTML deben
escaparse. Conviene enviar también una versión de texto plano. El nombre, asunto y
cabeceras del remitente deben ser constantes; sólo un correo ya validado puede ocupar
`replyTo`.

Debe rechazarse de forma genérica el honeypot lleno. Se deben rechazar bytes nulos,
caracteres de control no necesarios y patrones inequívocos de automatización, como dos
o más URL con esquema en `message` o markup ejecutable. Estas heurísticas deben
medirse primero y no deben registrar el texto que las activó.

### Turnstile

- El servidor debe llamar a Siteverify; la validación del cliente por sí sola no cuenta.
- Debe validar `success`, el `hostname` canónico y el `action` acordado
  `[POR DEFINIR: action]`.
- El token expira a los cinco minutos y es de un solo uso; ante
  `timeout-or-duplicate` la interfaz debe reiniciar el widget.
- Si se reintenta Siteverify por un fallo de red, debe reutilizar un
  `idempotency_key` UUID para esa validación.
- El secreto nunca debe llegar al cliente. El sitio debe tener widgets y secretos
  separados para local, preview y producción.
- En producción se debe enviar `remoteip` sólo si su obtención es confiable y fue
  incluida en el análisis de privacidad. No se debe aceptar como auténtica una
  `CF-Connecting-IP` que pudo llegar por un bypass directo.
- Si Siteverify no responde o devuelve un resultado no verificable, el endpoint debe
  fallar cerrado y ofrecer WhatsApp.

Referencia: [validación de servidor de Turnstile](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/).

### Límites de frecuencia

Debe existir defensa en dos capas:

1. Cloudflare debe intentar cumplir cinco solicitudes por IP en diez minutos para
   `/api/contact`.
2. La aplicación debe aplicar un límite operativo independiente y un circuito contra
   ráfagas/costo antes de llamar a Resend.

El periodo exacto de diez minutos en Cloudflare depende del plan: a julio de 2026,
Business admite periodos de hasta diez minutos; Pro, hasta un minuto; Free, diez
segundos. Además, en Free/Pro/Business una acción de challenge usa throttling y no un
challenge fijo de una hora. Por ello “5/10 min + Managed Challenge durante una hora”
no debe declararse implementado sin verificar el plan y la interfaz vigentes.

En serverless, un contador en memoria no es global ni confiable. El límite de aplicación
requiere un contador atómico con TTL o un control nativo equivalente
`[POR DEFINIR: mecanismo compatible con la arquitectura y privacidad]`. Si usa una
clave derivada de IP, debe ser efímera, con HMAC y rotación, nunca la IP en claro, y no
debe incluirse en logs. Agregar un almacén modifica arquitectura, proveedores y aviso;
requiere aprobación. Hasta resolverlo, el control se considera riesgo abierto.

Referencia: [disponibilidad de Rate Limiting Rules](https://developers.cloudflare.com/waf/rate-limiting-rules/).

### Orden de procesamiento

El orden debe minimizar costo y exposición:

1. método, HTTPS, `Host`, `Origin`, Fetch Metadata y `Content-Type`;
2. límite real de 10 KB y JSON;
3. esquema Zod estricto y honeypot;
4. límite de aplicación;
5. Siteverify;
6. construcción segura del correo y llamada a Resend;
7. respuesta genérica y log permitido.

No se debe consultar Sanity por cada solicitud si eso crea una vía de agotamiento. La
lista válida de servicios debe estar disponible de forma acotada y con degradación
definida en arquitectura.

### Respuestas y caché

| Código | Uso |
| --- | --- |
| `200` | correo aceptado por el flujo |
| `400` | JSON/esquema/honeypot inválido |
| `403` | origen o Turnstile no válido |
| `405` | método no permitido |
| `413` | cuerpo mayor a 10 KB |
| `415` | tipo de contenido no admitido |
| `429` | límite excedido |
| `500` | error interno no atribuible al proveedor |
| `502` | fallo de Turnstile/Resend según contrato final |

Todas las respuestas deben usar `Cache-Control: no-store`, contenido genérico,
`requestId` generado o saneado y ningún eco de valores. “Aceptado” no debe afirmar que
se agendó una cita.

### Logging permitido

El log de aplicación sólo puede contener:

- timestamp;
- `requestId` generado por el servidor;
- ruta fija o nombre de operación;
- código de resultado categórico;
- status HTTP;
- latencia y proveedor fallido como categoría;
- versión de despliegue.

No puede contener IP, `Origin` completo arbitrario, query string, cookies, cabeceras,
token Turnstile, payload, nombre, correo, teléfono, servicio, horario o mensaje. Los
SDK de errores deben desactivar request bodies, breadcrumbs de campos y captura de
datos por defecto. Los logs de plataforma y seguridad deben revisarse por separado,
pues Cloudflare/Vercel pueden conservar IP y metadatos.

## Seguridad de `/admin` y Sanity

- Sanity debe exigir cuentas individuales, MFA y roles de mínimo privilegio. No se
  deben compartir contraseñas ni tokens.
- Los tokens de lectura/escritura deben limitar dataset, proyecto y entorno. Un token
  de servidor no debe exponerse con prefijo `NEXT_PUBLIC_`.
- `/admin` y descendientes deben llevar `noindex`, no aparecer en sitemap y estar
  protegidos por Managed Challenge y geoprotección según el runbook.
- Conviene añadir Cloudflare Access con una lista de identidades aprobadas si el plan y
  el flujo OAuth de Sanity son compatibles. Access no sustituye la autenticación de
  Sanity.
- Una allowlist administrativa debe ser una condición de la regla específica, no un
  “Allow IP” global que omita WAF y rate limits.
- Los cambios de aviso, contacto, credenciales, scripts/SEO y enlaces deben tener
  revisión editorial. Debe existir capacidad de revertir a una versión conocida.
- El contenido rico debe usar componentes permitidos; no debe aceptar HTML o scripts
  arbitrarios.

## Secretos, cuentas y proveedores

- `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY` y cualquier token privado de Sanity deben
  existir sólo como variables cifradas del entorno servidor.
- Las claves públicas pueden usar `NEXT_PUBLIC_`; una clave secreta nunca debe hacerlo.
- Producción y preview deben usar credenciales separadas. Los previews deben estar
  protegidos y no deben enviar correos reales ni cargar píxeles reales.
- Las cuentas de Cloudflare, Vercel, Sanity, Resend, dominio y correo deben tener MFA,
  recuperación protegida y al menos dos personas autorizadas
  `[POR DEFINIR: responsables]`.
- Los permisos deben revisarse trimestralmente y al retirar a una persona.
- Debe rotarse inmediatamente un secreto expuesto y, de forma programada,
  `[POR DEFINIR: periodicidad]`.
- No se deben incluir secretos en repositorio, tickets, capturas, CMS ni documentación.
- Antes de contratar, se deben revisar ubicación, subencargados, retención, borrado,
  transferencias, DPA y mecanismo de atención de incidentes de cada proveedor.

## Headers y CSP

### Baseline público

Las respuestas HTML públicas deben incluir:

```text
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-origin
```

HSTS `includeSubDomains` sólo debe activarse después de auditar todos los subdominios.
`preload` requiere una decisión separada y no debe añadirse hasta confirmar sus
consecuencias y requisitos. `/admin` puede requerir
`Cross-Origin-Opener-Policy: same-origin-allow-popups` por autenticación; debe probarse,
no relajarse globalmente.

La API debe añadir al menos `Cache-Control: no-store`,
`X-Content-Type-Options: nosniff` y una política de referencia restrictiva. Los activos
con hash pueden usar caché inmutable; HTML y aviso deben respetar la estrategia de
actualización.

### Política CSP

La CSP debe usar un nonce criptográfico diferente por respuesta y evitar
`'unsafe-eval'`, scripts inline sin nonce, `data:` en scripts, comodines amplios y
hosts `http:`. Base conceptual, que debe ajustarse con evidencia de red:

```text
default-src 'self';
base-uri 'self';
object-src 'none';
frame-ancestors 'none';
form-action 'self';
script-src 'self' 'nonce-[NONCE]' 'strict-dynamic'
  https://challenges.cloudflare.com
  https://www.googletagmanager.com
  https://connect.facebook.net
  https://analytics.tiktok.com;
script-src-attr 'none';
style-src 'self' 'nonce-[NONCE]';
img-src 'self' data: blob: https://cdn.sanity.io
  https://www.google-analytics.com https://www.facebook.com
  https://analytics.tiktok.com;
font-src 'self';
frame-src https://challenges.cloudflare.com;
connect-src 'self' https://challenges.cloudflare.com
  https://*.api.sanity.io https://*.sanity.io
  https://www.google-analytics.com https://analytics.google.com
  https://www.facebook.com https://analytics.tiktok.com;
worker-src 'self' blob:;
manifest-src 'self';
upgrade-insecure-requests;
```

Esto es una plantilla, no una cabecera lista para copiar. Los hosts finales de Sanity,
Turnstile y etiquetas deben obtenerse de una captura de red en staging y reducirse a
los realmente usados. `/admin` necesita una CSP separada compatible con Sanity Studio;
no se debe relajar la política pública para hacerlo funcionar.

La presencia de un host de marketing en CSP no constituye consentimiento ni autoriza
la carga. El gestor de consentimiento debe ser la única ruta que inserte GTM, Meta o
TikTok después de una elección afirmativa, y debe impedirlos en el estado inicial,
rechazo y retiro. Se debe desplegar primero `Content-Security-Policy-Report-Only`,
revisar reportes sin URL/PII, corregir y después aplicar la política. No se debe usar un
reporte CSP que envíe query strings con datos.

## Privacidad de analítica y campañas

- Antes del consentimiento sólo pueden operar elementos estrictamente necesarios.
- `view_landing`, `click_whatsapp`, `form_start`, `generate_lead` y `click_email` no
  deben incluir nombre, correo, teléfono, mensaje, servicio si revela una condición,
  ni ningún valor de campo.
- No se deben activar conversiones mejoradas, emparejamiento avanzado, grabación de
  sesiones ni audiencias basadas en datos de salud.
- Las UTM deben limitarse a claves conocidas, no persistir más de lo aprobado y nunca
  contener PII o información clínica. El formulario no debe copiarlas al correo sin
  revisión legal.
- Retirar consentimiento debe impedir eventos posteriores y eliminar identificadores
  cuando el proveedor y la ley lo requieran.
- El banner no debe usar patrones invasivos: aceptar y rechazar deben ser claros y
  equivalentes.

## Revisión jurídica previa a publicación

La ley aplicable debe confirmarse contra su texto vigente. Como referencia primaria,
la Cámara de Diputados publica la
[LFPDPPP vigente](https://www.diputados.gob.mx/LeyesBiblio/pdf/LFPDPPP.pdf), que
considera sensibles los datos relativos a salud.

La revisión debe confirmar:

- identidad y domicilio de la persona responsable;
- finalidades primarias y, si existieran, secundarias;
- categorías tratadas y tratamiento accidental de salud en mensaje libre;
- mecanismo y canal para derechos, revocación y limitación;
- transferencias nacionales/internacionales y encargados;
- consentimiento aplicable al formulario, cookies y datos sensibles;
- versión, fecha y prueba razonable de puesta a disposición del aviso;
- plazos de conservación y eliminación en correo/proveedores;
- atención de menores o exclusión explícita;
- procedimiento y obligaciones ante vulneraciones;
- textos de WhatsApp, crisis y alcance del servicio;
- contratos/DPA con Cloudflare, Vercel, Sanity, Resend, correo y analítica.

La casilla no debe venir marcada y debe enlazar a la versión vigente. No debe afirmarse
que una casilla genérica resuelve por sí sola todos los requisitos legales.

## Gestión de incidentes

### Clasificación

- **S1 crítica:** exposición de mensajes/contactos, dominio o cuenta administrativa
  tomada, envío malicioso desde el dominio.
- **S2 alta:** secreto expuesto, abuso sostenido del endpoint, alteración no autorizada
  de contenido o aviso.
- **S3 media:** WAF falso positivo generalizado, píxel antes de consentimiento, logging
  indebido sin evidencia de acceso externo.
- **S4 baja:** intento bloqueado o anomalía sin impacto.

### Respuesta mínima

1. Registrar hora, alcance, responsable y decisiones sin copiar PII a tickets.
2. Contener: desactivar temporalmente formulario/etiqueta afectada, revocar sesiones,
   rotar claves o activar reglas de emergencia. Mantener una ruta segura de contacto
   sólo si no está comprometida.
3. Preservar evidencia mínima con acceso restringido y cadena de custodia.
4. Determinar datos, titulares, proveedores y periodos afectados.
5. Consultar a la persona responsable y asesoría jurídica para notificaciones y
   obligaciones; no demorar por completar una investigación perfecta.
6. Erradicar, recuperar desde configuración conocida, validar controles y monitorear.
7. Documentar causa raíz y acciones con fecha.

Contactos y SLA quedan `[POR DEFINIR: responsable de incidentes, suplente, asesoría
jurídica y canales fuera de banda]`. El procedimiento operativo de Cloudflare se
detalla en [el runbook](../runbooks/cloudflare-security.md).

## Criterios de aprobación de seguridad

- Existe evidencia de que ningún payload o PII llega a logs o analítica.
- Se verifican método, tipo, límite real de 10 KB, esquema estricto, honeypot,
  procedencia, Siteverify, replay y límites.
- Las reglas Cloudflare se prueban primero en modo seguro y sin bloquear bots
  verificados en rutas públicas.
- Se prueba acceso y recuperación de `/admin`, incluida la protección contra bypass.
- CSP aplicada no produce violaciones necesarias y las etiquetas no cargan antes de
  consentimiento.
- Los previews están protegidos y aislados de producción.
- Retención, derechos, proveedores, transferencias y aviso cuentan con aprobación
  jurídica documentada.
- Existe un ejercicio de incidente y rollback.

## Supuestos y decisiones abiertas

- Se asume audiencia adulta en México; debe confirmarse.
- El dominio canónico es `www.psicologamayumikitahara.com`; la lista de países
  autorizados aún debe confirmarse.
- Se recomienda Cloudflare Business si el requisito exacto de cinco solicitudes por
  diez minutos debe cumplirse en el perímetro con la disponibilidad documentada en
  julio de 2026; la contratación queda pendiente.
- La defensa contra acceso directo a Vercel y el contador distribuido de aplicación
  requieren decisión conjunta con arquitectura.
- El mensaje libre, retención de correo y demostración de aceptación requieren
  revisión jurídica.
