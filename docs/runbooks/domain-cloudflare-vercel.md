# Runbook de Namecheap, Cloudflare y Vercel

## Propósito y momento de uso

Este runbook describe la configuración de producción. La Fase 2 está autorizada, pero
los cambios de dominio sólo deben ejecutarse con responsables, ventana, respaldo y
checklist aprobados. Cloudflare será DNS autoritativo y proxy; Vercel alojará la
aplicación y gestionará el certificado del origen.

Configuración aprobada para este proyecto:

- registrador: Namecheap;
- dominio: `psicologamayumikitahara.com`;
- URL canónica: `https://www.psicologamayumikitahara.com`;
- redirección permanente: `https://psicologamayumikitahara.com/*` hacia la misma ruta
  en `https://www.psicologamayumikitahara.com/*`;
- DNS autoritativo y proxy: Cloudflare;
- runtime y certificado del origen: Vercel.

No se deben copiar aquí tokens, IDs de cuenta, códigos de transferencia, valores de
verificación ni llaves privadas.

## Estado público observado el 30 de julio de 2026

Antes de aplicar cambios se observaron estos registros públicos:

| Tipo | Host | Valor observado | Tratamiento |
| --- | --- | --- | --- |
| NS | `@` | `dns1.registrar-servers.com` y `dns2.registrar-servers.com` | reemplazar por los dos NS exactos asignados por Cloudflare |
| A | `@` | `162.255.119.231` | retirar al apuntar el apex al proyecto Vercel |
| CNAME | `www` | `a4b45797e67e334c.vercel-dns-017.com` | no reutilizar hasta que Vercel confirme que pertenece al proyecto actual |
| MX | `@` | `mx1.privateemail.com`, prioridad 10 | conservar en Cloudflare, DNS only |
| MX | `@` | `mx2.privateemail.com`, prioridad 10 | conservar en Cloudflare, DNS only |
| TXT | `@` | `v=spf1 include:spf.privateemail.com ~all` | conservar en Cloudflare, DNS only |
| CNAME | `mail` | `privateemail.com` | conservar en Cloudflare, DNS only |
| CNAME | `autoconfig` | `privateemail.com` | conservar en Cloudflare, DNS only |
| CNAME | `autodiscover` | `privateemail.com` | conservar en Cloudflare, DNS only |

El certificado presentado por `www.psicologamayumikitahara.com` venció el 20 de enero
de 2026 y el dominio raíz no respondió por HTTPS durante la inspección. Por eso el
lanzamiento requiere que Vercel verifique ambos hostnames y emita certificados nuevos
antes de activar el proxy o anunciar el sitio.

Este inventario es sólo una fotografía del DNS público. Antes de cambiar nameservers se
debe exportar o capturar también todo registro visible en Namecheap, incluso si no
aparece mediante las consultas anteriores.

## Responsables y prerrequisitos

Antes de iniciar se debe contar con:

- aprobación de Fase 2 y ventana de cambio;
- acceso nominal con MFA, cuando esté disponible, al registrador, Cloudflare y Vercel;
- propiedad comprobada de `psicologamayumikitahara.com` y titular confirmado;
- proyecto Vercel de producción y deployment validado;
- inventario y respaldo de los registros DNS existentes;
- URL canónica confirmada: `https://www.psicologamayumikitahara.com`;
- planes contratados y funciones disponibles
  `[POR DEFINIR: planes de Cloudflare y Vercel]`;
- responsable técnico y contacto de reversión
  `[POR DEFINIR: responsables operativos]`;
- TTL actuales y dependencias de correo, verificación u otros subdominios revisados.

No se debe cambiar nameserver o borrar registros sin identificar antes MX, SPF, DKIM,
DMARC, verificaciones y servicios existentes.

## Datos a registrar en el ticket de cambio

```text
Dominio: psicologamayumikitahara.com
Variante canónica: https://www.psicologamayumikitahara.com
Cuenta/zona de Cloudflare:
Proyecto de Vercel:
Deployment aprobado:
DNS actuales respaldados:
Ventana:
Responsable:
Rollback autorizado por:
```

Los identificadores internos pueden estar en el sistema seguro de operación, no en este
repositorio.

## Procedimiento

### 1. Preparar Vercel

1. Desplegar y validar la aplicación mediante el dominio temporal de preview, sin
   habilitar recepción real de leads.
2. Abrir Vercel → proyecto → **Settings → Domains**.
3. Agregar `www.psicologamayumikitahara.com`.
4. Agregar `psicologamayumikitahara.com`.
5. Marcar `www.psicologamayumikitahara.com` como dominio de Production.
6. Confirmar que la redirección 308 versionada en `next.config.js` envía el dominio
   raíz a `www`, preservando ruta y query. No crear una segunda regla equivalente en
   Cloudflare.
