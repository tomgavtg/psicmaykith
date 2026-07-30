# Runbook de Resend para solicitudes de contacto

## Objetivo y límites

Resend debe entregar cada formulario validado a un buzón autorizado. La aplicación no
debe guardar leads en base de datos, archivos, CMS, colas ni logs. Resend sigue siendo
un proveedor que procesa correo; antes de publicar deben revisarse términos, retención,
ubicación, subencargados y obligaciones aplicables en México.

La Fase 2 está autorizada. Se pueden preparar Development y Staging con datos
sintéticos; las cuentas, dominio remitente y envíos de Production requieren responsables,
revisión de privacidad y ventana de prueba aprobados.

## Valores pendientes

```text
Cuenta/equipo Resend: [POR DEFINIR: cuenta o equipo autorizado]
Dominio remitente: [POR DEFINIR: dominio verificado]
RESEND_FROM_EMAIL: [POR DEFINIR: remitente verificado]
LEADS_TO_EMAIL: [POR DEFINIR: buzón receptor]
Responsable de cuenta: [POR DEFINIR: responsable de Resend]
Responsable del buzón: [POR DEFINIR: responsable de recepción]
SLA de respuesta: [POR DEFINIR: horario y tiempo de respuesta]
```

No deben anotarse valores reales ni llaves en este documento.

## Prerrequisitos

- dominio bajo control y DNS en Cloudflare;
- acceso nominal a Resend y Cloudflare con MFA cuando se ofrezca;
- remitente funcional del dominio, por ejemplo un alias no interactivo aprobado;
- buzón receptor con acceso restringido y política de retención;
- aviso de privacidad y evaluación del proveedor revisados;
- entornos separados para desarrollo, preview y producción;
- texto de correo y mensajes de éxito/error aprobados.

## Alta y dominio remitente

1. Crear el equipo de Resend con una cuenta corporativa controlada.
2. Invitar sólo a responsables necesarios y activar MFA.
3. Agregar el dominio o subdominio remitente aprobado.
4. Copiar a Cloudflare **exactamente** los registros DNS que muestre Resend. No usar
   ejemplos de terceros ni inventar SPF/DKIM.
5. Mantener TXT/MX de verificación como `DNS only`; Cloudflare no proxyfica correo.
6. Esperar que Resend marque el dominio como verificado.
7. Revisar SPF para evitar múltiples registros incompatibles.
8. Definir DMARC gradualmente con la persona responsable del dominio; antes de aplicar
   una política restrictiva se deben inventariar todos los remitentes legítimos.
9. Enviar pruebas controladas y revisar autenticación SPF, DKIM y DMARC en cabeceras.

Si el dominio ya envía correo, cualquier cambio debe coordinarse con su administrador.
Una modificación incorrecta de SPF o DMARC puede afectar comunicaciones ajenas a la
landing.

## Remitente, destinatario y respuesta

- `RESEND_FROM_EMAIL` debe ser una dirección del dominio verificado y estable.
- `LEADS_TO_EMAIL` debe ser el buzón autorizado para solicitudes.
- El correo que proporciona la persona usuaria debe asignarse sólo a `replyTo`.
- Nunca se debe usar el correo del prospecto como `from`; dañaría autenticación y
  permitiría suplantación.
- El asunto debe ser fijo y neutral, con un request ID no identificable si se necesita
  correlación. No debe contener nombre, correo, servicio o mensaje.
- El cuerpo puede incluir los campos expresamente enviados, escapados como texto. No
  debe interpretar, clasificar ni inferir condiciones clínicas.
- Debe incluir un recordatorio interno de manejo confidencial y de no reenviar a
  destinatarios no autorizados.

El buzón receptor, sus reglas y sus respaldos sí constituyen tratamiento de datos
personales. La ausencia de una base propia no elimina obligaciones de acceso, retención
o eliminación.

## Variables de Vercel

```env
RESEND_API_KEY=
LEADS_TO_EMAIL=
RESEND_FROM_EMAIL=
```

- Deben configurarse desde el panel seguro o CLI autorizada de Vercel, nunca en Git.
- Deben existir por separado en Development, Preview y Production.
- Preview debe usar modo/receptor de prueba y nunca el buzón real por defecto.
- `RESEND_API_KEY` no debe usar prefijo `NEXT_PUBLIC_` ni llegar al bundle cliente.
- Conviene limitar la llave al equipo/dominio y permisos mínimos que ofrezca el plan.
- Los cambios requieren redeploy del entorno afectado.

