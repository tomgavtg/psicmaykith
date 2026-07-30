# Runbook de ambientes y despliegue

## Propósito

Esta guía explica cómo levantar y operar el sitio en tres ambientes:

1. **Development:** estación local, contenido y datos sintéticos.
2. **Staging:** deployment estable de preproducción para revisión y QA.
3. **Production:** sitio público detrás de Cloudflare.

Los comandos se ejecutan desde la raíz del repositorio. Los valores entre corchetes son
placeholders y deben sustituirse únicamente en administradores de secretos o archivos
locales ignorados por Git.

Para ejecutar Development o un artefacto Production-like mediante contenedores, usar
también [`docker-and-vercel.md`](docker-and-vercel.md).

Nunca se deben pegar en este documento:

- API keys;
- tokens de Sanity;
- secretos de Turnstile;
- correos o teléfonos personales;
- payloads de formularios;
- IDs internos que den acceso a proveedores.

## Modelo de ambientes

| Propiedad | Development | Staging | Production |
| --- | --- | --- | --- |
| Ejecución | `localhost` | Vercel Preview o Custom Environment | Vercel Production |
| Dominio | `https://localhost:3000` | `[POR DEFINIR: host HTTPS estable de staging]` | `https://www.psicologamayumikitahara.com` |
| `SITE_MODE` | `preview` | `preview` | `production` |
| `CONTENT_APPROVED` | `false` | `false` | `true`, sólo tras aprobaciones |
| Indexación | bloqueada | bloqueada | habilitada |
| Sitemap | vacío | vacío | URLs públicas |
| Sanity | dataset `development` o `staging` | dataset `staging` | dataset `production` |
| Turnstile | credenciales oficiales de prueba | widget exclusivo de staging | widget exclusivo de producción |
| Resend | destinatario sintético | buzón controlado de QA | buzón real autorizado |
| Analítica | vacía | propiedades de prueba o vacía | IDs aprobados |
| Cloudflare WAF | no aplica | opcional según hostname | obligatorio |

`SITE_MODE=production` por sí solo no habilita indexación. La aplicación requiere además
`CONTENT_APPROVED=true`. Ambos valores deben cambiarse sólo en Production después de
cerrar contenido, revisión legal y QA.

## Prerrequisitos comunes

### 1. Accesos y responsables

Antes de configurar ambientes se debe designar:

- responsable del repositorio y rama `main`;
- responsable de Vercel y rollback;
- administrador de Sanity;
- responsable de Cloudflare y DNS;
- responsable de Resend y buzón receptor;
- responsable de Turnstile;
- responsable de privacidad y revisión legal;
- responsable de QA.

Las cuentas deben ser nominales, con MFA cuando el proveedor lo permita. No se deben
compartir cuentas personales ni secretos por mensajería.

### 2. Repositorio Git

Este directorio debe estar en un repositorio Git válido antes de conectarlo a Vercel.
Si aún no existe un repositorio, una persona autorizada debe:

1. crear un repositorio privado en el proveedor Git aprobado;
2. inicializar Git desde esta carpeta;
3. revisar que `.env*`, `certs/`, `.next/`, `.vercel/` y `node_modules/` estén
   ignorados;
4. ejecutar una búsqueda de secretos;
5. crear el primer commit;
6. agregar el remoto autorizado;
7. publicar la rama `main`;
8. crear y publicar una rama persistente `staging`.

Comandos orientativos, después de sustituir el remoto:

```bash
git init
git branch -M main
git add .
git status
git commit -m "feat: implement initial psychology landing"
git remote add origin [URL_DEL_REPOSITORIO_PRIVADO]
git push -u origin main
git switch -c staging
git push -u origin staging
git switch main
```

Antes de `git add .` se debe inspeccionar `git status` y confirmar que no aparecen
`.env.local`, certificados, llaves ni archivos con datos reales. Si el repositorio ya
existe, no se debe reinicializar ni sustituir su historial.

### 3. Runtime

El proyecto requiere:

- Node.js `>=22.12`;
- versión recomendada en `.nvmrc`: `22.23.1`;
- Yarn `1.22.22`.

En Linux o WSL, comprobar primero si `nvm` está disponible:

```bash
command -v nvm
```

