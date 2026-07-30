# Entrega de implementación — Fase 2

## Estado

El 30 de julio de 2026 se recibió autorización explícita para continuar a Fase 2. Se
implementó una primera versión ejecutable y verificable. No se configuraron cuentas,
credenciales, dominio ni datos profesionales reales.

## Alcance entregado

- Next.js 16 con App Router, JavaScript, React, Tailwind CSS 4 y Yarn.
- Landing mobile-first con exactamente Sobre mí, Servicios y Agendar.
- CTA flotante de WhatsApp condicionado a un número válido y sin solaparse con el
  panel de consentimiento.
- Contenido provisional visible y marcado; ninguna credencial o dato profesional fue
  inventado.
- Schemas de Sanity y Studio embebido en `/admin`.
- `/api/contact` con origen/host, JSON y 10 KB, Zod estricto, honeypot, lista cerrada,
  límite efímero, Turnstile y Resend.
- Consentimiento previo para GTM, Meta y TikTok, con revocación desde el footer.
- Aviso de privacidad, robots, sitemap, metadata, Open Graph y JSON-LD condicionado a
  contenido real.
- CSP con nonce por solicitud y headers de seguridad mediante `proxy.js`.
- Estados seguros cuando Sanity, Turnstile, Resend o datos de contacto no están
  configurados.

## Decisiones

- Se fijó Node `>=22.12` porque Sanity 6 lo requiere; `.nvmrc` usa Node 22.23.1.
- Se eligió render dinámico para páginas HTML y CSP estricta con nonce. La lectura
  publicada de Sanity conserva caché de una hora.
- El modo inicial es `preview`. Indexación y sitemap requieren simultáneamente
  `SITE_MODE=production` y `CONTENT_APPROVED=true`.
- Sin claves de Turnstile el formulario queda deshabilitado; sin Resend devuelve un
  error neutral y no simula entregas.
- El rate limit de memoria es sólo defensa adicional. Cloudflare continúa siendo el
  control distribuido autoritativo requerido antes de producción.

## Verificación ejecutada

- `yarn lint`: cumple.
- `yarn test`: 11 pruebas aprobadas.
- `yarn build`: cumple con Next.js 16.2.12.
- Smoke test: `/`, `/admin`, `/aviso-de-privacidad`, `/robots.txt` y `/sitemap.xml`
  responden `200`.
- `/api/contact` responde `405` a `GET`, anuncia `Allow: POST` y rechaza con `403` un
  origen ajeno.
- Se observaron CSP con nonce, HSTS, `nosniff`, `DENY`, Referrer Policy,
  Permissions Policy, COOP y CORP.

## Riesgos y bloqueos restantes

- Sigue faltando todo el contenido profesional, contacto, imágenes y aprobación legal.
- Deben crearse y configurarse Sanity, Resend, Turnstile, Cloudflare y Vercel.
- El rate limit exacto, bypass de `*.vercel.app`, WAF y protección de `/admin` sólo se
  pueden validar con dominio y planes reales.
- Falta ejecutar accesibilidad manual, dispositivos Android/iOS, Lighthouse,
  consentimiento en red, entrega real controlada y checklist completo.
- Debe verificarse nuevamente la información de emergencia antes de publicar.

## Entrega operativa

No se desplegó ni se creó configuración externa. Para publicación deben resolverse los
asuntos abiertos y seguir los runbooks y `docs/qa/launch-checklist.md`.

Se agregó `docs/runbooks/environments-and-deployment.md` con el procedimiento detallado
para levantar Development, configurar Staging, preparar/promover Production y ejecutar
rollback. Incluye variantes de staging según plan, separación de variables, gates de
indexación y smoke tests.

Posteriormente se aprobó portabilidad con Docker mediante ADR-002. Se agregaron
`Dockerfile`, Compose para Development y Production-like, salida standalone y
`vercel.json`. Vercel sigue siendo Production; el contenedor no se desplegó ni se
autorizó self-hosting.
