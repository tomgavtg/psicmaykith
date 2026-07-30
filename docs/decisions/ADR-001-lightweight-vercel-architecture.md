# ADR-001: Arquitectura ligera en Vercel

- **Estado:** aceptada; modificada parcialmente por
  [ADR-002](ADR-002-docker-portability-with-vercel-production.md)
- **Fecha:** 2026-07-27
- **Responsables:** producto y arquitectura
- **Decisión relacionada:** [`03-technical-architecture.md`](../specs/03-technical-architecture.md)

## Contexto

La primera versión es una landing con tres secciones, una página legal, un CMS y dos
rutas de contacto: WhatsApp y un formulario que envía correo. No administra citas, no
conserva leads y no procesa expedientes clínicos. La prioridad es publicar con poca
superficie operativa, buen rendimiento móvil, privacidad por diseño y degradación útil.

El stack solicitado es Next.js App Router con JavaScript, React, Tailwind CSS, Yarn,
Vercel, Sanity, Resend, Turnstile y Cloudflare. Se evaluó si convenía sumar una
plataforma backend tradicional y servicios de datos/colas.

## Decisión

En v1 se debe usar una arquitectura serverless y pre-renderizada:

- Next.js en Vercel para páginas, Sanity Studio embebido en `/admin` —sujeto a
  confirmación final— y Route Handler `/api/contact`.
- Sanity para contenido público e imágenes finales.
- Resend para entregar solicitudes a un buzón autorizado sin base de datos de leads.
- Cloudflare Turnstile para anti-automatización y Cloudflare como DNS, proxy, CDN y capa
  de seguridad frente a Vercel.
- HTML estático con ISR para `/` y `/aviso-de-privacidad`; funciones dinámicas sólo
  donde son necesarias.
- Yarn como gestor de paquetes y JavaScript como lenguaje de aplicación.

La decisión original no incluía Django, PostgreSQL, Docker, Redis, Celery ni Nginx.
ADR-002 autorizó posteriormente Docker sólo como ruta de desarrollo y portabilidad;
Vercel continúa siendo Production y las demás exclusiones permanecen.

## Razones

### Por qué Next.js y Vercel

Una misma aplicación cubre renderizado estático, rutas SEO, Studio y el endpoint
puntual. Vercel reduce la administración de servidores, renovaciones TLS, procesos y
despliegues, y conserva el deployment anterior cuando un nuevo build no se promueve.
Esto corresponde al bajo volumen y a la baja complejidad transaccional esperada.

### Por qué Sanity

Se necesita edición autenticada de perfil, servicios, contacto, SEO, privacidad e
imágenes sin crear una consola propia. Sanity ofrece modelo estructurado, publicación y
entrega por CDN. No debe convertirse en almacén de prospectos.

### Por qué Route Handler, Turnstile y Resend

El formulario sólo necesita validar una solicitud y enviarla por correo. Un Route
Handler evita operar un backend separado; Turnstile añade una señal anti-bot y Resend
resuelve entrega con dominio verificado. Cloudflare proporciona rate limiting
perimetral, y el handler añade una defensa efímera de mejor esfuerzo sin persistencia.

### Por qué Cloudflare delante de Vercel

Cloudflare centraliza DNS, protección DDoS, WAF, control de bots, desafíos y reglas
específicas para `/api/contact` y `/admin`. Debe conservar bots verificados y no aplicar
geobloqueo general a la landing.

## Exclusiones explícitas

| Tecnología excluida | Por qué no se usa en v1 | Señal para reconsiderarla |
| --- | --- | --- |
| Django | Duplicaría enrutamiento, validación, despliegue y mantenimiento para un único envío sin persistencia | API de negocio amplia, permisos propios o procesos clínicos aprobados |
| PostgreSQL | No existe un modelo transaccional y guardar leads contradiría la minimización de datos | Agenda/CRM con base legal, retención, derechos y controles definidos |
| Docker | Vercel y los servicios administrados ya fijan el runtime; contenedores añadirían build, registry, parches y operación | Requisito de portabilidad o runtime no soportado por Vercel |
| Redis | El rate limit autoritativo está en Cloudflare y no debe persistirse información de leads | Estado distribuido imprescindible con evaluación de privacidad y proveedor |
| Celery | No hay trabajos duraderos, reintentos masivos ni procesamiento asíncrono propio | Flujos autorizados de recordatorios o integración CRM que requieran cola |
| Nginx | Cloudflare y Vercel ya terminan TLS, sirven caché y enrutan; otro proxy aumenta configuración y parches | Infraestructura autogestionada fuera de Vercel con necesidad demostrada |