Si el comando no devuelve `nvm`, instalar la versión documentada por el proyecto
oficial y cargar de nuevo la configuración de Bash:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.6/install.sh | bash
source "$HOME/.bashrc"
command -v nvm
```

Si todavía no aparece, cerrar y abrir la terminal y volver a ejecutar
`command -v nvm`. `nvm` es una función del shell, por lo que `which nvm` no es una
comprobación confiable.

Con `nvm` disponible:

```bash
nvm install
nvm use
node --version
corepack enable
corepack prepare yarn@1.22.22 --activate
yarn --version
```

Resultados esperados:

```text
node: v22.23.1 o una versión compatible >=22.12
yarn: 1.22.22
```

No se debe continuar si se está usando Node 18: Next.js 16 y Sanity 6 requieren un
runtime más reciente.

Como alternativa, Docker Compose no requiere instalar Node en el host:

```bash
cp .env.example .env.local
docker compose up --build
```

La imagen de desarrollo incluye Node 22. Los detalles y requisitos de Docker están en
[Docker, Docker Compose y Vercel](docker-and-vercel.md).

### 4. Archivos y variables

`.env.example` es sólo una plantilla. Los valores locales van en `.env.local`; los
valores de staging y producción se guardan en Vercel.

Reglas:

- nunca confirmar `.env.local`;
- nunca usar variables Production en Development o Staging;
- nunca añadir `NEXT_PUBLIC_` a una llave secreta;
- configurar cada variable por ambiente;
- hacer redeploy después de cambiar variables de Vercel;
- mantener `NEXT_PUBLIC_SITE_URL` y `ALLOWED_ORIGIN` sin diagonal final;
- `ALLOWED_ORIGIN` debe ser un origen exacto: esquema, hostname y puerto si aplica.

## Development

### Objetivo

Levantar el sitio en `https://localhost:3000`, editar código y validar la interfaz sin
usar usuarios, leads ni credenciales de producción.

### Paso 1. Preparar el runtime

```bash
nvm use
node --version
yarn --version
```

Si es la primera ejecución:

```bash
yarn install --frozen-lockfile
```

`--frozen-lockfile` debe fallar si `package.json` y `yarn.lock` no coinciden; no se debe
regenerar el lockfile silenciosamente para “arreglar” un ambiente.

### Paso 1.1. Preparar HTTPS local

Generar e instalar el certificado local antes de iniciar Next.js:

```bash
mkcert -install
mkdir -p certs/local
mkcert \
  -cert-file certs/local/localhost.pem \
  -key-file certs/local/localhost-key.pem \
  localhost 127.0.0.1 ::1
chmod 600 certs/local/localhost-key.pem
```

La instalación de la CA modifica el almacén de confianza de la estación y debe
revisarse conscientemente. No compartir ni versionar la CA, certificado o llave.
Consultar [`local-https-certificates.md`](local-https-certificates.md) para WSL,
Docker y solución de problemas.

### Paso 2. Crear `.env.local`

```bash
cp .env.example .env.local
```

Editar `.env.local` con esta base:

```env
NEXT_PUBLIC_SITE_URL=https://localhost:3000
ALLOWED_ORIGIN=https://localhost:3000
SITE_MODE=preview
CONTENT_APPROVED=false

NEXT_PUBLIC_SANITY_PROJECT_ID=[PROJECT_ID]
NEXT_PUBLIC_SANITY_DATASET=development
NEXT_PUBLIC_SANITY_API_VERSION=2026-07-01
SANITY_API_READ_TOKEN=

RESEND_API_KEY=
LEADS_TO_EMAIL=
RESEND_FROM_EMAIL=

NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=

NEXT_PUBLIC_GTM_ID=
NEXT_PUBLIC_META_PIXEL_ID=
NEXT_PUBLIC_TIKTOK_PIXEL_ID=
```

Hay dos modos:

- **Sólo interfaz:** dejar Sanity, Resend y Turnstile vacíos. El sitio usa contenido
  provisional, muestra `/admin` como no configurado y deshabilita el envío.
- **Integración local:** configurar un dataset no productivo, credenciales oficiales
  de prueba de Turnstile y una cuenta/receptor controlado de Resend.

