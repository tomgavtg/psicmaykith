# Runbook de Namecheap Private Email y Gmail

## Propósito

Este runbook documenta el buzón empresarial, sus registros en Cloudflare y el acceso
desde la aplicación Gmail. La decisión vigente es:

```text
Dirección:         contacto@psicologamayumikitahara.com
Proveedor:         Namecheap Private Email
Cliente opcional:  aplicación Gmail mediante IMAP/SMTP
Webmail seguro:    https://privateemail.com
```

Gmail no es el proveedor del dominio y no se utiliza Google Workspace por ahora. No se
deben agregar MX de Google ni eliminar los MX de Namecheap. Las contraseñas normales y
de aplicación nunca se copian al repositorio, tickets, capturas o mensajes.

## Registros requeridos en Cloudflare

Cloudflare debe ser autoritativo después de completar la delegación desde Namecheap.
Todos los registros de esta tabla permanecen siempre en **DNS only**:

| Tipo | Nombre | Destino o contenido | Prioridad | TTL |
| --- | --- | --- | --- | --- |
| MX | `@` | `mx1.privateemail.com` | 10 | Auto |
| MX | `@` | `mx2.privateemail.com` | 10 | Auto |
| TXT | `@` | `v=spf1 include:spf.privateemail.com ~all` | — | Auto |
| CNAME | `mail` | `privateemail.com` | — | Auto |
| CNAME | `autoconfig` | `privateemail.com` | — | Auto |
| CNAME | `autodiscover` | `privateemail.com` | — | Auto |
| SRV | `_autodiscover._tcp` | peso `0`, puerto `443`, destino `privateemail.com` | 0 | Auto |
| TXT | selector indicado por Namecheap | clave DKIM completa | — | Auto |
| TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:contacto@psicologamayumikitahara.com` | — | Auto |

Los CNAME `mail`, `autoconfig` y `autodiscover` no deben tener nube naranja. El proxy
de Cloudflare es HTTP y no debe interponerse en la configuración del servicio de
correo. MX, TXT y SRV tampoco se proxifican.

## Generar y publicar DKIM

1. Entrar a Namecheap con MFA.
2. Abrir **Private Email**.
3. Seleccionar **Manage** para `psicologamayumikitahara.com`.
4. Abrir la sección **DKIM**.
5. Seleccionar **Generate** si todavía no existe o **Show DKIM** si ya fue generado.
6. Copiar exactamente el hostname y el valor completo.
7. En Cloudflare abrir **DNS → Records → Add record**.
8. Elegir `TXT`.
9. Pegar el hostname en **Name** y la clave completa en **Content**.
10. Dejar TTL en `Auto` y guardar.

El selector puede ser `privateemail._domainkey` para suscripciones contratadas a partir
del 2 de junio de 2026, o `default._domainkey` para algunas suscripciones anteriores.
El panel de Namecheap es autoritativo. La clave debe comenzar con `v=DKIM1` y debe
copiarse completa, sin inventarla, truncarla o versionarla.

## Publicar DMARC por etapas

Durante la puesta en marcha se utiliza una política de observación:

```text
Type:     TXT
Name:     _dmarc
Content:  v=DMARC1; p=none; rua=mailto:contacto@psicologamayumikitahara.com
TTL:      Auto
```

Los reportes agregados pueden llegar como adjuntos técnicos al buzón. Si no se desean
en la bandeja pública, conviene crear posteriormente un alias operativo dedicado y
cambiar `rua`. No se debe pasar a `p=quarantine` o `p=reject` hasta comprobar que todo
remitente legítimo del dominio supera SPF o DKIM alineado. Debe existir un solo TXT SPF
y un solo TXT DMARC para el dominio.

## Verificar el buzón directamente

Antes de configurar Gmail:

1. Abrir únicamente `https://privateemail.com`.
2. Iniciar sesión con `contacto@psicologamayumikitahara.com`.
3. Enviar un mensaje sintético a una cuenta de prueba autorizada.
4. Responder desde esa cuenta hacia `contacto@psicologamayumikitahara.com`.
5. Confirmar recepción, envío y que el mensaje no cae en spam.
6. No usar datos de pacientes ni información clínica en las pruebas.

No se debe utilizar una URL HTTP como acceso habitual al correo. El CNAME `mail` se
conserva para compatibilidad y autoconfiguración, pero el acceso documentado es la URL
HTTPS directa del proveedor.

## Agregar la cuenta en la aplicación Gmail

Este procedimiento aplica a la aplicación Gmail en Android, iPhone o iPad:

1. Abrir Gmail.
2. Presionar la fotografía o icono de perfil.
3. Seleccionar **Agregar otra cuenta**.
4. Seleccionar **Otra**.
5. Escribir `contacto@psicologamayumikitahara.com`.
6. Seleccionar **Personal (IMAP)**, no POP.
7. Introducir la contraseña del buzón o una contraseña de aplicación.
8. Completar el servidor de entrada:

   ```text
   Usuario:    contacto@psicologamayumikitahara.com
   Servidor:   mail.privateemail.com
   Puerto:     993
   Seguridad:  SSL/TLS
   ```

