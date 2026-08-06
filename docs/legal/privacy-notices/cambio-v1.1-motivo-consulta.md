# Registro de cambio v1.1 — motivo de consulta, agenda y pago

> **APROBADO por la responsable el 6 de agosto de 2026 e incorporado al aviso integral
> v1.1.**

Fecha de preparación: 6 de agosto de 2026.

## Cambio operativo

El formulario dejará de pedir un “mensaje” opcional y solicitará un **motivo de
consulta** obligatorio, con un máximo de 500 caracteres. La interfaz pedirá compartir
sólo lo necesario y no incluir diagnósticos, medicamentos, antecedentes ni información
de otras personas.

El formulario mostrará una casilla separada y obligatoria con el siguiente texto:

> Consiento expresamente el tratamiento del motivo de consulta, que puede revelar datos
> personales sensibles, únicamente para atender mi solicitud y gestionar una posible
> cita.

## Ajustes requeridos al aviso integral

La siguiente versión debe:

1. sustituir “mensaje opcional” por “motivo de consulta obligatorio” en las categorías
   tratadas;
2. reconocer que el contenido puede revelar información de salud;
3. limitar su finalidad a atender la solicitud, valorar administrativamente el servicio
   solicitado y gestionar una posible cita;
4. documentar el mecanismo para acreditar consentimiento expreso;
5. indicar la retención y eliminación aplicable en Resend y el buzón receptor;
6. mantener la prohibición de enviar el contenido a Google Ads, Analytics, Meta, TikTok
   o cualquier audiencia publicitaria;
7. describir Google Calendar y el procesador de pagos antes de habilitar reservas y
   cobros en línea.

## Agenda y pago que deben describirse

La siguiente versión del aviso debe informar, con base en la configuración efectiva y
los contratos aplicables, que:

- la disponibilidad, reserva y creación del evento se gestionan en una página pública
  de **Google Calendar**;
- el pago previo se procesa mediante **Stripe** y la aplicación no recibe ni almacena
  números completos de tarjeta;
- Google y Stripe reciben los datos necesarios para prestar sus respectivos servicios,
  conforme a sus propios avisos y a los acuerdos contratados por la responsable;
- la finalidad es administrar disponibilidad, confirmar la cita, cobrar el servicio,
  atender cancelaciones y realizar reembolsos cuando procedan;
- deben definirse retención, transferencias, subencargados y mecanismos ARCO aplicables
  a la agenda y al pago.

La política comercial confirmada es: cancelación sin penalización hasta 48 horas antes;
sin reprogramación solicitada por la persona usuaria; cancelación tardía e inasistencia
sin reembolso; y reprogramación cuando la cancelación sea atribuible a la psicóloga.

La versión integral aprobada se conserva en
`aviso-integral-sitio-contacto-v1.1.md` y debe publicarse en Sanity antes del despliegue
de la funcionalidad.