No se debe activar analítica publicitaria en desarrollo.

### Paso 3. Preparar Sanity para desarrollo

Si sólo se revisará la interfaz, omitir este paso.

Para probar edición:

1. Crear o elegir el proyecto Sanity autorizado.
2. Definir `NEXT_PUBLIC_SANITY_PROJECT_ID`.
3. Crear un dataset no productivo:

   ```bash
   yarn sanity dataset create development
   ```

4. Elegir dataset público o privado conforme a la decisión de privacidad.
5. Si es privado, crear un token de sólo lectura y guardarlo únicamente como
   `SANITY_API_READ_TOKEN` en `.env.local`.
6. En Sanity Manage → proyecto → Settings → API settings → CORS Origins, agregar:

   ```text
   https://localhost:3000
   ```

7. Permitir credenciales para el origen del Studio embebido.
8. No usar wildcard con credenciales.
9. Abrir `https://localhost:3000/admin` e iniciar sesión con un usuario nominal.
10. Crear los singletons y entre tres y cuatro servicios sintéticos claramente
    etiquetados como prueba.

Si el plan no permite un dataset `development`, se puede usar temporalmente `staging`
para contenido sintético; nunca se debe escribir contenido de prueba en `production`.

### Paso 4. Preparar Turnstile

Para una prueba integrada local:

1. Abrir la documentación oficial de pruebas de Turnstile.
2. Copiar el par de credenciales de prueba “always passes”.
3. Poner el sitekey público en `NEXT_PUBLIC_TURNSTILE_SITE_KEY`.
4. Poner la clave de prueba del servidor en `TURNSTILE_SECRET_KEY`.
5. No copiar el widget ni el secret real de producción.
6. Para probar errores, repetir con el par oficial “always fails”.

Las credenciales de prueba funcionan en `localhost`. Los widgets reales de producción
no deben autorizar `localhost` o `127.0.0.1`.

### Paso 5. Preparar Resend

Resend no ofrece un sandbox aislado: una API key válida puede enviar correo. Para una
prueba local se debe:

1. Usar una cuenta/equipo de prueba autorizado.
2. Crear una API key separada y rotulándola como Development.
3. Usar un remitente permitido por la cuenta.
4. Establecer `LEADS_TO_EMAIL=delivered+contact-development@resend.dev` o un buzón
   sintético controlado.
5. No usar el buzón real de leads.
6. Completar `RESEND_API_KEY` y `RESEND_FROM_EMAIL`.
7. Eliminar o rotar la llave al terminar si era temporal.

Nunca se deben usar nombres, correos o teléfonos reales en la prueba.

### Paso 6. Ejecutar verificaciones

```bash
yarn lint
yarn test
yarn build
```

Los tres comandos deben terminar con código `0`.

### Paso 7. Iniciar el servidor

```bash
yarn dev
```

Abrir:

```text
https://localhost:3000
https://localhost:3000/admin
https://localhost:3000/aviso-de-privacidad
https://localhost:3000/robots.txt
https://localhost:3000/sitemap.xml
```

Validar:

1. La landing muestra exactamente Sobre mí, Servicios y Agendar.
2. Existe banner de demostración mientras el contenido no esté aprobado.
3. `robots.txt` contiene `Disallow: /`.
4. El sitemap está vacío.
5. `/admin` abre el Studio sólo si Sanity está configurado.
6. El formulario queda deshabilitado sin Turnstile.
7. Con las integraciones de prueba, una solicitud sintética produce una única entrega.
8. Un origen distinto, body mayor a 10 KB o `GET /api/contact` es rechazado.
9. No aparecen payloads, tokens ni datos personales en consola o logs.

Para detener el servidor, usar `Ctrl+C`.

### Paso 8. HTTPS local opcional

El flujo normal usa HTTP. Si una integración exige HTTPS, seguir
`docs/runbooks/local-https-certificates.md`. No reutilizar certificados de producción
ni desactivar la verificación TLS.

## Staging

### Objetivo y estrategia

Staging debe ser un deployment estable, protegido y no indexable. Se recomienda:

- rama Git persistente `staging`;
- hostname estable `[POR DEFINIR: staging.example.com]`;
- variables específicas para esa rama;
- dataset Sanity `staging`;
- widget Turnstile exclusivo;
- destinatario de QA;
- Vercel Deployment Protection.

Un URL de preview por commit no es suficiente para el formulario porque
`ALLOWED_ORIGIN` exige un origen exacto. Se debe asignar un dominio estable a la rama o
utilizar un Custom Environment con dominio propio.

### Variante A. Preview por rama — compatible con Hobby

1. Conectar el repositorio Git al proyecto Vercel.
2. Establecer `main` como Production Branch.
3. Mantener `staging` como rama no productiva.
4. Agregar a Vercel un dominio estable de staging.
5. En Settings → Domains → Edit, conectarlo a:

   ```text
   Environment: Preview
   Git Branch: staging
   ```

6. Configurar variables Preview limitadas específicamente a la rama `staging`.
7. Activar Vercel Authentication/Standard Deployment Protection.

### Variante B. Custom Environment — Pro o Enterprise

1. En Vercel → Project → Settings → Environments, crear el ambiente `staging`.
2. Configurar Branch Tracking para la rama `staging`.
3. Asignar el dominio estable al ambiente.
4. Importar variables desde Preview sólo como punto de partida.
5. Separar el ambiente para que futuros cambios no hereden secretos incorrectos.
6. Configurar variables propias y Deployment Protection.

Si se usa CLI autorizada:

```bash
vercel deploy --target=staging
vercel pull --environment=staging
```

No usar `--target=staging` si el Custom Environment no existe.

### Paso 1. Configurar el proyecto Vercel

En Vercel → Add New → Project:

1. Importar el repositorio privado.
2. Seleccionar la raíz del proyecto.
3. Confirmar Framework Preset: Next.js.
4. Configurar Node.js 22.x.
5. Install Command:

   ```text
   yarn install --frozen-lockfile
   ```

6. Build Command:

   ```text
   yarn build
   ```

7. No definir Output Directory; Next.js/Vercel la gestiona.
8. No habilitar Production todavía.

### Paso 2. Preparar el dataset `staging`

Desde una estación con acceso autorizado y variables del proyecto Sanity:

```bash
yarn sanity dataset create staging
```

Después:

1. Configurar sólo contenido sintético o editorial pendiente de aprobación.
2. Agregar a CORS el origen exacto de staging con credenciales para `/admin`.
3. Agregar `https://localhost:3000` por separado si el mismo proyecto se edita localmente.
4. No usar `*` con credenciales.
5. Limitar roles: editor para contenido y administrador sólo para schemas/usuarios.

### Paso 3. Preparar Turnstile de staging

1. Crear un widget llamado, por ejemplo, `contact-staging`.
2. Autorizar únicamente el hostname estable de staging; no incluir esquema, puerto o
   path.
3. No usar wildcard.
4. Guardar el sitekey en `NEXT_PUBLIC_TURNSTILE_SITE_KEY` de Staging.
5. Guardar el secret en `TURNSTILE_SECRET_KEY` de Staging.
6. Confirmar que el widget usa `action=contact`.
7. No reutilizar el widget de producción.

### Paso 4. Preparar Resend de staging

1. Crear una API key distinta de producción.
2. Usar un remitente de prueba autorizado.
3. Definir como destinatario:

   ```text
   delivered+contact-staging@resend.dev
   ```

   o un buzón sintético aprobado.

4. Confirmar que no existen CC/BCC ni reglas que reenvíen a personas reales.
5. Registrar responsable y fecha de expiración/rotación de la key fuera del repositorio.

### Paso 5. Configurar variables de staging

En Vercel, para la rama/ambiente `staging`:

```env
NEXT_PUBLIC_SITE_URL=https://[HOST_STAGING]
ALLOWED_ORIGIN=https://[HOST_STAGING]
SITE_MODE=preview
CONTENT_APPROVED=false

NEXT_PUBLIC_SANITY_PROJECT_ID=[PROJECT_ID]
NEXT_PUBLIC_SANITY_DATASET=staging
NEXT_PUBLIC_SANITY_API_VERSION=2026-07-01
SANITY_API_READ_TOKEN=[SÓLO SI DATASET PRIVADO]

RESEND_API_KEY=[KEY_STAGING]
LEADS_TO_EMAIL=delivered+contact-staging@resend.dev
RESEND_FROM_EMAIL=[REMITENTE_AUTORIZADO]

NEXT_PUBLIC_TURNSTILE_SITE_KEY=[SITEKEY_STAGING]
TURNSTILE_SECRET_KEY=[SECRET_STAGING]

NEXT_PUBLIC_GTM_ID=
NEXT_PUBLIC_META_PIXEL_ID=
NEXT_PUBLIC_TIKTOK_PIXEL_ID=
```

