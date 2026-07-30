# Runbook de Docker, Docker Compose y Vercel

## Resultado esperado

El proyecto admite cuatro formas de ejecución sin mantener implementaciones distintas:

| Flujo | Archivo/comando | Uso |
| --- | --- | --- |
| Node local | `yarn dev` | desarrollo más rápido |
| Docker Compose | `compose.yaml` | desarrollo reproducible |
| Contenedor standalone | `compose.production.yaml` | prueba local del artefacto Production |
| Vercel | `vercel.json` + integración Git | Staging y Production recomendados |

Docker no reemplaza Vercel. Vercel no utiliza el `Dockerfile`: detecta Next.js y ejecuta
la instalación y build configurados en `vercel.json`.

## Archivos

```text
Dockerfile
.dockerignore
compose.yaml
compose.production.yaml
Caddyfile.local
.env.docker.example
vercel.json
next.config.js
```

El `Dockerfile` contiene:

- `dependencies`: dependencias con lockfile congelado;
- `development`: servidor Next.js con hot reload;
- `builder`: build con `output: "standalone"`;
- `runner`: runtime mínimo, no root y con healthcheck.

## Prerrequisitos

1. Docker Engine o Docker Desktop vigente.
2. Docker Compose v2, invocado como `docker compose`.
3. Al menos 4 GB de memoria disponible para compilar Next.js y Sanity Studio.
4. Puertos locales `3000` y `3443` libres.
5. Acceso al registry de la imagen oficial `node:22-bookworm-slim`.
6. Certificado y llave confiables en `certs/local/`, generados según
   [`local-https-certificates.md`](local-https-certificates.md).

Verificar:

```bash
docker --version
docker compose version
docker info
```

En Windows con WSL 2:

1. Instalar e iniciar Docker Desktop.
2. Abrir Settings → Resources → WSL Integration.
3. Habilitar la distribución donde vive este repositorio.
4. Reiniciar Docker Desktop.
5. Repetir los tres comandos.

El mensaje “docker could not be found in this WSL 2 distro” indica que falta esa
integración; no es un error del proyecto.

## Development con Docker Compose

### 1. Crear variables locales

```bash
cp .env.example .env.local
```

Editar como mínimo:

```env
NEXT_PUBLIC_SITE_URL=https://localhost:3000
ALLOWED_ORIGIN=https://localhost:3000
SITE_MODE=preview
CONTENT_APPROVED=false
NEXT_PUBLIC_SANITY_DATASET=development
NEXT_PUBLIC_SANITY_API_VERSION=2026-07-01
```

Para modo sólo interfaz, dejar Sanity, Turnstile, Resend y analítica vacíos. Para probar
integraciones, seguir `environments-and-deployment.md` y usar únicamente cuentas/datos
de Development.

### 2. Validar Compose

```bash
docker compose config --quiet
```

No usar `docker compose config` sin `--quiet` en tickets o grabaciones: la salida puede
expandir los valores de `.env.local`.

### 3. Construir

```bash
docker compose build
```

La primera ejecución descarga Node e instala dependencias. Las siguientes reutilizan
las capas y el cache de Yarn.

### 4. Iniciar

En primer plano:

```bash
docker compose up
```

En segundo plano:

```bash
docker compose up -d
```

El servicio:

- escucha en `https://localhost:3000`;
- usa el certificado local de `certs/local/`;
- publica el puerto únicamente en loopback;
- monta el repositorio en `/app`;
- conserva `node_modules` dentro de un volumen Linux;
- conserva `.next` en otro volumen;
- activa polling para detectar cambios desde Docker Desktop.

### 5. Revisar estado

```bash
docker compose ps
docker compose logs --follow web
```

Abrir:

```text
https://localhost:3000
https://localhost:3000/admin
https://localhost:3000/robots.txt
```

El estado debe cambiar a `healthy` después de que el puerto TLS esté disponible.

### 6. Ejecutar controles dentro del contenedor

```bash
docker compose exec web yarn lint
docker compose exec web yarn test
docker compose exec web yarn build
```

El último comando consume más memoria y no sustituye el build de la imagen standalone.

### 7. Detener

```bash
docker compose down
```

Los volúmenes se conservan para acelerar la siguiente ejecución.

Si se necesita descartar exclusivamente las dependencias/cache de este proyecto:

```bash
docker compose down --volumes
```

Este último comando borra los dos volúmenes declarados por `compose.yaml`; después se
debe reconstruir. No afecta archivos del repositorio.

## Imagen standalone Production-like

Este flujo prueba el mismo servidor Node que podría ejecutarse en una plataforma de
contenedores. Por seguridad inicia en modo Preview.

### 1. Crear el archivo de entorno

```bash
cp .env.docker.example .env.docker
```

Mantener inicialmente:

```env
NEXT_PUBLIC_SITE_URL=https://localhost:3443
ALLOWED_ORIGIN=https://localhost:3443
SITE_MODE=preview
CONTENT_APPROVED=false
HTTPS_PORT=3443
IMAGE_TAG=local
```

