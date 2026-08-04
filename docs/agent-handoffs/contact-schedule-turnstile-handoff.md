# Entrega de preferencias de horario y revisión de Turnstile

## Alcance

Se sustituyó la fecha y el horario genérico por tres preferencias semanales distintas.
Cada preferencia contiene un día publicado y una hora de inicio; la interfaz calcula el
fin según los 50 minutos de adultos/adolescentes o los 70 minutos de pareja. El correo
recibe las tres opciones y recalca que no confirman una cita.

## Configuración editorial

- Días de respaldo: lunes a viernes.
- Inicios de respaldo: cada 30 minutos, de 09:30 a 17:30.
- Sanity incorpora `availableWeekdays` y `availableStartTimes`; los documentos antiguos
  sin estos campos utilizan el respaldo hasta ser actualizados.
- El servidor valida los tres pares contra las listas publicadas y rechaza duplicados.

Estos horarios se implementaron a partir de la ventana y ejemplos indicados por la
persona responsable. Debe confirmarse que todos representan disponibilidad operativa
real antes de habilitar Production.

## Turnstile

- El cliente usa renderizado explícito, `action=contact`, renovación ante expiración y
  mensajes accesibles de fallo.
- El servidor llama a Siteverify con timeout, valida `success`, `action` y hostname, y
  rechaza las credenciales de prueba si Vercel o el sitio indican Production.
- `.env.local` y `.env.example` utilizan el par oficial “always passes” sólo para
  Development.
- CSP ya permite script, frame y conexión con `https://challenges.cloudflare.com`.

## Bloqueantes externos

- En la revisión local, `RESEND_API_KEY`, `LEADS_TO_EMAIL` y `RESEND_FROM_EMAIL` estaban
  vacíos; sin ellos el endpoint no puede entregar solicitudes.
- No existe `.vercel/project.json` ni CLI enlazada en este workspace, por lo que no fue
  posible auditar o cambiar las variables del despliegue desde el repositorio.
- Production requiere crear el widget real de Cloudflare para
  `www.psicologamayumikitahara.com`, agregar las claves en Vercel y redesplegar.
