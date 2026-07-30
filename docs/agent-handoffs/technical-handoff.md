# Handoff técnico de Fase 1

> Nota posterior: ADR-002 autorizó Docker y Docker Compose como rutas adicionales de
> desarrollo y portabilidad. La exclusión indicada en esta entrega de Fase 1 se conserva
> como contexto histórico; Vercel permanece como destino de Production.
>
> Nota posterior: ADR-003 fijó HTTPS obligatorio,
> `https://www.psicologamayumikitahara.com` como URL canónica y la cadena Namecheap →
> Cloudflare → Vercel.

## Estado de entrega

La especificación técnica y los runbooks asignados están redactados. No se creó código
de aplicación, no se instalaron dependencias, no se configuraron proveedores y no se
desplegó. La propuesta sigue pendiente de aprobación integral de Fase 1.

## Archivos entregados

- [`03-technical-architecture.md`](../specs/03-technical-architecture.md)
- [`ADR-001-lightweight-vercel-architecture.md`](../decisions/ADR-001-lightweight-vercel-architecture.md)
- [`domain-cloudflare-vercel.md`](../runbooks/domain-cloudflare-vercel.md)
- [`whatsapp-business.md`](../runbooks/whatsapp-business.md)
- [`resend-email.md`](../runbooks/resend-email.md)
- [`local-https-certificates.md`](../runbooks/local-https-certificates.md)
- este handoff

## Decisiones propuestas

- Next.js App Router con JavaScript, React, Tailwind CSS y Yarn sobre Vercel.
- Sanity como CMS de contenido público e imágenes, sin leads; Studio embebido en
  `/admin` como opción recomendada, todavía sujeta a confirmación.
- `/` y `/aviso-de-privacidad` estáticos con ISR propuesto de 3,600 segundos.
- Deploy Hook de Vercel desde Sanity para publicar sin agregar una ruta de revalidación.
- `/api/contact` dinámico, `POST` y `no-store`, con límite de lectura real de 10 KB,
  origen/host estrictos, Zod, honeypot, defensa efímera, Turnstile y Resend.
- Cloudflare como DNS/proxy/CDN/control perimetral; Vercel como origen y runtime.
- Resend con remitente verificado y correo del prospecto sólo en `replyTo`.
- WhatsApp Business mediante `wa.me`; sin Platform, CRM o automatización en v1.
- HTTPS local obligatorio con CA local individual y certificados fuera de Git.
- Exclusión explícita en v1 de Django, PostgreSQL, Docker, Redis, Celery y Nginx por no
  existir una necesidad proporcional ni un flujo que justifique persistencia/operación.

## Supuestos

- La landing y la página legal cambian con poca frecuencia; una ventana ISR de una hora
  es aceptable como respaldo al Deploy Hook.
- Vercel conserva el deployment de producción anterior ante un build fallido.
- Cloudflare es el rate limit distribuido autoritativo; el contador del handler sólo es
  defensa adicional de mejor esfuerzo.
- El formulario no necesita adjuntos, HTML, agenda transaccional ni reintentos
  asíncronos.
- La persona operadora dispone de cuentas nominales y puede activar MFA donde los
  planes lo permitan.
- Los valores de proveedores, interfaces y flags se verificarán contra sus versiones
  fijadas durante Fase 2.

## Pendientes para que el integrador consolide

No se editó `open-items.md`. Conviene consolidar o confirmar allí:

- versiones fijadas de Node.js, Next.js, React, Tailwind, Yarn y Sanity;
- titular, responsables y ventana de migración del dominio;
- planes de Cloudflare, Vercel, Sanity y Resend;
- dataset Sanity público o privado y necesidad de token de sólo lectura;
- Studio embebido en `/admin` o redirección a Studio alojado;
- aceptación de ISR de 3,600 segundos y Deploy Hook de publicación;
- umbral, ventana y tamaño máximo del contador efímero en `/api/contact`;
- responsable, dominio remitente, `RESEND_FROM_EMAIL`, `LEADS_TO_EMAIL`, retención y
  SLA del buzón;
- número/titular de WhatsApp, horario, responsables y protocolo ante mensajes de crisis;
- mecanismo de consentimiento, parámetros UTM permitidos y funciones analíticas
  realmente aprobadas;
- protección contra acceso directo a Vercel y fuente confiable de IP;
- resolución del conflicto entre nonce CSP por respuesta y HTML estático/ISR: hashes
  estáticos aprobados o renderizado dinámico medido;
- revisión legal de encargados, retención y transferencias de Vercel, Sanity, Resend,
  Cloudflare y del buzón de correo;
- política HSTS, CAA y acceso administrativo según la revisión de seguridad.

## Riesgos y mitigaciones documentadas

| Riesgo | Tratamiento especificado |
| --- | --- |
| Caída de Sanity | servir última salida estática/ISR; no promover builds fallidos |
| Abuso distribuido | Cloudflare como control principal, Turnstile y defensa efímera |
| Bypass o spoofing | validar `Host`, `Origin`, protocolo, método, tipo, tamaño y campos |
| Exposición de datos en logs | allowlist mínima de metadatos; nunca payload/PII/tokens |
| Caída de Resend/Turnstile | fallo cerrado del formulario y alternativa WhatsApp |
| Duplicados | sin reintentos automáticos ilimitados; reintento explícito |
| Configuración DNS/TLS doble | valores exactos de Vercel, Full (strict), una sola regla canónica |
| Bypass directo de Vercel | Deployment Protection y control de origen sujetos a plan; prueba bloqueante |
| Nonce CSP frente a ISR | spike con versión fijada; elegir hashes estáticos o render dinámico |
| Correo no autenticado | dominio verificado, SPF/DKIM y DMARC coordinado |
| Certificados locales filtrados | rutas exactas bajo `/certs/local`, fuera de Git |
| Crecimiento de alcance | señales explícitas para un ADR nuevo antes de sumar backend/DB/colas |

## Verificación realizada

- Se contrastaron las rutas con `00-product-brief.md` y
  `01-functional-specification.md`.
- Se revisaron placeholders para que no contengan datos inventados.
- Se definieron caché y degradación por ruta.
- Se documentaron variables públicas/secretas y separación de entornos.
- Se incluyeron validación, pruebas, rollback y operación en cada runbook.
- Se verificaron los enlaces relativos de los siete archivos asignados.

## Recomendación para la revisión integral

Seguridad debe confirmar headers, CSP, bypass de caché, headers confiables de plataforma,
WAF y disponibilidad por plan. QA debe convertir los flujos, códigos, degradaciones y
runbooks en casos de aceptación. Producto debe confirmar que los valores editoriales y
operativos pendientes tienen dueño antes de aprobar Fase 2.