`.env.docker` está ignorado por Git. `.env.docker.example` contiene sólo placeholders.

### 2. Comprender build-time y runtime

Estas variables se pasan durante `docker build` porque llegan al navegador o generan
archivos estáticos:

```text
NEXT_PUBLIC_SITE_URL
SITE_MODE
CONTENT_APPROVED
NEXT_PUBLIC_SANITY_PROJECT_ID
NEXT_PUBLIC_SANITY_DATASET
NEXT_PUBLIC_SANITY_API_VERSION
NEXT_PUBLIC_TURNSTILE_SITE_KEY
NEXT_PUBLIC_GTM_ID
NEXT_PUBLIC_META_PIXEL_ID
NEXT_PUBLIC_TIKTOK_PIXEL_ID
```

Estas variables se inyectan sólo al arrancar el contenedor:

```text
ALLOWED_ORIGIN
SANITY_API_READ_TOKEN
RESEND_API_KEY
LEADS_TO_EMAIL
RESEND_FROM_EMAIL
TURNSTILE_SECRET_KEY
```

No pasar secretos como `--build-arg`; quedarían expuestos en metadatos, capas o el
contexto de build.

### 3. Validar configuración sin imprimir secretos

```bash
docker compose \
  --env-file .env.docker \
  -f compose.production.yaml \
  config --quiet
```

### 4. Construir la imagen

```bash
docker compose \
  --env-file .env.docker \
  -f compose.production.yaml \
  build
```

Resultado esperado:

```text
maykitpsic:local
```

### 5. Revisar la imagen

```bash
docker image inspect maykitpsic:local
docker history --no-trunc maykitpsic:local
```

No compartir la salida completa hasta verificar que no contiene valores sensibles.

### 6. Iniciar

```bash
docker compose \
  --env-file .env.docker \
  -f compose.production.yaml \
  up -d
```

La configuración:

- ejecuta como usuario no root;
- expone únicamente Caddy por HTTPS en loopback;
- mantiene el HTTP de Next.js dentro de la red privada de Compose;
- elimina Linux capabilities;
- activa `no-new-privileges`;
- usa filesystem de sólo lectura;
- monta `/tmp` y `.next/cache` como `tmpfs`;
- reinicia salvo detención manual;
- verifica `/robots.txt`.

### 7. Smoke test

```bash
docker compose \
  --env-file .env.docker \
  -f compose.production.yaml \
  ps

curl --fail --silent --show-error https://localhost:3443/
curl --fail --silent --show-error https://localhost:3443/robots.txt
curl --fail --silent --show-error https://localhost:3443/sitemap.xml
```

En Preview:

- `/` responde `200`;
- `robots.txt` incluye `Disallow: /`;
- el sitemap está vacío;
- el banner de demostración permanece visible;
- el formulario sólo funciona con claves de prueba/configuración autorizada.

### 8. Logs

```bash
docker compose \
  --env-file .env.docker \
  -f compose.production.yaml \
  logs --follow web
```

Los logs no deben incluir payload, nombre, correo, teléfono, mensaje, IP ni tokens.

### 9. Detener

```bash
docker compose \
  --env-file .env.docker \
  -f compose.production.yaml \
  down
```

## Build directo sin Compose

Para diagnosticar el `Dockerfile`:

```bash
docker build \
  --target runner \
  --build-arg NEXT_PUBLIC_SITE_URL=https://localhost:3443 \
  --build-arg SITE_MODE=preview \
  --build-arg CONTENT_APPROVED=false \
  --build-arg NEXT_PUBLIC_SANITY_DATASET=staging \
  --build-arg NEXT_PUBLIC_SANITY_API_VERSION=2026-07-01 \
  --tag maykitpsic:local \
  .
```

El runner standalone habla HTTP sólo dentro de la red del contenedor. Para diagnosticar
su arranque sin publicar ese puerto:

```bash
docker run \
  --rm \
  --init \
  --env-file .env.docker \
  --read-only \
  --tmpfs /tmp \
  --tmpfs /app/.next/cache \
  --cap-drop ALL \
  --security-opt no-new-privileges \
  maykitpsic:local
```

Para acceder desde un navegador se debe utilizar
`compose.production.yaml`, que agrega la terminación HTTPS de Caddy. No se debe publicar
directamente el puerto HTTP del runner.

No incluir secretos directamente en la línea de comandos: pueden quedar en el historial
del shell o ser visibles en la lista de procesos.

## Configuración de Vercel

### Qué usa Vercel

Vercel utiliza:

- `package.json` y `yarn.lock`;
- `engines.node >=22.12`;
- `vercel.json`;
- `next.config.js`;
- variables definidas en Development, Preview/Custom y Production.

`vercel.json` fija:

```text
Framework: Next.js
Install: yarn install --frozen-lockfile
Build: yarn build
```

