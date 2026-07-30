# Runbook de seguridad en Cloudflare

## Propósito y condición de uso

Este runbook describe la configuración prevista. La Fase 2 está autorizada, pero cada
cambio requiere dominio, plan, responsables y rollback confirmados. Los nombres y menús
de Cloudflare cambian y deben verificarse en el dashboard vigente. Toda regla debe
probarse primero con eventos o acción no terminal, después con `Managed Challenge` y
sólo bloquear cuando exista evidencia.

Valores requeridos:

```text
[POR DEFINIR: zona/dominio]
[POR DEFINIR: host canónico]
[POR DEFINIR: plan Cloudflare]
[POR DEFINIR: países atendidos; propuesta inicial MX]
[POR DEFINIR: identidades administrativas]
[POR DEFINIR: lista admin_ips]
[POR DEFINIR: responsables de alertas]
```

## Prerrequisitos

1. Confirmar propiedad del dominio, plan, host canónico y registros de Vercel.
2. Activar MFA en cuentas Cloudflare y usar roles mínimos; conservar recuperación en
   un medio separado.
3. Confirmar que los registros web están en modo **Proxied** y que TLS con Vercel está
   en **Full (strict)** conforme al runbook de dominio.
4. Activar redirección HTTPS y TLS mínimo 1.2 si la compatibilidad aprobada lo permite.
5. Proteger previews y URLs de deployment en Vercel. Cloudflare no protege una URL
   `*.vercel.app` ni el origen alcanzado por fuera de la zona.
6. Exportar o capturar la configuración anterior sin incluir secretos y preparar
   rollback.

## Orden sugerido de despliegue

1. TLS/DNS y protección de deployments.
2. WAF administrado.
3. reglas de métodos y rutas de ataque;
4. `/admin`;
5. `/api/contact` por país;
6. rate limit;
7. bots;
8. alertas y observación durante `[POR DEFINIR: periodo]`;
9. endurecimiento final.

Antes y después de cada paso se deben probar `/`, `/aviso-de-privacidad`, activos,
Turnstile, `POST /api/contact`, bots verificados y autenticación de `/admin`.

## DDoS y WAF administrado

En **Security > WAF > Managed rules**:

- En Free debe habilitarse `Cloudflare Free Managed Ruleset`.
- En Pro o superior conviene habilitar `Cloudflare Managed Ruleset` y `Cloudflare
  OWASP Core Ruleset`, con los defaults del proveedor y ajustes basados en eventos.
- No se deben habilitar indiscriminadamente todas las reglas desactivadas.
- Las excepciones deben ser mínimas, con ruta, regla, motivo, responsable y caducidad.
  Nunca se debe omitir todo el WAF para que funcione el formulario o Studio.

La protección DDoS administrada se debe mantener activa. “Under Attack Mode” sólo debe
usarse para un incidente activo porque puede afectar accesibilidad, SEO, previews y
conversión.

