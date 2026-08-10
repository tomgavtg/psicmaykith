# Entrega: páginas públicas y descubrimiento en búsqueda/IA

Fecha: 10 de agosto de 2026

## Entrega

- Se añadieron páginas públicas para perfil, modalidad, tres servicios y preguntas
  frecuentes, todas construidas con contenido real de Sanity o el fallback seguro.
- Se amplió el sitemap con esas rutas y fechas de actualización disponibles.
- Se separaron rastreadores de búsqueda de rastreadores de entrenamiento en robots.
- Se añadieron `ProfilePage`, `Service`, `FAQPage` y `BreadcrumbList` sin publicar
  honorarios, dirección, reseñas ni identidad legal.
- Se añadieron enlaces internos desde tarjetas de servicios y pie de página.
- Se publicó `/.well-known/security.txt` con el canal de reporte y se añadieron
  `X-Robots-Tag` y `Cache-Control: no-store` a las rutas `/admin` y `/api`.
- Se documentó el proceso externo de Search Console, Bing, IndexNow y consistencia de
  perfiles.
- Se actualizaron Next.js, Sanity y sus integraciones a versiones compatibles
  corregidas. Las dependencias transitivas vulnerables se fijaron con resoluciones
  selectivas; `yarn audit --groups dependencies` reporta **0 vulnerabilidades** sobre
  1,126 paquetes auditados.

## Decisiones

- No se creó un blog ni páginas por alcaldía.
- No se agregó `llms.txt`: no es necesario para la indexación de Google ni sustituye
  contenido, sitemap o robots.
- Se permite búsqueda por asistentes, pero se bloquean `GPTBot`, `ClaudeBot` y
  `Google-Extended` como decisión conservadora de privacidad.
- `/api/contact` no se retiró todavía. Aunque la interfaz actual no la utiliza, sigue
  documentada como ruta contractual y cuenta con validación, Turnstile y rate limiting.
- Las resoluciones de seguridad de `package.json` se mantienen acotadas a la rama
  transitiva afectada. Conviene retirarlas cuando Sanity y sus dependencias declaren
  directamente las versiones corregidas; cada actualización debe repetir auditoría,
  pruebas y build.

## Pendientes externos

- Confirmar indexación y enviar sitemap en Search Console y Bing Webmaster Tools.
- Decidir custodio e implementación autenticada de IndexNow.
- Corregir perfiles externos y llenar `socialProfiles` sólo con URLs oficiales.
- Validar el contenido y JSON-LD publicados después del despliegue.
- Renovar la fecha `Expires` de `security.txt` antes del 10 de agosto de 2027.

## Verificación técnica

- `yarn lint`: correcto.
- `yarn test`: 14 archivos y 64 pruebas correctas.
- `yarn build`: compilación de producción correcta con Next.js 16.3.0.
- `yarn audit --groups dependencies`: 0 vulnerabilidades.