Si se prueban etiquetas, usar IDs de propiedades/contenedores de prueba y mantener
consentimiento previo. Nunca usar propiedades productivas para QA.

### Paso 6. Desplegar staging

Flujo Git recomendado:

```bash
git switch staging
git merge --no-ff [RAMA_CANDIDATA]
git push origin staging
```

Vercel debe crear un Preview Deployment y asignar el hostname estable de staging.

Antes de mezclar una rama se debe revisar el PR y confirmar:

```bash
yarn install --frozen-lockfile
yarn lint
yarn test
yarn build
```

### Paso 7. Validar staging

1. Abrir el deployment mediante el dominio estable.
2. Confirmar Deployment Protection.
3. Confirmar certificado HTTPS válido.
4. Confirmar banner de demostración.
5. Confirmar `robots.txt` con `Disallow: /`.
6. Confirmar sitemap vacío.
7. Confirmar `<meta name="robots" content="noindex...">`.
8. Probar login y edición desde `/admin`.
9. Probar formulario válido con datos sintéticos.
10. Probar inválido, honeypot, Turnstile vencido/fallido y reintento.
11. Confirmar una sola entrega en el receptor sintético.
12. Confirmar que el remitente y `replyTo` son correctos.
13. Probar WhatsApp sólo si utiliza un número de QA autorizado; de lo contrario mantener
    el CTA sin configurar.
14. Revisar red: GTM, Meta y TikTok no deben cargar antes de consentimiento.
15. Revisar CSP, HSTS, `nosniff`, X-Frame-Options, Referrer Policy, Permissions Policy,
    COOP y CORP.
16. Ejecutar matriz responsiva y accesibilidad.
17. Guardar evidencia sanitizada ligada al deployment ID.

No se debe aprobar con P0/P1 abiertos.

## Production

### Gate obligatorio

No iniciar el despliegue público hasta que:

- el contenido profesional y las imágenes estén aprobados;
- el aviso de privacidad tenga revisión legal vigente;
- ambos hostnames estén reclamados en Vercel y el certificado vigente;
- Sanity, Resend, Turnstile, Vercel y Cloudflare tengan responsables;
- planes y controles dependientes del plan estén confirmados;
- el bypass directo de Vercel tenga tratamiento aprobado;
- Cloudflare WAF/rate limit y protección de `/admin` estén definidos;
- la lista `docs/qa/launch-checklist.md` esté completa sobre el candidato;
- exista un deployment de producción anterior o un plan inicial de reversión;
- se haya autorizado una ventana de cambio.

### Paso 1. Preparar Sanity Production

1. Crear o confirmar el dataset:

   ```bash
   yarn sanity dataset create production
   ```

2. Elegir público/privado y configurar token de sólo lectura si aplica.
3. Cargar únicamente contenido comprobado.
4. Publicar entre tres y cuatro servicios completos.
5. Publicar un `privacyNotice` con estado `approved`, fecha y versión.
6. Completar SEO e imagen Open Graph.
7. Confirmar permisos y alt text de imágenes.
8. Agregar a CORS el origen canónico exacto con credenciales para Studio.
9. No agregar dominios de preview genéricos.
10. Configurar Deploy Hook sólo después de crear el proyecto Vercel y probarlo en
    staging.

### Paso 2. Preparar Resend Production

1. Crear el equipo/cuenta nominal.
2. Agregar el dominio o subdominio remitente.
3. Copiar en Cloudflare exactamente los registros SPF/DKIM indicados.
4. Esperar estado verificado.
5. Coordinar DMARC con los demás remitentes del dominio.
6. Crear una API key exclusiva de producción y mínimo privilegio.
7. Confirmar `RESEND_FROM_EMAIL`.
8. Confirmar `LEADS_TO_EMAIL` y su responsable.
9. Definir retención, borrado, suplencia y SLA.
10. Ejecutar una entrega sintética autorizada antes del corte.

