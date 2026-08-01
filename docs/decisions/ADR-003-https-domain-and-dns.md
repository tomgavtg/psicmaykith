# ADR-003: HTTPS obligatorio, dominio canónico y autoridad DNS

## Estado

Aceptada el 30 de julio de 2026.

## Contexto

La implementación permitía HTTP en loopback para Development y mantenía pendientes el
dominio y la variante canónica. La persona responsable confirmó:

- todas las rutas navegables deben usar HTTPS;
- el dominio registrado en Namecheap es `psicologamayumikitahara.com`;
- el sitio debe desplegarse en Vercel y utilizar Cloudflare.

La inspección pública mostró que `www` apuntaba a un CNAME histórico de Vercel con
certificado vencido y que el apex seguía apuntando a un A de Namecheap. También existen
registros de Namecheap Private Email que no deben perderse.

## Decisión

1. La URL canónica será `https://www.psicologamayumikitahara.com`.
2. `https://psicologamayumikitahara.com` redirigirá permanentemente a la misma ruta en
   `www` mediante la regla versionada en `next.config.js`.
3. Namecheap permanecerá como registrador.
4. Cloudflare será DNS autoritativo, proxy y terminación TLS pública.
5. Vercel será runtime y origen HTTPS.
6. Development utilizará `https://localhost:3000` con un certificado `mkcert`
   individual por estación.
7. Docker Development utilizará el mismo certificado.
8. Docker Production-like expondrá sólo `https://localhost:3443` mediante Caddy; el
   HTTP del servidor standalone quedará aislado dentro de la red de Compose.
9. Las variables o URLs públicas HTTP serán rechazadas por la normalización de
   configuración.
10. Cloudflare utilizará Full (strict) y Always Use HTTPS. HSTS y DNSSEC se activarán
    únicamente en el orden seguro descrito por el runbook.

## Registros y valores externos

Los dos nameservers de Cloudflare y los destinos específicos de Vercel no se pueden
inventar ni fijar antes de crear la zona y vincular el proyecto. El Dashboard de cada
proveedor o `vercel domains inspect` debe proporcionar los valores exactos.

Se deben conservar MX, SPF y CNAME de Namecheap Private Email. DKIM, DMARC, CAA y
verificaciones sólo se agregan con valores confirmados por el proveedor.

## Actualización operativa del 1 de agosto de 2026

El proyecto fue desplegado en Vercel y los destinos específicos quedaron registrados
en el runbook de dominio. La zona fue creada en Cloudflare y conserva Namecheap Private
Email. El buzón empresarial confirmado es
`contacto@psicologamayumikitahara.com`; Gmail se utilizará sólo como cliente IMAP/SMTP,
sin migrar los MX a Google Workspace.

La consulta pública del 1 de agosto de 2026 confirmó la delegación autoritativa hacia
Cloudflare, los destinos web de Vercel, HTTPS canónico, redirección `308` y los registros
MX, SPF, DKIM, DMARC, SRV y autoconfiguración de Private Email. Los registros web se
encuentran en DNS only; la activación de proxy, Full (strict), DNSSEC y HSTS mantiene el
orden seguro definido por este ADR y el runbook.

Los valores completos de verificación y DKIM se obtienen de los paneles y no se
versionan.

## Consecuencias

- Cada estación necesita crear y confiar su propia CA de desarrollo.
- Los certificados y llaves locales permanecen fuera de Git.
- Copiar `.env.example` produce desde el inicio una URL HTTPS válida.
- El contenedor standalone no se debe publicar directamente hacia usuarios.
- La migración de nameservers exige inventario y recreación completa del correo.
- El CNAME histórico no se reutiliza hasta confirmar que pertenece al proyecto Vercel
  actual.
- Un DS de DNSSEC incorrecto puede interrumpir todo el dominio; se publica sólo después
  de estabilizar Cloudflare.

## Documentación normativa

- [`../runbooks/local-https-certificates.md`](../runbooks/local-https-certificates.md)
- [`../runbooks/domain-cloudflare-vercel.md`](../runbooks/domain-cloudflare-vercel.md)
- [`../runbooks/docker-and-vercel.md`](../runbooks/docker-and-vercel.md)