7. Si Vercel muestra que el dominio pertenece a otra cuenta o proyecto, añadir el TXT
   de verificación exacto que solicite; no usar un valor de ejemplo.
8. Para cada hostname, copiar el destino mostrado por Vercel o ejecutar:

   ```bash
   vercel domains inspect psicologamayumikitahara.com
   vercel domains inspect www.psicologamayumikitahara.com
   ```

9. Comparar el CNAME solicitado para `www` con el valor histórico
   `a4b45797e67e334c.vercel-dns-017.com`. Si difieren, usar el valor nuevo.
10. No continuar hasta tener registrados el A del apex, el CNAME de `www` y cualquier
    TXT de verificación específico.

Vercel publica como valores generales `76.76.21.21` para apex y
`cname.vercel-dns-0.com` para subdominios, pero un proyecto puede recibir valores
específicos. La salida del Dashboard o de `vercel domains inspect` es autoritativa.

La redirección canónica existe en Next.js/Vercel y Cloudflare sólo debe forzar HTTPS;
duplicar la redirección canónica en Cloudflare puede producir bucles.

### 2. Crear la zona en Cloudflare antes de tocar Namecheap

1. En Cloudflare, seleccionar **Add a domain**.
2. Introducir `psicologamayumikitahara.com`, sin `www` ni protocolo.
3. Elegir el plan aprobado.
4. Permitir el escaneo inicial de DNS.
5. Comparar los registros importados con la tabla de estado y con la exportación de
   Namecheap.
6. Añadir cualquier MX, SPF, DKIM, DMARC, verificación o subdominio faltante.
7. Copiar los dos nameservers exactos asignados por Cloudflare. Tendrán forma similar a
   `nombre.ns.cloudflare.com`, pero sus nombres reales no se pueden predecir.
8. Todavía no activar DNSSEC ni borrar registros en Namecheap.

### 3. Registros que deben existir en Cloudflare

Agregar los registros web con proxy **DNS only** durante la verificación inicial:

| Tipo | Nombre | Destino | Proxy | TTL |
| --- | --- | --- | --- | --- |
| A | `@` | valor exacto de Vercel; general `76.76.21.21` | DNS only inicialmente | Auto |
| CNAME | `www` | valor exacto de Vercel; general `cname.vercel-dns-0.com` | DNS only inicialmente | Auto |
| TXT | el indicado por Vercel | valor exacto de verificación, sólo si lo solicita | DNS only | Auto |

Conservar o recrear los registros de correo observados:

| Tipo | Nombre | Destino/valor | Prioridad | Proxy |
| --- | --- | --- | --- | --- |
| MX | `@` | `mx1.privateemail.com` | 10 | DNS only |
| MX | `@` | `mx2.privateemail.com` | 10 | DNS only |
| TXT | `@` | `v=spf1 include:spf.privateemail.com ~all` | — | DNS only |
| CNAME | `mail` | `privateemail.com` | — | DNS only |
| CNAME | `autoconfig` | `privateemail.com` | — | DNS only |
| CNAME | `autodiscover` | `privateemail.com` | — | DNS only |

No se debe inventar DKIM o DMARC. Si Namecheap Private Email muestra registros
adicionales en su panel, deben copiarse exactamente. MX, TXT, DKIM y registros de
verificación siempre permanecen **DNS only**.

Antes de guardar:

1. eliminar el A histórico `@ → 162.255.119.231` sólo cuando el A de Vercel esté listo;
2. sustituir el CNAME histórico de `www` sólo si Vercel entrega uno diferente;
3. evitar registros A/AAAA duplicados para `@` o `www`;
4. no crear CNAME en `@`;
5. no activar proxy en registros de correo o verificación.

### 4. Cambiar los nameservers en Namecheap

1. Entrar a Namecheap → **Domain List**.
2. Seleccionar **Manage** para `psicologamayumikitahara.com`.
3. En la pestaña **Domain**, localizar **Nameservers**.
4. Si DNSSEC está activo, desactivarlo antes del cambio y confirmar que no queda un DS
   publicado para los nameservers anteriores.
5. Elegir **Custom DNS**.
6. Pegar únicamente los dos nameservers exactos asignados por Cloudflare, uno por
   renglón.
7. Guardar con la marca de confirmación.
8. No agregar A, CNAME, MX ni TXT en **Advanced DNS** de Namecheap después de delegar:
   Cloudflare será autoritativo y esos Host Records ya no tendrán efecto.
9. Esperar a que Cloudflare muestre la zona como **Active**.
10. Verificar:

   ```bash
   dig NS psicologamayumikitahara.com @1.1.1.1
   dig NS psicologamayumikitahara.com @8.8.8.8
   ```

Namecheap puede tardar hasta 24 horas y Cloudflare advierte que la activación puede
tardar hasta 24 horas. No repetir cambios mientras la propagación sigue en curso.