Seguir también `docs/runbooks/resend-email.md`.

### Paso 3. Preparar Turnstile Production

1. Crear un widget exclusivo llamado `contact-production`.
2. Autorizar únicamente el hostname canónico.
3. No incluir `localhost`, staging, esquemas, puertos o paths.
4. Configurar el sitekey público y secret sólo en Production.
5. Confirmar `action=contact`.
6. Verificar que el servidor rechaza hostname o action diferentes.
7. Registrar rotación y responsable.

### Paso 4. Configurar variables Production en Vercel

```env
NEXT_PUBLIC_SITE_URL=https://www.psicologamayumikitahara.com
ALLOWED_ORIGIN=https://www.psicologamayumikitahara.com
SITE_MODE=production
CONTENT_APPROVED=true

NEXT_PUBLIC_SANITY_PROJECT_ID=[PROJECT_ID]
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-07-01
SANITY_API_READ_TOKEN=[SÓLO SI DATASET PRIVADO]

RESEND_API_KEY=[KEY_PRODUCTION]
LEADS_TO_EMAIL=[BUZÓN_AUTORIZADO]
RESEND_FROM_EMAIL=[REMITENTE_VERIFICADO]

NEXT_PUBLIC_TURNSTILE_SITE_KEY=[SITEKEY_PRODUCTION]
TURNSTILE_SECRET_KEY=[SECRET_PRODUCTION]

NEXT_PUBLIC_GTM_ID=[ID_APROBADO_O_VACÍO]
NEXT_PUBLIC_META_PIXEL_ID=[ID_APROBADO_O_VACÍO]
NEXT_PUBLIC_TIKTOK_PIXEL_ID=[ID_APROBADO_O_VACÍO]
```

Confirmar variable por variable:

1. ámbito Production únicamente;
2. sin espacios o comillas accidentales;
3. URL sin `/` final;
4. secretos sin `NEXT_PUBLIC_`;
5. dataset `production`;
6. destinatario real aprobado;
7. IDs publicitarios sólo si consentimiento y revisión legal están cerrados.

Cada cambio de variables requiere un deployment nuevo. Un rollback puede restaurar un
build con variables anteriores, por lo que la configuración debe quedar registrada sin
valores secretos.

### Paso 5. Preparar dominio y Cloudflare

Seguir `docs/runbooks/domain-cloudflare-vercel.md` y
`docs/runbooks/cloudflare-security.md`:

1. respaldar DNS existentes;
2. agregar raíz y `www` a Vercel;
3. elegir una sola variante canónica;
4. copiar registros DNS exactos mostrados por Vercel;
5. mantener Cloudflare proxied en hostnames web;
6. usar TLS Full (strict);
7. forzar HTTPS;
8. aplicar WAF, bots, métodos, rutas de ataque y rate limit;
9. proteger `/admin`;
10. excluir `/admin` y `/api/contact` de caché;
11. probar que `*.vercel.app` no evita controles requeridos;
12. activar HSTS/DNSSEC sólo en el orden y ventana aprobados.

### Paso 6. Crear el candidato de producción

La opción más segura es crear un deployment Production sin asignar todavía el dominio.
Requiere Vercel CLI vinculada al proyecto y autoasignación controlada.

Primero verificar la versión candidata:

```bash
git switch main
git pull --ff-only
yarn install --frozen-lockfile
yarn lint
yarn test
yarn build
```

Después, con Vercel CLI autenticada mediante una cuenta nominal:

```bash
vercel link
vercel --prod --skip-domain
```

Guardar la URL/ID mostrados por Vercel en el checklist, no en `.env`.

Alternativa mediante Dashboard:

1. Vercel → Project → Settings → Environments → Production.
2. Branch Tracking: `main`.
3. Desactivar temporalmente **Auto-assign Custom Production Domains**.
4. Hacer merge del commit candidato a `main`.
5. Esperar el deployment con estado **Staged**.