La `.env.example` sólo lleva nombres y valores vacíos; su propiedad corresponde al
agente integrador.

## Flujo del Route Handler

1. Completar todos los controles locales y Turnstile antes de contactar a Resend.
2. Construir asunto y cuerpo desde una lista cerrada de campos.
3. Escapar contenido para evitar inyección HTML/cabeceras; no aceptar adjuntos.
4. Establecer `from` con `RESEND_FROM_EMAIL`, `to` con `LEADS_TO_EMAIL` y `replyTo` con
   el correo validado.
5. Aplicar timeout y manejar la respuesta sin imprimir request ni respuesta completos.
6. Responder `200` sólo cuando Resend acepte el envío.
7. Traducir indisponibilidad/timeout a respuesta pública neutral `502` o `500`, según
   clasificación interna aprobada.
8. No reintentar automáticamente de forma ilimitada: podría duplicar solicitudes. En v1
   se debe pedir reintento explícito y ofrecer WhatsApp.

Si se utiliza una clave de idempotencia del proveedor, debe derivarse de un request ID
aleatorio de corta vida, no de nombre/correo/teléfono. Su semántica y retención deben
verificarse contra la versión vigente de la API antes de implementarla.

## Logs y observabilidad

Se permite registrar:

```text
timestamp
request_id aleatorio
etapa interna
código de resultado normalizado
latencia
```

No se permite registrar:

```text
payload o body
nombre, correo o teléfono
servicio, horario o mensaje
IP o hash de IP
token Turnstile
RESEND_API_KEY
LEADS_TO_EMAIL o replyTo
respuesta completa del proveedor
HTML del correo
```

La captura automática de errores, traces y logs de plataforma debe revisarse para
evitar serializar argumentos. Las métricas operativas deben ser agregadas.

## Pruebas

### En sandbox o entorno controlado

- llave ausente o inválida;
- dominio/remitente no verificado;
- destinatario de prueba;
- correo del prospecto válido e inválido;
- caracteres en español y texto multilinea escapado;
- intento de HTML, salto de cabecera y body cercano a 10 KB;
- timeout, `429` del proveedor y error de red;
- doble clic/reintento y ausencia de duplicado automático;
- confirmación de que los logs no contienen campos;
- `replyTo` correcto y autenticación SPF/DKIM/DMARC.

### Antes de producción

1. Autorizar una ventana y destinatario de prueba.
2. Enviar un formulario con datos ficticios, sin información clínica.
3. Confirmar recepción, formato, `from` y `replyTo`.
4. Confirmar que éxito sólo aparece tras aceptación de Resend.
5. Simular fallo y verificar conservación local de campos y alternativa WhatsApp.
6. Revisar Vercel, Resend y analítica para confirmar ausencia de payload.
7. Eliminar el mensaje de prueba conforme a la política del buzón.

## Rotación de llave

1. Crear una llave nueva de alcance mínimo.
2. Actualizar el entorno Vercel afectado sin exponer el valor.
3. Hacer redeploy y una prueba controlada.
4. Revocar la llave anterior sólo después de validar.
5. Revisar uso anómalo y documentar fecha/responsable sin anotar llaves.

Ante exposición confirmada, se debe revocar primero la llave comprometida, contener
envíos, revisar eventos del proveedor y seguir el proceso de incidente aprobado.

## Entregabilidad y operación

- Revisar rebotes, bloqueos y reputación sin incluir datos del lead en tickets.
- Mantener bajo el volumen; este canal no debe usarse para marketing.
- No añadir CC/BCC personales sin aprobación y actualización de privacidad.
- Definir guardias y reglas del buzón para que los leads no dependan de una sola cuenta.
- Definir retención y eliminación en Resend y en el buzón de destino.
- Verificar periódicamente dominio, DKIM, SPF, DMARC, roles, llave y límites del plan.

## Reversión y caída

- Si Resend falla, el formulario debe mostrar un mensaje neutral y ofrecer WhatsApp.
- No se debe poner una API key nueva en cliente ni desactivar validaciones para
  “restaurar” servicio.
- Puede deshabilitarse temporalmente el formulario mediante configuración aprobada,
  manteniendo contenido y WhatsApp.
- Un cambio de DNS de correo se revierte restaurando los registros respaldados de forma
  puntual; no se debe reemplazar la zona completa.
- Al cambiar proveedor se requiere un ADR, evaluación de privacidad, nueva
  autenticación de dominio y pruebas de entregabilidad.
