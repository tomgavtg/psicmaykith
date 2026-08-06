# ADR-004 — Agenda en línea y pago previo

- Estado: Aceptado para implementación
- Fecha: 6 de agosto de 2026

## Contexto

Se busca mostrar disponibilidad real, evitar dobles reservas, integrar la agenda con la
cuenta profesional de Google Calendar y confirmar el horario únicamente después del
pago. Los servicios duran 50 minutos para adolescentes y adultos, y 70 minutos para
parejas. Por ahora todas las citas son en línea.

## Decisión propuesta

La primera implementación debe usar **Horarios de citas de Google Calendar con pago
mediante Stripe**, siempre que la cuenta tenga una suscripción de Google Workspace
elegible y Stripe apruebe la cuenta profesional.

Se crearán páginas de reserva separadas por duración o servicio, se comprobarán todos
los calendarios profesionales para evitar conflictos y se configurarán anticipación
mínima, ventana máxima de reserva, tiempo de separación, máximo diario, excepciones y
política de cancelación. La landing mostrará un botón o cargará el calendario embebido
sólo después de una acción explícita de la persona usuaria.

Google Calendar incorpora el pago al flujo de reserva y agrega la cita al calendario
cuando se completa el checkout. Esta ruta evita construir ahora almacenamiento de
reservas, bloqueos temporales, conciliación e idempotencia propios.

## Limitaciones

- El pago integrado de Google Calendar sólo usa Stripe y ofrece tarjeta, Apple Pay y
  Google Pay; no ofrece SPEI, STP, Mercado Pago u OXXO dentro de ese flujo.
- Los reembolsos no se generan automáticamente al cancelar una cita y deben operarse en
  Stripe conforme a una política publicada.
- La página de reservas es pública y muestra el nombre y fotografía de la cuenta de
  Google; debe usarse exclusivamente la identidad profesional aprobada.
- Algunas funciones, varias páginas de reserva y los pagos dependen del plan de Google
  Workspace.
- Antes de habilitar pagos deben cerrarse impuestos/facturación, tratamiento de datos
  por terceros y una prueba completa de cada agenda.

## Configuración comercial confirmada

- Terapia para adultos: **$750 MXN**, 50 minutos.
- Terapia para adolescentes: **$750 MXN**, 50 minutos.
- Terapia de pareja: **$1,200 MXN**, 70 minutos.
- Cancelación sin penalización: hasta 48 horas antes.
- Reprogramación solicitada por la persona usuaria: no permitida.
- Cancelación tardía e inasistencia: sin reembolso.
- Cancelación por parte de la psicóloga: se ofrecerá reprogramación.

La frase “sin penalización” se implementará como devolución total cuando la cancelación
se solicite con al menos 48 horas de anticipación. Stripe no realiza esa devolución de
manera automática; la operación debe ejecutarla la responsable conforme a esta
política.

## Alternativa mexicana con SPEI o Mercado Pago

Si SPEI o Mercado Pago son requisitos obligatorios, se necesitará un flujo propio:

1. consultar disponibilidad con Google Calendar `freeBusy`;
2. crear un bloqueo temporal del horario con identificador idempotente;
3. crear la orden en Mercado Pago Checkout Pro o Conekta;
4. verificar la firma del webhook y consultar el estado del pago al proveedor;
5. confirmar el evento en Google Calendar sólo cuando el pago esté aprobado;
6. liberar el bloqueo cuando venza, falle o se cancele el pago;
7. impedir dos bloqueos del mismo horario mediante una base con restricción única y
   vencimiento.

Esta alternativa requiere almacenamiento transaccional nuevo. No debe implementarse
usando sólo correo, Sanity o memoria de una función de Vercel. Conekta ofrece SPEI y
notificaciones; Mercado Pago ofrece checkout alojado y webhooks. STP directo añade una
capa operativa y contractual que no se justifica para la primera versión sin un
requisito adicional.

Los medios con confirmación diferida no deben retener indefinidamente un horario. Se
debe definir una expiración y comunicar que el horario no queda confirmado hasta que el
proveedor notifique el pago aprobado.

## Consecuencias

La ruta recomendada es más rápida y reduce el riesgo de doble reserva, pero limita los
medios de pago. Adoptar Mercado Pago o SPEI daría más opciones locales a cambio de una
nueva base transaccional, endpoints de pago/webhooks, conciliación, monitoreo y mayor
superficie de seguridad y privacidad.

La aplicación sólo mostrará el botón de reserva de un servicio cuando su URL pública de
Google Calendar esté cargada en Sanity. Adultos y Adolescentes comparten una página de
reserva individual de 50 minutos; Pareja utiliza una página separada de 70 minutos.
Ambas agendas comprueban la disponibilidad del mismo calendario profesional. Si falta
un enlace, el servicio conserva el formulario de solicitud y no simula disponibilidad.