Si el plan/proceso no admite un deployment staged, el merge a `main` publicará
automáticamente. En ese caso la ventana, el smoke test inmediato y el rollback deben
estar preparados antes del merge.

### Paso 7. Validar el candidato staged

Sobre la URL exacta del deployment:

1. confirmar commit SHA e identificador;
2. confirmar build sin warnings bloqueantes;
3. confirmar contenido real y ausencia de placeholders;
4. validar `/`, `/aviso-de-privacidad`, `/admin`, `/api/contact`, `/robots.txt` y
   `/sitemap.xml`;
5. revisar canonical, Open Graph y JSON-LD;
6. enviar una solicitud sintética autorizada;
7. confirmar una sola entrega;
8. validar Turnstile, origen/host y rate limits;
9. revisar que trackers no carguen antes de consentimiento;
10. ejecutar Lighthouse tres veces y registrar mediana;
11. ejecutar matriz móvil y accesibilidad;
12. verificar headers y CSP por ruta;
13. confirmar que logs/evidencias no contienen payloads;
14. aprobar el mismo deployment desde producto, arquitectura, seguridad y QA.

Un deployment protegido puede requerir una excepción temporal y explícita para
herramientas de QA. No se debe desactivar toda la protección.

### Paso 8. Promover

Con CLI:

```bash
vercel promote [DEPLOYMENT_ID_O_URL]
vercel promote status
```

Con Dashboard:

1. abrir Deployments;
2. localizar el candidato exacto;
3. comprobar commit y ambiente Production;
4. abrir el menú del deployment;
5. seleccionar Promote;
6. revisar qué dominios serán asignados;
7. confirmar durante la ventana aprobada.

No promover “el deployment más reciente” sin comparar su identificador con el
checklist.

### Paso 9. Smoke test posterior

Inmediatamente después de promover:

1. abrir HTTP y confirmar una sola redirección a HTTPS canónico;
2. abrir raíz y `www` y confirmar una sola variante;
3. confirmar `/` con las tres secciones;
4. confirmar privacidad aprobada;
5. confirmar `robots.txt` indexable y sitemap con dos URLs públicas;
6. confirmar canonical y JSON-LD con el dominio real;
7. abrir WhatsApp en móvil y escritorio;
8. enviar un único formulario sintético autorizado;
9. confirmar recepción y `replyTo`;
10. confirmar ausencia de PII en analítica y logs;
11. aceptar/rechazar consentimiento y revisar red/cookies;
12. comprobar headers y certificado;
13. revisar Cloudflare Security Events;
14. revisar errores de Vercel y Resend;
15. registrar resultado, hora, versión y responsables.

Sólo después del smoke test se debe declarar el release activo.

## Rollback

### Cuándo ejecutar

Hacer rollback ante:

- formulario roto o duplicando entregas;
- exposición de secretos o datos;
- contenido profesional/legal incorrecto;
- CSP que rompe Turnstile, Sanity o navegación;
- redirección/DNS que deja el sitio inaccesible;
- trackers cargando antes de consentimiento;
- defecto P0/P1.

### Rollback de aplicación en Vercel

Con CLI:

```bash
vercel rollback
vercel rollback status
```

Para una versión específica, si el plan lo permite:

```bash
vercel rollback [DEPLOYMENT_ID_O_URL]
```

Con Dashboard:

1. abrir Deployments;
2. identificar el último deployment bueno;
3. abrir su menú;
4. seleccionar Instant Rollback;
5. confirmar;
6. ejecutar smoke test de restauración.

Después de un Instant Rollback, Vercel puede detener la autoasignación de dominios a
nuevos deployments. Para reanudar el flujo se debe promover manualmente un deployment
corregido y comprobar el estado de promoción.

### Rollback de configuración

- **Variables:** restaurar el conjunto anterior desde el gestor autorizado y hacer un
  deployment nuevo; no copiar secretos desde logs.
- **Sanity:** corregir/publicar contenido; si el riesgo es material, mantener la landing
  no indexable o revertir el deployment.
- **Turnstile/Resend:** restaurar la key anterior sólo si sigue segura; ante exposición,
  rotar.
- **Cloudflare/DNS:** seguir el rollback específico del runbook de dominio; no cambiar a
  TLS Flexible.
