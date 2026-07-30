# ADR-002: Portabilidad con Docker y producción en Vercel

- **Estado:** aceptada
- **Fecha:** 2026-07-30
- **Responsables:** producto y arquitectura
- **Modifica parcialmente:** [ADR-001](ADR-001-lightweight-vercel-architecture.md)

## Contexto

ADR-001 excluyó Docker porque Vercel ya administraba el runtime y no existía un
requisito de portabilidad. El 30 de julio de 2026 la persona responsable solicitó
explícitamente poder ejecutar la aplicación con Docker y Docker Compose, conservando
Vercel como destino de despliegue.

Esta solicitud satisface la señal de reconsideración registrada en ADR-001:
**requisito de portabilidad**. No introduce Django, base de datos, Redis, Celery, Nginx,
persistencia de leads ni un cambio de proveedor productivo.

## Decisión

Se acepta Docker como ruta adicional de empaquetado y ejecución:

- `Dockerfile` multi-stage para Development y un runtime Production standalone.
- `compose.yaml` para desarrollo con hot reload.
- `compose.production.yaml` para validar localmente una imagen equivalente a
  producción.
- `output: "standalone"` de Next.js para una imagen mínima de runtime.
- usuario sin privilegios, filesystem de sólo lectura, capacidades eliminadas y
  healthcheck en la configuración Production de Compose.

Vercel continúa siendo el destino recomendado de Production:

- Vercel construye desde `package.json`, `yarn.lock`, `next.config.js` y `vercel.json`.
- Vercel no construye ni ejecuta el `Dockerfile`.
- Cloudflare permanece delante de Vercel como DNS, proxy y control perimetral.
- Los runbooks y el checklist de Vercel siguen siendo normativos para el lanzamiento.

## Separación de configuración

Las variables `NEXT_PUBLIC_*` se incrustan durante `next build`; por eso la imagen
Docker recibe esos valores como build arguments. Las llaves y valores sólo de servidor
se inyectan al iniciar el contenedor y nunca se copian a la imagen.

El mismo principio aplica en Vercel: los valores públicos existen durante build y los
secretos se administran por ambiente en la plataforma.

La imagen no se debe promover entre ambientes si sus valores `NEXT_PUBLIC_*` cambian.
Debe producirse una imagen distinta por ambiente o rediseñarse la aplicación para
obtener configuración pública en runtime.

## Consecuencias positivas

- Desarrollo reproducible sin instalar Node/Yarn en el host.
- Validación local del artefacto standalone.
- Portabilidad futura hacia una plataforma compatible con contenedores.
- Vercel conserva deployments, previews, integración Git y rollback administrados.
- La aplicación sigue sin incorporar persistencia de datos.

## Costos y riesgos

- El equipo debe mantener parches de la imagen base y reconstruir imágenes.
- El Studio de Sanity aumenta el tamaño del build standalone.
- Los bind mounts pueden ser más lentos en Docker Desktop sobre macOS/Windows.
- Los valores públicos quedan fijados por imagen.
- Un contenedor público autogestionado necesita proxy, TLS, límites, escalamiento,
  registro, monitoreo, backups de configuración y respuesta a incidentes.
- El cache de Next.js es local por instancia; múltiples réplicas necesitarían una
  estrategia explícita de coordinación.

## Salvaguardas

- Imagen oficial Node 22 basada en Debian slim.
- Instalación reproducible con `yarn install --frozen-lockfile`.
- Multi-stage build y salida standalone.
- Runtime como usuario `nextjs`, sin capabilities y con `no-new-privileges`.
- Archivos `.env*`, certificados, `.git`, tests y documentación fuera del contexto
  final.
- `SITE_MODE=preview` y `CONTENT_APPROVED=false` como defaults.
- Secrets sólo al ejecutar el contenedor.
- Vercel sigue siendo Production hasta que otro ADR apruebe self-hosting.

## Alternativas

### Reemplazar Vercel por contenedores

No se acepta. Ampliaría operación, seguridad y disponibilidad sin un proveedor,
registry, presupuesto o responsables aprobados.

### Usar Docker sólo para Production

No satisface el objetivo de una experiencia reproducible de desarrollo. Se incluyen
ambos targets, manteniendo ejecución nativa como la opción más rápida cuando Node 22
está disponible.

### Ejecutar Vercel dentro de Docker

No corresponde al modelo de Vercel. La plataforma usa su propio proceso de build y no
necesita el contenedor local.

## Criterios de revisión

Se requiere un ADR nuevo antes de:

- publicar el contenedor fuera de Vercel;
- añadir registry o CI de imágenes;
- agregar Nginx, Kubernetes o un balanceador;
- ejecutar más de una réplica;
- persistir cache, sesiones o leads;
- cambiar la imagen base o runtime principal.
