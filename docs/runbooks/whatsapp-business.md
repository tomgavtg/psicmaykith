# Runbook de WhatsApp Business

## Objetivo

Configurar WhatsApp como ruta principal de contacto sin solicitar información clínica
ni crear automatizaciones innecesarias. La Fase 2 está autorizada; el alta y vinculación
requieren aprobación de la titular y accesos nominales.

El número empresarial confirmado es `+52 55 1609 8584`; para enlaces y configuración
se usa `525516098584`. El titular operativo, nombre comercial y accesos siguen
`[POR DEFINIR: confirmar con la psicóloga]`. El correo empresarial aprobado es
`contacto@psicologamayumikitahara.com`. No se deben registrar aquí códigos de
verificación, contraseñas, QR ni secretos de recuperación.

## Alcance de v1

V1 debe usar la aplicación WhatsApp Business y un enlace directo:

```text
https://wa.me/[NUMERO_INTERNACIONAL]?text=[MENSAJE_URL_ENCODED]
```

No se requiere WhatsApp Business Platform, bot, CRM, webhooks ni plantillas de mensaje.
La Platform sólo debe reconsiderarse si se aprueban automatizaciones, integración CRM o
recordatorios masivos, después de evaluar consentimiento, privacidad, costos y
operación.

## Prerrequisitos

- número confirmado `+52 55 1609 8584`, bajo control legítimo de la profesional o
  consultorio `[POR DEFINIR: confirmar titular operativo]`;
- dispositivo y respaldo gestionados por su responsable;
- nombre comercial y categoría reales y aprobados;
- correo y sitio oficiales, si se mostrarán;
- aviso de privacidad revisado;
- cuenta y Business Portfolio de Meta autorizados, si se usarán campañas;
- responsables nominales y MFA donde el proveedor lo permita;
- política de respuesta, horarios y respaldo operativo
  `[POR DEFINIR: horarios, SLA y responsable alterno]`.

El número debe poder usarse de forma sostenible. No conviene publicar un número personal
que luego deba reemplazarse sin un plan de migración.

## Alta y configuración

1. Instalar WhatsApp Business desde la tienda oficial en el dispositivo administrado.
2. Registrar el número aprobado y completar la verificación directamente en la
   aplicación. Nunca compartir el código.
3. Configurar únicamente datos reales: nombre, categoría, descripción, horario, correo,
   sitio y ubicación cuando hayan sido aprobados.
4. Subir una imagen de marca o retrato con permiso de uso; no usar fotografías de
   pacientes.
5. Revisar dispositivos vinculados y retirar sesiones desconocidas.
6. Activar verificación en dos pasos y un correo de recuperación controlado.
7. Configurar mensajes de saludo/ausencia sólo si indican expectativas realistas. No
   prometer atención inmediata ni tratar WhatsApp como canal de emergencia.
8. Definir quién responde y en cuánto tiempo. El SLA permanece
   `[POR DEFINIR: tiempo y horario de respuesta]`.

Los respaldos de chat y la retención deben configurarse conforme al aviso de privacidad
y a una decisión operativa/legal. No deben asumirse como expediente clínico.

## Vinculación con Meta Business

Si se usarán anuncios Click to WhatsApp:

1. Confirmar propiedad y administradores del Business Portfolio de Meta.
2. Vincular la página/cuenta publicitaria aprobada y el mismo número usado en la
   landing.
3. Completar verificaciones solicitadas por Meta desde cuentas nominales.
4. Limitar roles al mínimo y revisar accesos de agencias.
5. Crear campañas con el mismo destino; no crear números alternos que fragmenten la
   atención sin una razón operativa.
6. Probar anuncio, preview y conversación antes de invertir.

Los nombres de pantallas y requisitos pueden cambiar. Durante Fase 2 se deben seguir las
instrucciones vigentes del panel de Meta y conservar evidencia sin secretos.

## Configuración en Sanity

`contactSettings` debe administrar:

- número internacional sin `+`, espacios, guiones ni paréntesis;
- mensaje preconfigurado;
- etiqueta accesible del CTA;
- disponibilidad del canal;
- texto de privacidad asociado.

Formato esperado del número:

```text
[CODIGO_PAIS][NUMERO_NACIONAL]
```

Para la configuración confirmada:

```text
phoneDisplay: +52 55 1609 8584
whatsappNumber: 525516098584
whatsappMessage: Hola, me gustaría solicitar información para agendar una primera sesión.
```

México usa `52` seguido de los 10 dígitos del número nacional. El antiguo prefijo móvil
internacional `1` no debe almacenarse ni publicarse. Por compatibilidad, la aplicación
normaliza una entrada como `+52 1 55 1609 8584` a `525516098584` antes de construir el
enlace.

