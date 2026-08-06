# Landing de consulta psicológica

Landing de una sola página para una profesional de psicología en México. El objetivo es
facilitar contactos de calidad mediante WhatsApp o correo, con una experiencia serena,
rápida, accesible y respetuosa de la privacidad.

## Estado

**Fase 2 — candidato técnico de producción.** La aplicación Next.js, la landing, el
Studio de Sanity, el formulario protegido, metadata social, datos estructurados, SEO,
consentimiento por categorías y eventos de marketing con lista permitida están
implementados. Sanity Production ya contiene los tres servicios, horarios, fotografía
y copy optimizado. La cédula `10630199`, el nombre profesional completo y el aviso de
privacidad integral `v1.0` aprobado están en Sanity Production. El gate de contenido no
reporta bloqueos; `SITE_MODE` y `CONTENT_APPROVED` deben habilitarse únicamente sobre el
deployment aprobado después de completar QA y variables de Production.

El flujo de cita permite seleccionar un servicio, modalidad y tres combinaciones de día
y horario preferidas; envía una solicitud por correo y nunca presenta la cita como confirmada. Los
CTA de WhatsApp usan el número empresarial confirmado `+52 56 3955 1234`, almacenado
en Sanity como `525639551234`. El antiguo prefijo móvil mexicano `1` no forma parte del
enlace `wa.me`. El correo empresarial público confirmado es
`contacto@psicologamayumikitahara.com`.

## Desarrollo local con HTTPS

Requiere Node.js 22.12 o posterior y Yarn 1.22.

Si `nvm` no está instalado en Linux o WSL:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.6/install.sh | bash
source "$HOME/.bashrc"
command -v nvm
nvm install
nvm use
corepack enable
corepack prepare yarn@1.22.22 --activate
node --version
yarn --version
```

El resultado esperado es Node `v22.23.1` y Yarn `1.22.22`. Si `command -v nvm` no
muestra `nvm`, cerrar y abrir la terminal antes de continuar. No usar el Node 18
instalado por el sistema.

El desarrollo local exige un certificado confiable. Instalar `mkcert` siguiendo sus
instrucciones oficiales y, después de revisar que se trata de una estación de
desarrollo, crear e instalar una CA local:

```bash
mkcert -install
mkdir -p certs/local
mkcert \
  -cert-file certs/local/localhost.pem \
  -key-file certs/local/localhost-key.pem \
  localhost 127.0.0.1 ::1
chmod 600 certs/local/localhost-key.pem
```

`mkcert -install` modifica el almacén de confianza del equipo y puede solicitar
privilegios administrativos. Nunca se deben compartir la CA, la llave privada ni los
certificados generados. `certs/` está excluido de Git.

Después:

```bash
cp .env.example .env.local
yarn install
yarn dev
```

Abrir `https://localhost:3000`. Para ejecutar verificaciones:

```bash
yarn lint
yarn test
yarn build
```

No cambie `SITE_MODE=production` ni `CONTENT_APPROVED=true` hasta contar con contenido
real, aviso legal aprobado y evidencia del checklist de lanzamiento.

Si se prefiere no instalar Node ni `nvm` en el host, usar Docker Compose como se
describe en la siguiente sección; el contenedor ya incluye Node 22. El certificado
local sigue siendo necesario porque se monta desde `certs/local/`.

## Docker Compose

Development:

```bash
cp .env.example .env.local
docker compose up --build
```

Abrir `https://localhost:3000`.

Artefacto Production-like local:

```bash
cp .env.docker.example .env.docker
docker compose --env-file .env.docker -f compose.production.yaml up --build
```

Abrir `https://localhost:3443`. Caddy termina TLS en el entorno Production-like y el
servidor standalone permanece accesible sólo dentro de la red de Compose.

Ambos inician en modo Preview. Docker es una ruta adicional de desarrollo y
portabilidad; Vercel sigue siendo el destino de Production.

## Deploy en Vercel y configuración del dominio

### Arquitectura y dominio

La ruta de producción es:

```text
Namecheap (registrador)
        ↓ nameservers
Cloudflare (DNS autoritativo; proxy y TLS público cuando se activen)
        ↓ A/CNAME
Vercel (Next.js, funciones y TLS del origen)
```

Configuración canónica:

```text
Dominio:       psicologamayumikitahara.com
URL canónica:  https://www.psicologamayumikitahara.com
Redirección:   https://psicologamayumikitahara.com → HTTPS www
```

