# Entrega: CSP de Sanity Studio

## Problema

Sanity Studio mostraba `Failed to fetch version for package (using tag=latest)` al
abrir `/admin`. El comprobador de versiones solicita metadatos a
`https://sanity-cdn.com/v1/modules/...`, pero la política `connect-src` no autorizaba
ese origen.

## Decisión e implementación

- Se autoriza `https://sanity-cdn.com` y `https://*.sanity-cdn.com` únicamente cuando
  la ruta comienza con `/admin`.
- La CSP de las páginas públicas no se amplía.
- Se conserva el resto de controles de seguridad y se añade una prueba de regresión.

## Verificación requerida después del despliegue

1. Abrir `/admin` con una sesión autorizada.
2. Confirmar en Network que la consulta a `sanity-cdn.com/v1/modules/` está permitida.
3. Confirmar que desaparece el error del comprobador de versión.
4. Revisar que una página pública no incluya `sanity-cdn.com` en su encabezado CSP.

No se agregaron tokens, credenciales ni datos personales.