### 5. Verificar Vercel y activar el proxy de Cloudflare

1. Con la zona `Active`, ejecutar nuevamente:

   ```bash
   vercel domains inspect psicologamayumikitahara.com
   vercel domains inspect www.psicologamayumikitahara.com
   vercel certs ls
   ```

2. Confirmar en Vercel que ambos dominios están verificados y tienen certificados
   vigentes.
3. Probar primero con los registros web en **DNS only**:

   ```bash
   curl -I https://www.psicologamayumikitahara.com
   curl -I https://psicologamayumikitahara.com
   ```

4. Confirmar que `www` responde y que el apex redirige una sola vez a HTTPS `www`.
5. Cambiar sólo los registros web `@` y `www` a **Proxied** —nube naranja—.
6. Mantener todos los registros de correo y verificación en **DNS only**.
7. Volver a probar HTTPS y la redirección.

Si Vercel deja de verificar, no puede renovar el certificado o Cloudflare muestra una
limitación por tratarse de otro CDN, volver temporalmente `@` y `www` a **DNS only**,
resolver la validación y documentar la decisión. Nunca se debe degradar TLS.

### 6. TLS y HTTPS

1. En Cloudflare → **SSL/TLS → Overview**, seleccionar **Full (strict)**.
2. En **Edge Certificates**, activar **Always Use HTTPS**.
3. Confirmar **Automatic HTTPS Rewrites** sólo como defensa adicional; el código no
   debe contener recursos HTTP.
4. Verificar que Vercel presenta un certificado público vigente al origen.
5. No usar `Flexible`.
6. Activar HSTS en Cloudflare sólo después de verificar raíz, `www`, correo web y todos
   los subdominios HTTPS. Comenzar con un `max-age` corto durante observación; aprobar
   por separado `includeSubDomains` y `preload`.
7. Mantener la cabecera HSTS de la aplicación; no enviar HSTS por HTTP.

Cloudflare y Vercel renuevan sus certificados automáticamente. Nunca se exporta ni se
guarda un certificado de producción en `/certs/` o en Git.

### 7. Activar DNSSEC después de estabilizar la delegación

1. Esperar hasta que Cloudflare muestre la zona `Active` y todos los registros
   funcionen.
2. En Cloudflare → **DNS → Settings**, activar DNSSEC.
3. Copiar exactamente `Key Tag`, `Algorithm`, `Digest Type` y `Digest`.
4. En Namecheap → **Advanced DNS → DNSSEC**, habilitar DNSSEC para Custom DNS.
5. Crear el DS con los cuatro valores exactos de Cloudflare.
6. Esperar propagación y validar la cadena antes de cerrar el cambio.

Un DS incorrecto puede volver inaccesible todo el dominio. Si ya existía DNSSEC, debe
retirarse el DS anterior antes de cambiar nameservers y crear el nuevo sólo al final.

### 8. Variables y hostnames permitidos

En el entorno Production de Vercel:

```env
NEXT_PUBLIC_SITE_URL=https://www.psicologamayumikitahara.com
ALLOWED_ORIGIN=https://www.psicologamayumikitahara.com
```

No debe incluirse `/` final. Turnstile, Sanity CORS, metadata, canonical, robots,
sitemap y el validador de `/api/contact` deben usar el mismo hostname aprobado. El
dominio raíz sólo redirige y no debe aceptarse como origen adicional del formulario.

### 9. Caché de Cloudflare

- Cloudflare puede cachear activos estáticos y respetar headers de Vercel.
- `/api/contact` y `/admin` deben llevar `Cache-Control: no-store` y reglas de bypass de
  caché.
- No se debe crear “Cache Everything” para rutas dinámicas.
- Las respuestas a `POST` no deben cachearse.
- Si se purga caché por una incidencia, debe preferirse URL o tag específico; una purga
  global sólo con causa documentada.

Las reglas WAF, bots, geoprotección y rate limit pertenecen al runbook de seguridad y
dependen del plan contratado.

### 10. Impedir bypass directo

1. Activar Vercel Deployment Protection para previews y aliases generados, según
   disponibilidad del plan.
2. Confirmar que `/api/contact` rechaza `Host` y `Origin` no canónicos.
3. Confirmar que `/admin` no se sirve en un alias no aprobado.
4. Elegir con seguridad una restricción nativa de origen, un encabezado autenticado
   sobrescrito por Cloudflare y validado en servidor, o un control equivalente.
5. Probar desde fuera del DNS proxied tanto el alias `*.vercel.app` como cualquier
   acceso directo disponible.
6. No confiar en `CF-Connecting-IP` ni headers similares hasta demostrar que una
   solicitud no puede llegar por una ruta que el cliente controle.

La capacidad exacta puede depender del plan de ambos proveedores. Si el acceso directo
permite evitar un control requerido de `/admin` o `/api/contact`, no se debe publicar.

