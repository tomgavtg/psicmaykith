# Handoff de contacto y solicitud de cita

## Entrega

Se amplió el flujo de contacto para que una persona pueda solicitar una primera cita
sin que la interfaz simule disponibilidad o confirmación automática.

## Funcionalidad

- Los enlaces de WhatsApp sólo se generan para números normalizados de 10 a 15 dígitos.
- El número mexicano confirmado se normaliza a `525516098584`; la implementación
  elimina defensivamente el antiguo prefijo `1` cuando recibe el formato `+52 1 ...`.
- La selección de una tarjeta de servicio actualiza el formulario mediante un evento
  controlado y anuncia el cambio a tecnologías de asistencia.
- El formulario acepta una fecha preferida opcional, válida y no anterior a la fecha
  actual en `America/Mexico_City`.
- La solicitud conserva modalidad y ventana de horario; el correo recibido incluye la
  fecha en español de México.
- Interfaz, correo y respuesta de API aclaran que la solicitud no confirma una cita.
- `contacto@psicologamayumikitahara.com` está disponible como alternativa pública por
  correo.

## Archivos principales

- [`../../components/contact/ContactForm.js`](../../components/contact/ContactForm.js)
- [`../../components/sections/Contact.js`](../../components/sections/Contact.js)
- [`../../components/sections/Services.js`](../../components/sections/Services.js)
- [`../../lib/contact/appointment.js`](../../lib/contact/appointment.js)
- [`../../lib/contact/whatsapp.js`](../../lib/contact/whatsapp.js)
- [`../../lib/contact/schema.js`](../../lib/contact/schema.js)
- [`../../lib/contact/email.js`](../../lib/contact/email.js)
- [`../../app/api/contact/route.js`](../../app/api/contact/route.js)

## Privacidad y analítica

- La fecha se envía sólo al endpoint y al buzón; no se agrega a URLs, Sanity,
  localStorage ni eventos analíticos.
- El mensaje de WhatsApp permanece genérico y no incorpora servicio, fecha o campos del
  formulario.
- Las pruebas deben usar datos sintéticos y nunca información clínica.

## Pendientes externos

- confirmar titular operativo de WhatsApp Business y mensaje inicial definitivo;
- configurar y publicar `contactSettings` en Sanity;
- configurar Turnstile, Resend y `LEADS_TO_EMAIL` en Vercel;
- confirmar el plazo real de respuesta;
- decidir en una fase posterior si se necesita una agenda transaccional externa con
  disponibilidad, cancelaciones y recordatorios.

## Criterio de cierre

La funcionalidad sólo se considera operativa en producción después de una prueba
sintética de WhatsApp, una solicitud entregada a correo, validación móvil y revisión del
aviso de privacidad.