“No usar” no significa que estas tecnologías sean inadecuadas en general. Significa que
en v1 no resuelven una necesidad proporcional a su costo, y algunas facilitarían una
retención de datos que el producto prohíbe.

## Alternativas consideradas

### Sitio totalmente estático con enlace de correo

Tiene menor superficie, pero no satisface el formulario validado, Turnstile, entrega
controlada ni mensajes de estado requeridos.

### Backend y base de datos propios

Ofrecerían control transaccional y auditoría, pero introducirían información personal
persistente, migraciones, backups, retención, monitoreo y respuesta a incidentes sin un
caso de uso aprobado.

### Formulario de un tercero embebido

Reduce código, pero puede añadir tracking, estilos/accesibilidad limitados, retención no
controlada y envío de datos a un proveedor adicional. Sólo deberá evaluarse si Resend y
el Route Handler resultan inviables y tras revisión de privacidad.

### Sanity Studio alojado fuera de la aplicación

Es viable y puede reducir peso del proyecto público. Se propone Studio embebido para
cumplir la ruta `/admin` y mantener una operación coherente; la elección final sigue
`[POR DEFINIR: confirmar Studio embebido o redirección al Studio alojado]`.

## Consecuencias

### Positivas

- Menos servicios con estado, parches y respaldos.
- Contenido público rápido y disponible desde CDN.
- No se crea una base de datos de leads.
- Despliegues y rollback pequeños.
- El equipo puede concentrar pruebas en accesibilidad, privacidad, correo y abuso.

### Costos y riesgos

- El endpoint serverless depende de Vercel, Turnstile y Resend.
- Un contador en memoria no ofrece rate limit global; Cloudflare es el límite
  autoritativo.
- El flujo por correo no ofrece pipeline de CRM, asignación ni deduplicación.
- Los cambios de contenido pueden tardar hasta la ventana ISR o un redeploy.
- Cloudflare delante de Vercel requiere cuidar DNS, TLS, caché y diagnóstico en dos
  capas.
- Sanity, Resend y Vercel siguen siendo encargados/proveedores a revisar; “sin base de
  datos propia” no significa “sin tratamiento de datos”.

## Salvaguardas

- Validación estricta, límite de 10 KB, honeypot, Turnstile y rate limit en capas.
- `no-store` en `/api/contact` y `/admin`.
- Logs sin payload ni identificadores del prospecto.
- Previews sin envío real por defecto.
- Remitente verificado; el prospecto sólo se utiliza en `replyTo`.
- Versiones fijadas, mínima dependencia y revisión periódica.
- Plan de degradación a WhatsApp y rollback de deployment.
- Consentimiento previo para etiquetas de marketing.

## Criterios para revisar esta decisión

Debe abrirse un ADR nuevo, no editar retrospectivamente esta decisión, si se aprueba
alguno de estos cambios:

- agenda con disponibilidad o pagos;
- CRM, historial de conversaciones o automatización;
- almacenamiento, búsqueda o exportación de leads;
- múltiples profesionales con permisos y asignación;
- recordatorios o procesos asíncronos confiables;
- obligaciones de residencia/portabilidad incompatibles con proveedores actuales;
- volumen o límites que vuelvan insuficiente el Route Handler;
- salida de Vercel o necesidad demostrada de infraestructura propia.

Antes de incorporar una tecnología excluida debe existir un caso de uso aprobado,
análisis de privacidad/seguridad, responsable operativo, costo y plan de migración.