Disponibilidad actual:
[Cloudflare Managed Rules](https://developers.cloudflare.com/waf/managed-rules/).

## Reglas personalizadas

Las expresiones son una intención verificable, no texto para pegar sin revisar. Se debe
usar el constructor del dashboard, confirmar sintaxis/campos del plan y acotar al host
canónico cuando el plan lo permita.

### 1. Métodos innecesarios

Nombre: `block-unused-methods`

```text
http.request.method in {"TRACE" "CONNECT" "PUT" "PATCH" "DELETE"}
```

Acción: `Block`.

Además, `/api/contact` sólo admite `POST`. Conviene bloquear cualquier otro método
contra esa ruta o dejar que el origen responda `405` durante diagnóstico:

```text
http.request.uri.path eq "/api/contact"
and http.request.method ne "POST"
```

No se debe bloquear `OPTIONS` globalmente sin revisar integraciones; el endpoint
same-origin no debe requerir CORS.

### 2. Rutas comunes de ataque

Nombre: `block-common-probes`

```text
lower(http.request.uri.path) in {
  "/wp-admin"
  "/wp-login.php"
  "/.env"
  "/.git"
  "/phpmyadmin"
  "/xmlrpc.php"
}
or starts_with(lower(http.request.uri.path), "/.git/")
or starts_with(lower(http.request.uri.path), "/phpmyadmin/")
or starts_with(lower(http.request.uri.path), "/wp-admin/")
```

Acción: `Block`. Se debe probar también codificación de path y variantes observadas,
sin crear una regla demasiado amplia que bloquee rutas reales.

### 3. Geoprotección del contacto

Nombre: `challenge-contact-outside-service-area`

```text
http.request.uri.path eq "/api/contact"
and not ip.src.country in {"MX"}
```

Acción inicial: `Managed Challenge`.

La lista debe ser `[POR DEFINIR: países autorizados]`. Si se atiende a Estados Unidos:

```text
http.request.uri.path eq "/api/contact"
and not ip.src.country in {"MX" "US"}
```

No se debe aplicar la restricción geográfica a `/`, activos, aviso, robots o sitemap:
afectaría SEO, campañas, VPN, viajeros y previews sociales. La geolocalización IP puede
equivocarse; se debe monitorear abandono y falsos positivos.

### 4. Protección de `/admin`

Usar `starts_with(path, "/admin")` para cubrir descendientes:

```text
starts_with(http.request.uri.path, "/admin")
```

Acción base: `Managed Challenge`.

Regla adicional para países no admitidos, excluyendo una lista específica:

```text
starts_with(http.request.uri.path, "/admin")
and ip.src.country ne "MX"
and not ip.src in $admin_ips
```

Acción inicial: `Managed Challenge`; después de validar recuperación y viajes, puede
elevarse a `Block`. La lista `$admin_ips` debe ser una lista de Cloudflare con IP/CIDR,
dueño, justificación y caducidad. No se debe usar una regla global **Allow** para esas
IP: las IP Access Rules permitidas pueden saltarse WAF y rate limiting.

La autenticación de Sanity sigue siendo obligatoria. Conviene configurar Cloudflare
Access para `/admin` y `/admin/*` con identidades individuales, MFA e `Allow` explícito,
si el plan y callbacks de Sanity lo permiten. Access es deny-by-default y la ruta más
específica tiene precedencia; se deben probar login, logout, renovación y recuperación.
Referencia: [rutas de aplicaciones Access](https://developers.cloudflare.com/cloudflare-one/access-controls/policies/app-paths/).

### Orden y SEO

Las reglas terminales deben dejar pasar la landing a bots verificados, pero nunca se
debe excluir a un “bot verificado” de la protección específica de `/api/contact` o
`/admin` sólo por esa clasificación. Revisar el orden de ejecución entre rate limiting,
custom rules, bots y WAF administrado después de cada cambio.

## Rate limiting de `/api/contact`

Objetivo de producto:

```text
ruta: /api/contact
característica: IP
umbral: 5 solicitudes
periodo: 10 minutos
acción: Managed Challenge
intención solicitada: una hora; su disponibilidad depende del plan
```

En **Security > WAF > Rate limiting rules**:

1. Crear `rate-limit-contact`.
2. Limitar la expresión al path exacto y, cuando esté disponible, a `POST` y al host
   canónico.
3. Contar por IP; no incluir query ni cuerpo.
4. Configurar cinco solicitudes por 600 segundos sólo si el plan lo ofrece.
5. Empezar con una acción observable o challenge y revisar eventos.
6. Ante abuso persistente confirmado, crear un bloqueo temporal acotado con caducidad,
   no un bloqueo permanente manual.

Límites documentados a julio de 2026:

| Plan | Periodo de conteo máximo | Implicación |
| --- | --- | --- |
| Free | 10 s | no cumple 10 min |
| Pro | 1 min | no cumple 10 min |
| Business | 10 min | permite el objetivo |
| Enterprise | mayor | sujeto a contrato |

En Free/Pro/Business, un challenge de rate limiting usa throttling y no permite fijar
una duración de una hora. Si no hay Business, se debe registrar la desviación y usar
el máximo disponible junto con Turnstile, honeypot y el límite de aplicación; no se
debe afirmar que equivale a 5/10 min.

Referencias:

- [Rate Limiting Rules y planes](https://developers.cloudflare.com/waf/rate-limiting-rules/)
- [parámetros y duración de mitigación](https://developers.cloudflare.com/waf/rate-limiting-rules/parameters/)

## Bots y scrapers

En **Security > Bots**:

- Free: activar **Bot Fight Mode**.
- Pro/Business/Enterprise sin Bot Management: activar **Super Bot Fight Mode** y
  comenzar con `Managed Challenge` para automatización inequívoca.
- Enterprise con Bot Management: usar ese producto; no superponer modos.
- Los bots verificados de Google y Bing deben permanecer permitidos en contenido
  público para SEO.
- No bloquear todos los crawlers ni confiar en `User-Agent` como identidad.
- Revisar impacto en Sanity, Turnstile, monitoreo autorizado y previews sociales.

Bot Fight Mode y Super Bot Fight Mode operan sobre el dominio y no permiten el control
por endpoint de Bot Management. Referencia:
[soluciones de bots de Cloudflare](https://developers.cloudflare.com/bots/).

## Turnstile

En **Turnstile**:

1. Crear widgets separados para local/preview y producción.
2. Restringir el widget de producción a `[POR DEFINIR: hostname canónico]`.
3. Guardar site key en variable pública y secret key sólo en servidor.
4. Definir y validar una `action` estable para contacto.
5. Probar éxito, expiración, duplicado, hostname/action incorrectos, indisponibilidad y
   lector de pantalla.
6. Rotar el secreto ante exposición. No capturarlo en screenshots o tickets.

La verificación servidor descrita en
[la especificación](../specs/04-security-and-privacy.md#turnstile) es obligatoria.

## Protección contra bypass de origen

Cloudflare sólo observa peticiones que cruzan su proxy. Antes de publicar:

- habilitar Standard Deployment Protection para previews y URLs generadas;
- verificar que `*.vercel.app` no exponga `/admin` ni un endpoint utilizable contra
  producción;
- exigir `Host`/`Origin` canónicos en `/api/contact`;
- evaluar con arquitectura una restricción de origen en Vercel o un encabezado
  autenticado inyectado en un punto de confianza;
- no confiar en `CF-Connecting-IP` si la petición pudo llegar directo;
- probar desde fuera de Cloudflare, no sólo mediante DNS público.

Vercel Standard Protection protege deployments excepto dominios de producción; proteger
todos los deployments o aplicar restricciones más fuertes puede requerir Pro,
Enterprise o un add-on. Referencia:
[Deployment Protection](https://vercel.com/docs/deployment-protection).

No se debe crear un bypass secreto en query strings para uso humano. Un bypass de
automatización, si QA lo necesita, debe ir en cabecera, almacenarse como secreto,
limitarse a CI y rotarse.

## Eventos, alertas y revisión

En **Security > Events/Analytics**:

- guardar vistas para `/api/contact`, `/admin`, probes, rate limiting y bots;
- revisar inicialmente a diario, luego `[POR DEFINIR: frecuencia]`;
- activar alertas de DDoS/tráfico anómalo y cambios de cuenta hacia
  `[POR DEFINIR: responsables]`;
- no exportar IP, cookies o URLs a tickets generales;
- correlacionar por tiempo/request ID permitido, no por payload.

Registrar cada ajuste con fecha, autor, regla, motivo, evidencia, efecto y rollback.
Revisar mensualmente reglas temporales, listas de IP, falsos positivos y consumo.

## Pruebas posteriores

- `/`, aviso, robots, sitemap e imágenes cargan sin challenge indebido.
- Googlebot/Bingbot verificados acceden al contenido público.
- métodos bloqueados y probes producen el evento esperado.
- `POST /api/contact` legítimo desde país permitido llega al origen.
- origen extranjero recibe challenge sin bloquear toda la landing.
- el sexto envío dentro de la ventana acordada produce el control esperado.
- Turnstile inválido o repetido no llega a Resend.
- `/admin` exige perímetro y autenticación Sanity; IP/country de recuperación funciona.
- una URL de Vercel o acceso directo no evita controles.
- ningún evento o log contiene contenido del formulario.

## Incidente y rollback

### Abuso de `/api/contact`

1. Confirmar eventos, volumen, ruta y países sin copiar PII.
2. Cambiar temporalmente la regla a `Managed Challenge` o `Block` acotado.
3. Si continúa, deshabilitar el formulario en aplicación mediante el mecanismo
   previsto y conservar WhatsApp sólo si es seguro.
4. Revisar cuotas Resend y rotar clave si hay indicios de compromiso.
5. Ajustar una sola variable por vez y registrar caducidad.

### Cuenta o dominio comprometido

1. Usar canal fuera de banda `[POR DEFINIR]`.
2. Revocar sesiones/tokens, rotar API keys y asegurar correo/registrador.
3. Congelar cambios de DNS y contenido; preservar auditoría.
4. Restaurar configuración conocida y validar desde una red independiente.
5. Activar el proceso jurídico si hubo acceso a datos.

### Falso positivo

1. Identificar `ruleId` en Security Events.
2. Bajar a observación/challenge o desactivar sólo esa regla.
3. No crear un `Skip all` ni allowlist global.
4. Ejecutar regresión y documentar la excepción con caducidad.

Para rollback, desactivar la regla nueva o restaurar su expresión/acción previa; no
desactivar DNS proxy, TLS estricto, MFA o todo el WAF como atajo.

## Evidencia de aprobación

Se debe conservar, sin secretos ni PII:

- plan y fecha de verificación;
- capturas o export de nombres, expresiones y acciones;
- resultados de QA por regla;
- evidencia de bots verificados y consentimiento;
- responsables de alertas y rollback;
- desviaciones por plan aceptadas por producto, arquitectura y seguridad.