Vercel no necesita Docker Engine, Docker Compose, registry ni una imagen publicada.

### Primera conexión

1. Publicar el repositorio privado.
2. Vercel → Add New → Project.
3. Importar el repositorio.
4. Confirmar Framework: Next.js.
5. Confirmar Node.js 22.x.
6. No configurar Output Directory.
7. Cargar variables por ambiente.
8. Crear primero un Preview Deployment.

Con Vercel CLI autorizada:

```bash
vercel link
vercel pull --environment=preview
vercel
```

### Staging

Usar una rama `staging` con dominio estable o un Custom Environment. Configurar:

```env
SITE_MODE=preview
CONTENT_APPROVED=false
```

Asignar variables y dominio sólo a esa rama/ambiente. Seguir la sección Staging de
`environments-and-deployment.md`.

### Production

Configurar todas las variables Production y únicamente después de aprobación:

```env
SITE_MODE=production
CONTENT_APPROVED=true
```

Crear un candidato staged:

```bash
vercel --prod --skip-domain
```

Validar el deployment exacto y promover:

```bash
vercel promote [DEPLOYMENT_ID_O_URL]
vercel promote status
```

No ejecutar `docker compose up` en Vercel ni subir la imagen a Vercel.

## Diferencias entre Docker y Vercel

| Tema | Docker standalone | Vercel |
| --- | --- | --- |
| Build | `docker build` | plataforma Vercel |
| Runtime | proceso Node en contenedor | funciones/runtime administrado |
| Variables públicas | build args | variables del ambiente durante build |
| Secretos | `--env-file` al ejecutar | Environment Variables |
| TLS | responsabilidad de plataforma/proxy | Vercel + Cloudflare |
| Escalamiento | responsabilidad operativa | administrado |
| Cache multi-instancia | requiere diseño | administrado por plataforma |
| Rollback | registry/orquestador por definir | deployment rollback |
| Destino aprobado | portabilidad/prueba | Production |

## Actualizar dependencias o Node

1. Actualizar `.nvmrc`, `package.json` y `Dockerfile` de forma coordinada.
2. Confirmar compatibilidad de Next.js y Sanity.
3. Reconstruir sin cache al menos una vez:

   ```bash
   docker compose build --no-cache
   ```

4. Ejecutar lint, pruebas, build y smoke test.
5. Revisar advisories de la imagen base y paquetes.
6. Generar nuevo deployment Vercel y nueva imagen; no mutar una imagen ya aprobada.

El tag `node:22-bookworm-slim` recibe nuevas revisiones. Para releases con requisitos de
reproducibilidad más estrictos conviene fijar el digest aprobado y automatizar su
renovación mediante una herramienta revisada.

## Problemas frecuentes

| Síntoma | Causa probable | Acción |
| --- | --- | --- |
| Docker no existe en WSL | integración deshabilitada | habilitar WSL Integration |
| `.env.local` no existe | Compose Development lo requiere | copiar `.env.example` |
| Puerto 3000 ocupado | otro proceso/contenedor | detenerlo o cambiar puerto publicado |
| Cambios no aparecen | watcher/bind mount | revisar volumen y `WATCHPACK_POLLING` |
| Dependencias inconsistentes | volumen antiguo | `docker compose down --volumes` y rebuild |
| Build sin memoria | Sanity Studio es pesado | aumentar memoria de Docker Desktop |
| `server.js` no existe | falta standalone/build fallido | revisar `output` y logs del builder |
| Contenedor unhealthy | servidor no inicia o robots falla | revisar `docker compose logs web` |
| Formulario `403` | origen/Turnstile no coinciden | revisar valores del ambiente |
| Vercel intenta usar Docker | configuración manual incorrecta | seleccionar preset Next.js y raíz |
| Vercel difiere del contenedor | variables/build args diferentes | comparar matriz sin exponer secretos |

## Seguridad para self-hosting

El contenedor no debe exponerse directamente a internet. Si en el futuro se aprueba
self-hosting, se requiere otro ADR que defina:

- plataforma/orquestador y registry;
- proxy o load balancer administrado;
- TLS, WAF, rate limit y DDoS;
- secretos, rotación y logs;
- cache compartido/múltiples réplicas;
- health/readiness, autoscaling y despliegues;
- parches de imagen y escaneo;
- rollback y respuesta a incidentes.

Hasta entonces, Cloudflare + Vercel permanece como arquitectura Production.

## Referencias

- [Despliegue Docker de Next.js](https://nextjs.org/docs/app/getting-started/deploying)
- [Self-hosting de Next.js](https://nextjs.org/docs/app/guides/self-hosting)
- [Ejemplo oficial `with-docker`](https://github.com/vercel/next.js/tree/canary/examples/with-docker)
- [Imagen oficial de Node](https://hub.docker.com/_/node/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Vercel Git deployments](https://vercel.com/docs/git)
- [Vercel CLI deployments](https://vercel.com/docs/cli/deploying-from-cli)