9. Completar el servidor de salida:

   ```text
   Requiere autenticación:  sí
   Usuario:                 contacto@psicologamayumikitahara.com
   Servidor SMTP:           mail.privateemail.com
   Puerto:                  465
   Seguridad:               SSL/TLS
   ```

10. Finalizar la sincronización.
11. Enviar y responder otra prueba sintética desde Gmail.
12. Verificar que el remitente visible sea exactamente
    `contacto@psicologamayumikitahara.com`.

Como alternativa autorizada para SMTP se puede usar el puerto `587` con STARTTLS. No
se debe aceptar una conexión sin cifrado ni ignorar errores de certificado.

## Contraseña de aplicación de Namecheap

Las suscripciones nuevas de Private Email pueden ofrecer contraseñas específicas para
clientes externos:

1. Entrar a Private Email mediante HTTPS.
2. Abrir la configuración de seguridad o **App Passwords**.
3. Crear una contraseña con un nombre reconocible, por ejemplo `Gmail móvil`.
4. Copiarla una sola vez al gestor de contraseñas aprobado.
5. Usarla en los campos IMAP y SMTP de Gmail.
6. Revocarla y crear una nueva si el dispositivo se pierde o deja de estar autorizado.

No se debe pegar esa contraseña en este documento ni en variables de entorno de la
aplicación web.

## Lo que no funciona como sustituto de Google Workspace

Agregar una cuenta IMAP a la aplicación Gmail no convierte el buzón en una cuenta
Google Workspace. El correo sigue almacenado y administrado por Namecheap. Gmail web
en una computadora no ofrece el mismo flujo IMAP para una cuenta externa y Google
retiró en enero de 2026 la recuperación de otras cuentas mediante POP.

Si en el futuro se contrata Google Workspace, debe tratarse como una migración con
ventana y rollback:

1. verificar el dominio en Google Admin;
2. crear los usuarios y migrar el historial requerido;
3. sustituir —no mezclar— los MX de Namecheap por los indicados por Google;
4. cambiar el SPF para autorizar al remitente real sin publicar dos SPF;
5. generar DKIM en Google Admin;
6. revisar DMARC después de validar alineación;
7. probar recepción y envío antes de cancelar Namecheap Private Email.

## Validación DNS y de entrega

Después de que Cloudflare esté `Active`:

```bash
dig MX psicologamayumikitahara.com @1.1.1.1
dig TXT psicologamayumikitahara.com @1.1.1.1
dig TXT _dmarc.psicologamayumikitahara.com @1.1.1.1
dig TXT [SELECTOR_DKIM].psicologamayumikitahara.com @1.1.1.1
dig SRV _autodiscover._tcp.psicologamayumikitahara.com @1.1.1.1
```

Se debe confirmar:

- dos MX de Namecheap con prioridad 10;
- un único SPF;
- un DMARC sintácticamente válido;
- DKIM completo para el selector real;
- SRV con prioridad `0`, peso `0`, puerto `443` y destino `privateemail.com`;
- recepción y envío desde webmail y Gmail;
- conexiones IMAP y SMTP cifradas;
- ausencia de contraseñas o mensajes reales en evidencias.

## Solución de problemas

- **Gmail rechaza la contraseña:** comprobar usuario completo, habilitación de IMAP y
  contraseña de aplicación.
- **No recibe correo:** revisar primero NS autoritativos y después ambos MX; no cambiar
  los MX por direcciones IP.
- **No envía correo:** revisar SMTP autenticado, puerto, cifrado, SPF y DKIM.
- **El correo llega a spam:** validar SPF, DKIM y DMARC antes de endurecer DMARC.
- **Error de certificado:** confirmar que el servidor sea exactamente
  `mail.privateemail.com`; no aceptar el certificado de un hostname distinto.
- **Cloudflare muestra error en correo:** confirmar que `mail`, `autoconfig` y
  `autodiscover` estén en DNS only.

## Referencias oficiales

- [Private Email con DNS de terceros](https://www.namecheap.com/support/knowledgebase/article.aspx/1340/2176/namecheap-private-email-records-for-domains-with-thirdparty-dns/)
- [Private Email con Cloudflare](https://www.namecheap.com/support/knowledgebase/article.aspx/9967/31/how-to-set-up-dns-records-for-namecheap-email-service-with-cloudflare-cpanel-and-private-email/)
- [Configurar DKIM en Private Email](https://www.namecheap.com/support/knowledgebase/article.aspx/10383/2176/how-to-set-up-a-dkim-record-for-private-email/)
- [Contraseñas de aplicación de Private Email](https://www.namecheap.com/support/knowledgebase/article.aspx/10816/2306/new-how-to-use-app-passwords-for-private-email/)
- [Agregar otra cuenta a la aplicación Gmail](https://support.google.com/mail/answer/6078445)
- [Cambios de POP en Gmail web](https://support.google.com/mail/answer/21289)
