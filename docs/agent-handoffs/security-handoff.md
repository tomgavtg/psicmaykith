# Handoff de seguridad y privacidad

## Entrega

Se elaboraron:

- [especificación de seguridad y privacidad](../specs/04-security-and-privacy.md);
- [runbook de seguridad en Cloudflare](../runbooks/cloudflare-security.md).

No se creó código, no se instalaron dependencias y no se configuraron proveedores.

## Supuestos

- La audiencia inicial es adulta y se atiende principalmente en México.
- Aún no están definidos dominio, plan, responsables, países adicionales ni plazos.
- El formulario entrega correo mediante Resend sin base de datos de leads.
- Cloudflare está delante de Vercel sólo para el dominio proxied; sus controles no se
  extienden automáticamente a URLs `*.vercel.app`.

## Decisiones de seguridad

- El endpoint debe aplicar lista positiva completa: `POST`, JSON, 10 KB reales,
  `Host`/`Origin` exactos, Zod estricto, honeypot, límite, Turnstile servidor y salida
  codificada.
- Los logs de aplicación sólo admiten timestamp, request ID, resultado, status,
  latencia y versión; no payload, IP, tokens ni valores.
- La CSP debe usar nonce, desplegarse primero en Report-Only y tener políticas separadas
  para sitio público y Sanity Studio.
- Consentimiento controla la carga de marketing; que CSP permita un host no autoriza
  ejecutarlo.
- `/admin` debe combinar autenticación Sanity, MFA, Managed Challenge y geoprotección;
  Cloudflare Access es una capa recomendable sujeta a prueba/plan.
- La geoprotección no debe aplicarse a toda la landing.
- Bot Fight Mode, Super Bot Fight Mode y Bot Management son alternativas por plan, no
  capas simultáneas.

## Riesgos y bloqueos para integración

1. **Rate limit exacto:** Cloudflare Business permite el periodo solicitado de diez
   minutos; Free/Pro no. Un challenge fijo de una hora tampoco está disponible como se
   describió para Free/Pro/Business. Debe definirse plan o aceptar una desviación.
2. **Límite de aplicación:** un contador en memoria no es confiable en serverless. Un
   contador atómico con TTL añade proveedor/almacenamiento y requiere decisión de
   arquitectura y privacidad.
3. **Bypass del perímetro:** debe probarse y resolverse el acceso directo a Vercel. La
   protección completa puede depender del plan o de un diseño adicional.
4. **Retención real:** Resend y el buzón sí pueden conservar leads aunque la aplicación
   no tenga base de datos. Falta plazo, borrado, acceso y revisión de DPA/subencargados.
5. **Mensaje libre:** puede recibir salud sensible de forma accidental. Requiere
   decisión jurídica sobre finalidad, consentimiento, reducción del campo y borrado.
6. **Prueba de aceptación:** falta definir cómo acreditar versión del aviso sin crear
   una base de leads ni afirmar una garantía inexistente.
7. **CSP de terceros:** los hosts exactos de Sanity, Turnstile, GTM, Meta y TikTok deben
   medirse en staging. No se debe copiar la plantilla como producción.
8. **Administración:** faltan identidades, IP de recuperación, país de viaje, canal
   fuera de banda y responsables de incidentes.
9. **Legal:** aviso, derechos, transferencias, menores, cookies, incidentes y datos
   sensibles requieren revisión jurídica vigente en México.

## Valores por definir

El agente integrador debe trasladar estos puntos a `open-items.md`; este agente no lo
edita por propiedad de archivos:

- `ALLOWED_ORIGIN` de producción ya debe ser
  `https://www.psicologamayumikitahara.com`; falta confirmar titular y responsables;
- plan Cloudflare y plan/protección Vercel;
- países atendidos y allowlist administrativa con dueño/caducidad;
- `action` de Turnstile y hostnames de cada entorno;
- mecanismo de rate limit distribuido y tratamiento de IP;
- timeouts de cuerpo, Siteverify y Resend;
- plazo de logs, buzón, Resend y analítica;
- responsable, suplente, asesoría jurídica y contactos fuera de banda;
- canal de derechos/privacidad e identidad/domicilio de responsable;
- mecanismo para versión/aceptación del aviso;
- política para mensajes accidentales de salud y atención de menores;
- proveedores, DPA, subencargados y transferencias;
- periodicidad de rotación y revisión de accesos;
- hosts CSP observados en staging.

## Solicitudes a otros frentes

### Arquitectura

- Definir protección contra bypass de Vercel y fuente confiable de IP.
- Resolver el límite atómico sin contradecir el stack ligero ni la minimización.
- Confirmar cómo se aplica nonce CSP por ruta y una política distinta para `/admin`.
- Confirmar timeouts, caché de servicios válidos y aislamiento de previews.

### Producto/UX y contenido

- Mantener los avisos de no enviar datos clínicos junto a formulario y WhatsApp.
- Evaluar reemplazar `message` por una pregunta más acotada.
- No presentar envío como cita confirmada ni al sitio como atención de crisis.
- Definir consentimiento no invasivo y retiro fácil.

### QA

- Probar límites reales, replay/expiración Turnstile, no logging, CSP, consentimiento,
  bots verificados, `/admin`, incidentes y bypass directo.
- Usar datos sintéticos; nunca PII o información clínica real.

## Referencias verificadas

- [Turnstile Siteverify](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)
- [Cloudflare Rate Limiting Rules](https://developers.cloudflare.com/waf/rate-limiting-rules/)
- [parámetros de rate limiting](https://developers.cloudflare.com/waf/rate-limiting-rules/parameters/)
- [Cloudflare Managed Rules](https://developers.cloudflare.com/waf/managed-rules/)
- [Cloudflare bots](https://developers.cloudflare.com/bots/)
- [Cloudflare Access por rutas](https://developers.cloudflare.com/cloudflare-one/access-controls/policies/app-paths/)
- [Vercel Deployment Protection](https://vercel.com/docs/deployment-protection)
- [LFPDPPP vigente publicada por la Cámara de Diputados](https://www.diputados.gob.mx/LeyesBiblio/pdf/LFPDPPP.pdf)

Referencias consultadas el 27 de julio de 2026; las disponibilidades por plan deben
volver a comprobarse antes de contratar o configurar.