- **Analítica:** vaciar temporalmente IDs y redeploy si una etiqueta viola
  consentimiento.

Registrar inicio, decisión, responsable, deployment restaurado y resultado.

## Operación cotidiana

### Flujo de cambios

1. Crear rama desde `main`.
2. Desarrollar y verificar localmente.
3. Abrir PR.
4. Revisar Preview Deployment del PR.
5. Integrar a `staging`.
6. Ejecutar QA y cerrar evidencia.
7. Integrar el commit aprobado a `main`.
8. Crear candidato Production staged.
9. Promover.
10. Ejecutar smoke test.

### Al modificar variables

1. Identificar ambiente exacto.
2. Registrar motivo y responsable.
3. Cambiar sólo ese ambiente.
4. Redeploy.
5. Probar.
6. Rotar/revocar el valor anterior cuando corresponda.

### Al modificar contenido

1. Editar en el dataset correcto.
2. Revisar preview.
3. Verificar claims, datos de contacto e imágenes.
4. Publicar.
5. Esperar hasta 3,600 segundos o ejecutar el Deploy Hook aprobado.
6. Verificar el sitio público.

## Solución de problemas

| Síntoma | Revisión |
| --- | --- |
| Node no compatible | `node --version`; usar `.nvmrc` |
| `yarn install` cambia lockfile | restaurar y revisar `package.json`; usar `--frozen-lockfile` |
| Sitio muestra demostración | revisar Sanity y contenido mínimo; en preview es esperado |
| Formulario deshabilitado | falta `NEXT_PUBLIC_TURNSTILE_SITE_KEY` |
| API responde `403` | comparar `Origin`, `Host`, `ALLOWED_ORIGIN`, Turnstile action/hostname |
| API responde `400` | revisar schema, servicio/modalidad/horario publicados y honeypot |
| API responde `413` | body mayor a 10 KB |
| API responde `429` | rate limit local o Cloudflare |
| API responde `500/502` | revisar configuración/estado de Resend sin imprimir payload |
| `/admin` muestra configuración pendiente | falta `NEXT_PUBLIC_SANITY_PROJECT_ID` |
| Sanity bloquea login | revisar CORS exacto con credenciales |
| Staging usa URL incorrecta | revisar dominio asignado a rama y variables branch-specific |
| Preview aparece en Google | verificar `SITE_MODE=preview`, `CONTENT_APPROVED=false`, robots y protección |
| Producción sigue `noindex` | confirmar ambos gates y redeploy |
| CSP bloquea proveedor | medir hostname exacto; no agregar `*` ni `unsafe-inline` a scripts |
| Rollback no recibe pushes | revisar estado de rollback/promoción y autoasignación en Vercel |

## Referencias oficiales

- [Ambientes y Custom Environments de Vercel](https://vercel.com/docs/deployments/environments)
- [Variables de entorno de Vercel](https://vercel.com/docs/environment-variables)
- [Deployments Git en Vercel](https://vercel.com/docs/git)
- [Asignar dominio a una rama](https://vercel.com/docs/domains/working-with-domains/assign-domain-to-a-git-branch)
- [Deployment Protection](https://vercel.com/docs/deployment-protection)
- [Deployment staged desde CLI](https://vercel.com/docs/cli/deploying-from-cli)
- [Promover deployments](https://vercel.com/docs/deployments/promoting-a-deployment)
- [Rollback de Vercel](https://vercel.com/docs/deployments/rollback-production-deployment)
- [Datasets de Sanity](https://www.sanity.io/docs/content-lake/datasets)
- [CORS de Sanity](https://www.sanity.io/docs/content-lake/cors)
- [Pruebas de Turnstile](https://developers.cloudflare.com/turnstile/troubleshooting/testing/)
- [Hostnames de Turnstile](https://developers.cloudflare.com/turnstile/additional-configuration/hostname-management/)
- [Correos de prueba de Resend](https://resend.com/docs/dashboard/emails/send-test-emails)
- [Dominios de Resend](https://resend.com/docs/dashboard/domains/introduction)

Las interfaces, nombres y capacidades por plan pueden cambiar. Antes de un cambio real
se deben contrastar de nuevo con la documentación oficial y el plan contratado.