La validación debe aceptar sólo dígitos y una longitud internacional razonable, pero el
valor debe comprobarse manualmente con el país y número reales. No debe publicarse el
CTA si el número está ausente o no fue verificado.

Mensaje inicial propuesto, sujeto a aprobación editorial:

```text
Hola, me gustaría solicitar información para agendar una primera sesión.
```

La aplicación debe aplicar codificación URL con una API estándar, no concatenar texto
sin escapar. El mensaje debe ser genérico: no debe incluir servicio sensible, nombre,
correo, teléfono, síntomas, diagnósticos, UTMs ni texto del formulario.

La implementación valida nuevamente el número al construir cada enlace: después de
retirar espacios y signos debe contener entre 10 y 15 dígitos. Si falta o no cumple el
formato, se ocultan los CTA de WhatsApp y permanecen disponibles el correo y el
formulario. Un servicio seleccionado no se añade al mensaje preconfigurado para evitar
exponer preferencias en la URL.

## Presentación y medición

- El CTA debe abrir el enlace `wa.me` y conservar una etiqueta discernible.
- En escritorio, WhatsApp puede transferir a Web/Desktop; se debe probar la degradación.
- Cerca del CTA debe mostrarse: “Por tu privacidad, evita compartir información clínica
  o sensible por este medio.”
- Debe mantenerse visible el aviso de que el sitio no sustituye atención de emergencia.
- `click_whatsapp` puede emitirse sólo después del consentimiento aplicable y nunca debe
  incluir el número, el mensaje, identidad o campos del formulario.
- El número no debe insertarse en parámetros de analítica ni eventos publicitarios.

## Pruebas antes de publicar

1. Abrir el enlace desde Safari iOS y Chrome Android.
2. Abrirlo desde escritorio con y sin WhatsApp Desktop.
3. Confirmar que resuelve al número autorizado.
4. Confirmar que el mensaje aparece completo, legible y sin dobles codificaciones.
5. Probar caracteres acentuados y signos del texto aprobado.
6. Verificar foco, nombre accesible, área táctil y que el CTA flotante no tape campos.
7. Confirmar que ninguna analítica recibe el URL completo, número o mensaje.
8. Confirmar que, si el número se desactiva en Sanity, no quedan CTAs rotos.
9. En una campaña de prueba, confirmar que Click to WhatsApp usa el mismo número.
10. Validar respuesta operativa dentro del horario publicado.

Las pruebas deben usar conversación controlada y texto ficticio; no se debe enviar
información clínica.

## Cambio de número

1. Aprobar propietario, fecha y plan de continuidad.
2. Usar la función oficial de cambio de número cuando aplique.
3. Actualizar perfil, Sanity, campañas, Meta Business y materiales.
4. Publicar/revalidar el sitio y purgar sólo las URLs necesarias.
5. Probar móvil, escritorio y anuncios.
6. Retirar el número anterior cuando la transición sea segura.
7. Registrar el cambio sin guardar códigos ni conversaciones.

## Incidentes

- **Teléfono perdido o acceso desconocido:** bloquear la línea, revisar dispositivos
  vinculados, recuperar la cuenta por el canal oficial y rotar accesos relacionados.
- **Suplantación:** conservar evidencia mínima, reportar al proveedor y publicar una
  advertencia sólo con aprobación responsable.
- **Spam:** usar controles de WhatsApp y revisar exposición/campañas; no responder con
  automatizaciones invasivas.
- **Mensajes de crisis:** seguir el protocolo profesional aprobado
  `[POR DEFINIR: protocolo y responsable]`; la landing y WhatsApp no deben presentarse
  como servicios de emergencia.
- **Canal caído:** desactivar temporalmente el CTA en Sanity y conservar formulario y
  correo.

## Revisión periódica

Mensualmente, o tras cambios de campaña, conviene revisar número, mensaje, horarios,
dispositivos vinculados, roles de Meta y funcionamiento de enlaces. La persona
responsable debe revisar también la retención de conversaciones y coherencia con el
aviso de privacidad.

## Referencias de marcación

- [IFT: marcación internacional hacia México con `+52` y diez dígitos](https://www.ift.org.mx/conocenos/pleno/entrevistas/otros-funcionarios/entrevista-rafael-eslava-titular-de-la-unidad-de-concesiones-y-servicios-del-ift-en-radio-formula-0)
- [Plan de numeración de México publicado por la UIT](https://www.itu.int/dms_pub/itu-t/oth/02/02/T020200008A0004PDFE.pdf)