La redirección permanente `308` está versionada en `next.config.js` y conserva ruta y
query. No se debe crear otra redirección raíz → `www` en Cloudflare.

### Estado DNS documentado el 1 de agosto de 2026

La aplicación ya está desplegada en Vercel y el proyecto entregó estos destinos:

```text
A apex:     216.198.79.1
CNAME www:  a0acb4f07fdaaf22.vercel-dns-017.com
```

La verificación pública del 1 de agosto de 2026 confirma que Cloudflare ya es DNS
autoritativo. El apex publica el A de Vercel y `www` el CNAME específico del proyecto;
ambos registros web están actualmente en **DNS only**. El apex responde `308` hacia
`https://www.psicologamayumikitahara.com/` y la variante canónica responde `200` con
HTTPS válido.

También están publicados los dos MX, SPF, DKIM, DMARC, los tres CNAME de
autoconfiguración y el SRV de Namecheap Private Email. Permanecen pendientes una prueba
operativa de envío/recepción, la decisión de activar el proxy web de Cloudflare con
Full (strict), y la activación posterior de DNSSEC/HSTS conforme al runbook.

El buzón empresarial confirmado es
`contacto@psicologamayumikitahara.com`. Namecheap continúa como proveedor del buzón;
Gmail se utilizará únicamente como cliente IMAP/SMTP por ahora. No se deben sustituir
los MX de Namecheap por MX de Google.

### Paso 1. Preparar el repositorio

Antes de desplegar:

```bash
nvm use
yarn install --frozen-lockfile
yarn lint
yarn test
yarn build
```

Los cuatro comandos deben terminar correctamente. Después:

1. Confirmar que el repositorio remoto es privado.
2. Confirmar que `.env.local`, `.env.docker`, `certs/`, `.next/` y `.vercel/` no están
   incluidos.
3. Publicar la rama principal aprobada.
4. Crear una rama `staging` si se requiere un hostname estable de preproducción.
5. No confirmar tokens, buzones privados de QA, certificados ni llaves. El buzón
   empresarial público sólo se documenta después de su confirmación explícita.

### Paso 2. Crear el proyecto en Vercel

Desde el Dashboard:

1. Entrar a Vercel con una cuenta nominal y MFA.
2. Seleccionar **Add New → Project**.
3. Importar el repositorio.
4. Confirmar **Framework Preset: Next.js**.
5. Confirmar **Node.js 22.x**.
6. Dejar vacío **Root Directory** si el repositorio contiene únicamente este proyecto.
7. No definir **Output Directory**.
8. Confirmar:

   ```text
   Install Command: yarn install --frozen-lockfile
   Build Command:   yarn build
   ```

9. Crear primero un Preview Deployment.
10. No habilitar todavía contenido real, correo de producción ni indexación.

`vercel.json` ya contiene las órdenes de instalación y build. Vercel utiliza el
proyecto Next.js directamente y no ejecuta el `Dockerfile`.

Con Vercel CLI instalada y autenticada, el flujo equivalente es:

```bash
vercel link
vercel
```

No se debe guardar un token de Vercel en el repositorio.

### Paso 3. Configurar variables en Vercel

Abrir **Project → Settings → Environment Variables**. Cada secreto se introduce
directamente en Vercel y nunca en Git.

Para Preview o Staging:

```env
NEXT_PUBLIC_SITE_URL=https://[HOST_HTTPS_DE_STAGING]
ALLOWED_ORIGIN=https://[HOST_HTTPS_DE_STAGING]
SITE_MODE=preview
CONTENT_APPROVED=false

NEXT_PUBLIC_SANITY_PROJECT_ID=[PROJECT_ID]
NEXT_PUBLIC_SANITY_DATASET=staging
NEXT_PUBLIC_SANITY_API_VERSION=2026-07-01
SANITY_API_READ_TOKEN=[SÓLO_SI_EL_DATASET_ES_PRIVADO]

RESEND_API_KEY=[KEY_DE_QA]
LEADS_TO_EMAIL=[BUZÓN_SINTÉTICO_DE_QA]
RESEND_FROM_EMAIL=[REMITENTE_DE_QA_VERIFICADO]

NEXT_PUBLIC_TURNSTILE_SITE_KEY=[SITEKEY_DE_STAGING]
TURNSTILE_SECRET_KEY=[SECRET_DE_STAGING]
```

Para el primer deployment de Production, mientras continúen pendientes el contenido,
la revisión legal o el checklist:

```env
NEXT_PUBLIC_SITE_URL=https://www.psicologamayumikitahara.com
ALLOWED_ORIGIN=https://www.psicologamayumikitahara.com
SITE_MODE=preview
CONTENT_APPROVED=false
```

Después de aprobar formalmente contenido, privacidad, integraciones y QA:

```env
NEXT_PUBLIC_SITE_URL=https://www.psicologamayumikitahara.com
ALLOWED_ORIGIN=https://www.psicologamayumikitahara.com
SITE_MODE=production
CONTENT_APPROVED=true
```

También se deben configurar en Production las variables Sanity, Resend y Turnstile con
credenciales exclusivas de ese ambiente. Los secretos no deben llevar
`NEXT_PUBLIC_`. Cada cambio de variables requiere un deployment nuevo.

### Paso 4. Agregar los dominios a Vercel

En **Project → Settings → Domains**:

1. Agregar `www.psicologamayumikitahara.com`.
2. Agregar `psicologamayumikitahara.com`.
3. Confirmar que `www` es la variante canónica.
4. Si Vercel solicita verificar propiedad, copiar el TXT exacto indicado.
5. Obtener los registros requeridos para ambos hostnames.

Con CLI:

```bash
vercel domains inspect psicologamayumikitahara.com
vercel domains inspect www.psicologamayumikitahara.com
```

Los valores específicos confirmados para este proyecto son:

```text
A apex:       216.198.79.1
CNAME www:    a0acb4f07fdaaf22.vercel-dns-017.com
```

Antes de cada migración o recuperación se deben comparar con Vercel. Lo mostrado por
el Dashboard o `vercel domains inspect` es autoritativo y reemplaza este inventario si
el proveedor entrega valores nuevos.

### Paso 5. Crear la zona en Cloudflare

Antes de modificar Namecheap:

1. Entrar a Cloudflare con una cuenta nominal y MFA.
2. Seleccionar **Add a domain**.
3. Introducir `psicologamayumikitahara.com`, sin protocolo ni `www`.
4. Seleccionar el plan aprobado.
5. Permitir el escaneo inicial de registros DNS.
6. Exportar o capturar todos los registros visibles en Namecheap.
7. Comparar la importación de Cloudflare con el inventario de Namecheap.
8. Copiar los dos nameservers exactos asignados por Cloudflare.
9. No activar todavía DNSSEC.

### Paso 6. Crear los registros en Cloudflare

La zona debe quedar con estos 12 registros. Todos permanecen en **DNS only** durante la
primera verificación:

| Tipo | Nombre | Destino o valor | Prioridad | Estado |
| --- | --- | --- | --- | --- |
| A | `@` | `216.198.79.1` | — | DNS only inicialmente |
| CNAME | `www` | `a0acb4f07fdaaf22.vercel-dns-017.com` | — | DNS only inicialmente |
| TXT | `_vercel` | valor exacto mostrado por Vercel | — | DNS only |
| MX | `@` | `mx1.privateemail.com` | 10 | DNS only |
| MX | `@` | `mx2.privateemail.com` | 10 | DNS only |
| TXT | `@` | `v=spf1 include:spf.privateemail.com ~all` | — | DNS only |
| CNAME | `mail` | `privateemail.com` | — | DNS only |
| CNAME | `autoconfig` | `privateemail.com` | — | DNS only |
| CNAME | `autodiscover` | `privateemail.com` | — | DNS only |
| SRV | `_autodiscover._tcp` | prioridad `0`, peso `0`, puerto `443`, destino `privateemail.com` | 0 | DNS only |
| TXT | selector DKIM indicado por Namecheap | clave DKIM completa indicada por Namecheap | — | DNS only |
| TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:contacto@psicologamayumikitahara.com` | — | DNS only |

El TXT `_vercel`, la clave DKIM y los dos nameservers asignados por Cloudflare no se
copian completos al repositorio. Deben obtenerse de los paneles correspondientes. Para
DKIM se debe usar exactamente el selector entregado por Namecheap:
`privateemail._domainkey` en suscripciones nuevas o `default._domainkey` en algunas
suscripciones anteriores. No se debe adivinar el selector ni la clave.

Antes de continuar:

1. Confirmar que sólo existe un A para `@` y que apunta a `216.198.79.1`.
2. Confirmar que `www` apunta al CNAME específico del proyecto actual.
3. No crear A/AAAA duplicados ni agregar AAAA manualmente.
4. No crear un CNAME para `@`.
5. Mantener correo, TXT, SRV y verificaciones en DNS only.
6. Mantener también `@` y `www` en DNS only hasta que Vercel emita ambos certificados.

### Paso 7. Cambiar Namecheap a los nameservers de Cloudflare

1. Abrir **Namecheap → Domain List**.
2. Seleccionar **Manage** junto a `psicologamayumikitahara.com`.
3. En **Domain**, localizar **Nameservers**.
4. Si DNSSEC está activo, desactivarlo antes del cambio y retirar el DS anterior.
5. Seleccionar **Custom DNS**.
6. Pegar los dos nameservers exactos asignados por Cloudflare, uno por renglón.
7. Guardar con la marca de confirmación.
8. Esperar hasta que Cloudflare muestre la zona como **Active**.

Después de seleccionar Custom DNS, los Host Records de **Advanced DNS** en Namecheap ya
no son autoritativos. A, CNAME, MX y TXT se administran en Cloudflare.

Verificar propagación:

```bash
dig NS psicologamayumikitahara.com @1.1.1.1
dig NS psicologamayumikitahara.com @8.8.8.8
dig MX psicologamayumikitahara.com @1.1.1.1
```

La propagación puede tardar hasta 24 horas. No se deben repetir cambios mientras los
resolvedores todavía conservan datos anteriores.

### Paso 8. Verificar certificados y activar Cloudflare

Con Cloudflare `Active`:

```bash
vercel domains inspect psicologamayumikitahara.com
vercel domains inspect www.psicologamayumikitahara.com
vercel certs ls
curl --fail --silent --show-error --head \
  https://www.psicologamayumikitahara.com
