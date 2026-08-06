# Entrega — formulario en línea y propuesta de agenda con pago

Fecha: 6 de agosto de 2026.

## Cambios implementados

- La modalidad visible y aceptada por el servidor quedó limitada a `En línea`.
- “Mensaje” se renombró “Motivo de consulta” y ahora es obligatorio.
- Se agregó consentimiento expreso separado para el posible tratamiento de datos
  sensibles.
- El correo receptor identifica el campo como “Motivo de consulta”.
- Sanity y el script de preparación de contenido quedaron restringidos a modalidad en
  línea.
- Se agregaron pruebas para impedir motivo vacío, modalidad presencial y ausencia del
  consentimiento expreso.

## Decisión y riesgos

La recomendación de agenda y pagos se documentó en
`docs/decisions/ADR-004-online-booking-and-payment.md`. La opción preferida es Google
Calendar Appointment Schedules con Stripe; Mercado Pago o SPEI requieren un backend
transaccional y almacenamiento persistente para bloqueos temporales e idempotencia.

Google Calendar y Stripe ya fueron configurados por la responsable. Se confirmaron
honorarios de `$750 MXN` para adultos y adolescentes y `$1,200 MXN` para pareja, además
de la política comercial registrada en la ADR. El modelo de Sanity ya admite una URL de
reserva por servicio y la interfaz sólo la muestra cuando existe. Adultos y
Adolescentes reutilizan `https://calendar.app.google/ASqcLDM3toM1cwU39`; Pareja usa
`https://calendar.app.google/mYGWH7GsyeatowKMA`.

El aviso integral v1.1 fue aprobado por la responsable y publicado en Sanity Production
el 6 de agosto de 2026. Incluye el motivo de consulta, Google Calendar, Stripe y la
política comercial. La transacción `bWvCnNg66C0Nb8XF6hs5lE` actualizó los tres
servicios, contacto, SEO, perfil y aviso; la verificación posterior no reportó bloqueos
de publicación. Después del despliegue debe ejecutarse una prueba controlada de pago,
creación del evento, cancelación y devolución por cada tipo de horario.
