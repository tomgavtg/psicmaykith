# Handoff de documentación de dominio y correo

## Entrega

Se actualizó la documentación operativa el 1 de agosto de 2026 con el estado confirmado
por la persona responsable:

- aplicación desplegada en Vercel;
- zona DNS creada en Cloudflare;
- destinos específicos de Vercel documentados para apex y `www`;
- Namecheap permanece como registrador y proveedor de Private Email;
- buzón empresarial creado: `contacto@psicologamayumikitahara.com`;
- Gmail se utilizará como cliente IMAP/SMTP, no como proveedor ni Google Workspace.

## Archivos

- [`../../README.md`](../../README.md)
- [`../runbooks/domain-cloudflare-vercel.md`](../runbooks/domain-cloudflare-vercel.md)
- [`../runbooks/namecheap-private-email-gmail.md`](../runbooks/namecheap-private-email-gmail.md)
- [`open-items.md`](open-items.md)

## Decisiones y supuestos

- El A `216.198.79.1` y el CNAME
  `a0acb4f07fdaaf22.vercel-dns-017.com` son los valores específicos entregados por
  Vercel para el proyecto actual; el Dashboard continúa siendo autoritativo si cambian.
- Los 10 registros mostrados por Cloudflare se consideran el inventario ya configurado.
- DKIM y DMARC completan la zona esperada de 12 registros.
- Todos los registros permanecen DNS only durante la validación inicial. Después sólo
  `@` y `www` pueden cambiarse a Proxied.
- El TXT de verificación de Vercel, la clave DKIM y los nameservers asignados no se
  versionan completos.
- DMARC inicia con `p=none`; no se endurece hasta validar SPF y DKIM alineados.
- La cuenta Gmail personal no sustituye a Google Workspace. El acceso documentado es
  la aplicación Gmail mediante IMAP/SMTP cifrado.
- La verificación pública posterior confirmó Cloudflare autoritativo, destinos web en
  DNS only, HTTPS canónico, redirección `308` y todos los registros esperados de correo.

## Riesgos y pendientes

- Falta ejecutar y registrar una prueba sintética de envío/recepción desde webmail y
  Gmail.
- Falta decidir si los registros web pasarán a Proxied y, si se aprueba, verificar Full
  (strict), certificados y ausencia de bucles después del cambio.
- Falta confirmar si el buzón empresarial también será `LEADS_TO_EMAIL` para Resend.
- HSTS y DNSSEC deben permanecer pendientes hasta estabilizar DNS, HTTPS y correo.

## Evidencia requerida para cierre

- consultas NS, A/CNAME, MX, SPF, DKIM, DMARC y SRV desde dos resolvedores;
- Vercel muestra ambos dominios válidos y con certificado;
- HTTPS canónico y redirección de apex sin bucles;
- prueba sintética de envío y recepción por webmail y Gmail;
- ausencia de secretos o contenido de mensajes reales en la evidencia.