curl --fail --silent --show-error --head \
  https://psicologamayumikitahara.com
```

Se debe confirmar:

1. ambos dominios aparecen verificados en Vercel;
2. ambos tienen certificados vigentes;
3. `www` responde por HTTPS;
4. el apex redirige una sola vez hacia el mismo path en HTTPS `www`;
5. el certificado anterior vencido ya no se presenta;
6. el correo sigue recibiendo mediante Namecheap Private Email.

Después:

1. Cambiar únicamente `@` y `www` a **Proxied** en Cloudflare.
2. Mantener MX, TXT, DKIM, DMARC y verificaciones en **DNS only**.
3. En **SSL/TLS → Overview**, seleccionar **Full (strict)**.
4. En **Edge Certificates**, activar **Always Use HTTPS**.
5. Activar **Automatic HTTPS Rewrites** como defensa adicional y fijar la versión TLS
   mínima en `1.2`.
6. No usar el modo `Flexible`.
7. Probar nuevamente ambos dominios.
8. Activar HSTS sólo después de validar todos los subdominios y el rollback.

Si Vercel no puede verificar o renovar el certificado detrás del proxy, regresar
temporalmente sólo `@` y `www` a DNS only, completar la validación y volver a probar.
Nunca se debe degradar TLS.

### Correo de negocios en Gmail

El buzón permanece alojado en Namecheap Private Email:

```text
Cuenta: contacto@psicologamayumikitahara.com
IMAP:   mail.privateemail.com:993, SSL/TLS
SMTP:   mail.privateemail.com:465, SSL/TLS y autenticación
```

En la aplicación Gmail se debe elegir **Agregar otra cuenta → Otra → Personal
(IMAP)** y usar la dirección completa como usuario para entrada y salida. Si la
suscripción de Namecheap requiere una contraseña de aplicación, se genera en Private
Email y nunca se guarda en Git. Esta configuración no cambia DNS y no convierte el
buzón en Google Workspace. El procedimiento completo está en
[Namecheap Private Email y Gmail](docs/runbooks/namecheap-private-email-gmail.md).

### Paso 9. Activar DNSSEC

DNSSEC se configura únicamente después de estabilizar DNS, HTTPS y correo:

1. En Cloudflare → **DNS → Settings**, activar DNSSEC.
2. Copiar exactamente `Key Tag`, `Algorithm`, `Digest Type` y `Digest`.
3. En Namecheap → **Advanced DNS → DNSSEC**, habilitar DNSSEC para Custom DNS.
4. Crear el DS usando los cuatro valores entregados por Cloudflare.
5. Esperar propagación y validar la cadena DNSSEC.

Un DS incorrecto puede dejar inaccesible todo el dominio. No se deben usar valores de
ejemplo.

### Paso 10. Deploy de Staging y Production

Staging se genera desde una rama distinta de la rama de producción:

```bash
git switch staging
git push origin staging
```

Vercel debe crear un Preview Deployment con `SITE_MODE=preview` y
`CONTENT_APPROVED=false`.

Production se despliega desde la rama configurada como Production Branch,
normalmente `main`:

```bash
git switch main
git pull --ff-only
yarn install --frozen-lockfile
yarn lint
yarn test
yarn build
git push origin main
```

Alternativamente, con Vercel CLI vinculada al proyecto:

```bash
vercel --prod
```

El deployment no debe considerarse publicado hasta comprobar:

- `/`, `/aviso-de-privacidad`, `/robots.txt` y `/sitemap.xml`;
- `/admin` protegido y no indexable;
- `/api/contact` rechazando métodos y orígenes no autorizados;
- canonical y Open Graph apuntando a `www`;
- `robots.txt` bloqueando indexación mientras el sitio siga en Preview;
- Turnstile y Resend con una solicitud completamente sintética;
- ausencia de secretos o datos personales en logs;
- rollback disponible al deployment anterior.

### Rollback

Si aparece una incidencia:

1. En Vercel, promover el último deployment aprobado.
2. Si el problema es Cloudflare, volver `@` y `www` a DNS only sin tocar el correo.
3. Si un registro DNS es incorrecto, restaurar únicamente el valor respaldado.
4. Si DNSSEC falla, corregir o retirar el DS desde Namecheap siguiendo el ticket de
   cambio.
5. No cambiar Cloudflare a `Flexible`.
6. Registrar hora, causa, cambio, verificación y cierre.

La guía operativa ampliada está en
[Dominio, Namecheap, Cloudflare y Vercel](docs/runbooks/domain-cloudflare-vercel.md),
[Namecheap Private Email y Gmail](docs/runbooks/namecheap-private-email-gmail.md) y
[Development, Staging y Production](docs/runbooks/environments-and-deployment.md).

Referencias oficiales:

- [Dominios personalizados en Vercel](https://vercel.com/docs/domains/set-up-custom-domain)
- [Configuración completa de Cloudflare DNS](https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/)
- [Proxy DNS de Cloudflare](https://developers.cloudflare.com/dns/proxy-status/)
- [TLS Full (strict) de Cloudflare](https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/full-strict/)
- [Cambiar nameservers en Namecheap](https://www.namecheap.com/support/knowledgebase/article.aspx/767/10/how-to-change-dns-for-a-domain/)
- [DNSSEC con Custom DNS en Namecheap](https://www.namecheap.com/support/knowledgebase/article.aspx/9722/2232/managing-dnssec-for-domains-pointed-to-custom-dns/)
- [Private Email con DNS externo](https://www.namecheap.com/support/knowledgebase/article.aspx/1340/2176/namecheap-private-email-records-for-domains-with-thirdparty-dns/)
- [DKIM de Namecheap Private Email](https://www.namecheap.com/support/knowledgebase/article.aspx/10383/2176/how-to-set-up-a-dkim-record-for-private-email/)
- [Agregar otra cuenta a Gmail](https://support.google.com/mail/answer/6078445)

## Documentación

- [Producto](docs/specs/00-product-brief.md)
- [Especificación funcional](docs/specs/01-functional-specification.md)
- [UX/UI](docs/specs/02-ux-ui-specification.md)
- [Arquitectura](docs/specs/03-technical-architecture.md)
- [Seguridad y privacidad](docs/specs/04-security-and-privacy.md)
- [Repositorio de avisos de privacidad](docs/legal/privacy-notices/README.md)
- [Marketing, analítica y SEO](docs/specs/05-marketing-analytics-and-seo.md)
- [GA4, Google Ads y Tag Manager](docs/runbooks/google-ads-and-tag-manager.md)
- [Meta Pixel y TikTok Pixel](docs/runbooks/meta-and-tiktok-pixels.md)
- [Modelo de contenido](docs/specs/06-content-model.md)
- [Definition of Done](docs/specs/07-definition-of-done.md)
- [Development, staging y producción](docs/runbooks/environments-and-deployment.md)
- [Docker, Docker Compose y Vercel](docs/runbooks/docker-and-vercel.md)
- [HTTPS local](docs/runbooks/local-https-certificates.md)
- [Dominio, Namecheap, Cloudflare y Vercel](docs/runbooks/domain-cloudflare-vercel.md)
- [Namecheap Private Email y Gmail](docs/runbooks/namecheap-private-email-gmail.md)
- [ADR de portabilidad con Docker](docs/decisions/ADR-002-docker-portability-with-vercel-production.md)
- [ADR de HTTPS, dominio y DNS](docs/decisions/ADR-003-https-domain-and-dns.md)
- [Preguntas pendientes](docs/agent-handoffs/open-items.md)
- [Checklist de lanzamiento](docs/qa/launch-checklist.md)

## Stack implementado

Next.js App Router con JavaScript, React, Tailwind CSS y Yarn; Docker/Compose como ruta
opcional de desarrollo y portabilidad; Sanity Studio en
`/admin`; Route Handler `/api/contact`; Resend; Cloudflare Turnstile; Vercel; y
Cloudflare como DNS, CDN y capa de seguridad. Consulte la arquitectura antes de crear
o configurar los ambientes externos.

## Variables de entorno

Copiar `.env.example` a `.env.local` y completar únicamente valores de desarrollo o
preview autorizados. Nunca confirmar `.env.local`.

| Variable | Propósito | Ámbito |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | URL canónica | público |
| `ALLOWED_ORIGIN` | origen exacto aceptado por el formulario | servidor |
| `SITE_MODE` | `preview` o `production` | servidor |
| `CONTENT_APPROVED` | habilita indexación y sitemap al ser `true` | servidor |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | proyecto de Sanity | público |
| `NEXT_PUBLIC_SANITY_DATASET` | dataset, normalmente `production` | público |
| `NEXT_PUBLIC_SANITY_API_VERSION` | fecha de versión de API | público |
| `SANITY_API_READ_TOKEN` | lectura privada si el dataset no es público | secreto |
| `RESEND_API_KEY` | envío de correo | secreto |
| `LEADS_TO_EMAIL` | buzón de recepción | secreto |
| `RESEND_FROM_EMAIL` | remitente verificado | servidor |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | widget Turnstile | público |
| `TURNSTILE_SECRET_KEY` | validación Turnstile | secreto |
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager | público, con consentimiento |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta Pixel | público, con consentimiento |
| `NEXT_PUBLIC_TIKTOK_PIXEL_ID` | TikTok Pixel | público, con consentimiento |

Los valores de Vercel se configuran por entorno (Development, Preview y Production).
Los secretos nunca usan prefijo `NEXT_PUBLIC_`. Los pasos de cada proveedor se describen
en `docs/runbooks/`.

Las claves de Turnstile incluidas en `.env.example` son las credenciales oficiales de
prueba que siempre aprueban y sólo deben utilizarse en Development. Production debe
usar un widget **Managed** llamado `contact-production`, con
`www.psicologamayumikitahara.com` como único hostname, `action=contact` en la
aplicación y las dos claves reales configuradas en Vercel. El formulario también exige
`RESEND_API_KEY`, `LEADS_TO_EMAIL` y `RESEND_FROM_EMAIL`; Turnstile por sí solo no
entrega el mensaje.

## Preparación y verificación de Sanity Production

Los scripts no contienen tokens y usan la sesión local de Sanity. La preparación es
de sólo lectura; confirma dataset, IDs y necesidad de revisión legal:

```bash
yarn sanity exec scripts/sanity/prepare-production-content.js --with-user-token
```

La aplicación controlada de la migración utiliza un punto de entrada distinto para
evitar escrituras accidentales:

```bash
yarn sanity exec scripts/sanity/apply-production-content.js --with-user-token
```

Después se valida el estado efectivo y se enumeran los bloqueos de publicación:

```bash
yarn sanity exec scripts/sanity/verify-production-content.js --with-user-token
```

No se debe volver a ejecutar la aplicación sin revisar primero el modo preparación y
el historial del dataset. El script carga los honorarios confirmados y la política de
cancelación, además de los enlaces públicos confirmados de Google Calendar en el campo
**Enlace público de reserva** de cada servicio. También publica el aviso integral v1.1
aprobado desde `docs/legal/privacy-notices/aviso-integral-sitio-contacto-v1.1.md`; se
detiene si Sanity ya contiene una versión posterior. El gate exige una versión `1.1` o
posterior aprobada, además de
`SITE_MODE=production` y
`CONTENT_APPROVED=true`; ambos sólo se activan al cerrar el checklist.

La agenda y el pago requieren una configuración externa que no viaja en el código ni
en Sanity. Antes de desplegar cambios del embudo, configura nombre, correo, teléfono,
tipo de sesión, motivo y consentimiento como campos obligatorios en los dos horarios y
ejecuta una reserva de prueba. El procedimiento completo está en
[`docs/runbooks/google-calendar-stripe-booking.md`](docs/runbooks/google-calendar-stripe-booking.md).