## Alternativa no seleccionada: DNS directo en Namecheap

Si se decide retirar Cloudflare, Namecheap debe volver a **BasicDNS** y los registros
web se crearían en **Advanced DNS → Host Records**:

| Tipo | Host | Valor |
| --- | --- | --- |
| A | `@` | A exacto mostrado por Vercel |
| CNAME | `www` | CNAME exacto mostrado por Vercel |
| TXT | indicado por Vercel | sólo si Vercel solicita verificación |

Esta alternativa no proporciona el proxy, WAF ni las reglas Cloudflare definidas por la
arquitectura. No se deben mantener simultáneamente Cloudflare Custom DNS y esperar que
los Host Records de Namecheap sean autoritativos.

## Verificación

Registrar evidencia sin tokens ni datos personales:

- raíz y `www` resuelven a la configuración esperada;
- HTTP redirige una sola vez a HTTPS canónico;
- la variante no canónica redirige una sola vez y conserva ruta/query;
- `/`, `/aviso-de-privacidad`, `/robots.txt` y `/sitemap.xml` responden en canónico;
- `/admin` no se indexa, no se cachea y presenta autenticación/desafío;
- `/api/contact` rechaza `GET`, origen ajeno y body excesivo, y no se cachea;
- aliases y accesos directos no evitan controles de `/admin` o `/api/contact`;
- certificado válido en borde y conexión estricta al origen;
- canonical, Open Graph y sitemap no contienen dominio temporal de Vercel;
- Cloudflare muestra tráfico proxied y eventos sin bloquear bots verificados;
- correo del dominio sigue operativo si existía;
- IPv4 e IPv6, móvil y al menos dos resolvedores externos funcionan.

Conviene comprobar también cadenas de redirección, TLS y headers mediante herramientas
independientes aprobadas. No se debe pegar la respuesta de un formulario real en el
ticket.

## Rollback

1. Si el problema es de aplicación, promover en Vercel el último deployment aprobado.
2. Si el problema es un registro hacia Vercel, restaurar únicamente los valores
   respaldados y su estado de proxy.
3. Si hay un bucle TLS, confirmar primero modo Full (strict), certificado del origen y
   reglas de redirección; no degradar permanentemente a `Flexible`.
4. Si DNSSEC falla después de publicar DS, corregir el par o retirar el DS desde el
   registrador según el procedimiento controlado.
5. Si el cambio de nameservers debe revertirse, restaurar los autoritativos anteriores
   sólo cuando la zona previa siga íntegra.
6. Documentar inicio, alcance, acción, validación y cierre.

Los cambios de DNS pueden permanecer en caché hasta su TTL. El rollback no garantiza
efecto instantáneo.

## Operación continua

- Revisar expiración/renovación del dominio y mantener auto-renovación con método de
  pago controlado.
- Auditar accesos nominales y MFA al menos trimestralmente.
- Revisar certificados, DNSSEC, Security Events y alertas.
- Comparar periódicamente los dominios configurados en Vercel, Turnstile, Sanity y
  variables.
- Registrar todo cambio DNS con antes, después y rollback.
- No modificar reglas durante una campaña sin validar impacto en conversiones, SEO y
  previews sociales.

## Asuntos por definir

- titular y responsables operativos;
- exportación completa de los registros privados/no observables desde Namecheap;
- proyecto Vercel que debe reclamar el CNAME histórico de `www`;
- planes de Cloudflare y Vercel;
- política HSTS final;
- ventana de migración y criterios de rollback;
- CAA, si se utiliza, con emisores compatibles confirmados por ambos proveedores.
- protección de origen/bypass y fuente confiable de IP.

## Referencias oficiales

- [Configurar un dominio personalizado en Vercel](https://vercel.com/docs/domains/set-up-custom-domain)
- [Agregar un dominio en Vercel](https://vercel.com/docs/domains/working-with-domains/add-a-domain)
- [Configuración completa de DNS en Cloudflare](https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/)
- [Estado Proxied y DNS only en Cloudflare](https://developers.cloudflare.com/dns/proxy-status/)
- [TLS Full (strict) en Cloudflare](https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/full-strict/)
- [Always Use HTTPS en Cloudflare](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/always-use-https/)
- [Cambiar DNS en Namecheap](https://www.namecheap.com/support/knowledgebase/article.aspx/767/10/how-to-change-dns-for-a-domain/)
- [Host Records en Namecheap](https://www.namecheap.com/support/knowledgebase/article.aspx/434/2237/how-do-i-set-up-host-records-for-a-domain/)
- [DNSSEC con Custom DNS en Namecheap](https://www.namecheap.com/support/knowledgebase/article.aspx/9722/2232/managing-dnssec-for-domains-pointed-to-custom-dns/)
