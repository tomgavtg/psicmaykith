# Runbook — Google Calendar, datos de reserva y Stripe

## Objetivo

Los dos horarios públicos deben obtener los datos mínimos y el consentimiento antes de
confirmar el pago. La landing sólo enlaza a Google Calendar; no puede agregar campos a
la agenda ni conocer por sí misma si una reserva terminó.

Horarios vigentes:

- Adultos y adolescentes, 50 minutos:
  `https://calendar.app.google/ASqcLDM3toM1cwU39`.
- Pareja, 70 minutos:
  `https://calendar.app.google/mYGWH7GsyeatowKMA`.

## Configurar cada horario

Repite estos pasos por separado para el horario de 50 y el de 70 minutos:

1. En una computadora, entra a Google Calendar con la cuenta profesional.
2. En **Páginas de reserva**, abre el menú del horario y elige **Editar**.
3. Avanza a la configuración de la página de reserva.
4. Abre **Formulario de reserva**. Google ya exige nombre, apellidos y correo.
5. Activa **Requerir verificación por correo electrónico**.
6. Pulsa **Añadir un elemento** y agrega **Número de teléfono** como obligatorio.
7. En el horario de 50 minutos, agrega un elemento personalizado obligatorio:
   **Tipo de sesión (escribe Adulto o Adolescente)**.
8. En ambos horarios, agrega un elemento personalizado obligatorio:
   **Motivo de consulta**. Como ayuda, usa: **Comparte sólo lo necesario, máximo 500
   caracteres. No incluyas diagnósticos, medicamentos, antecedentes ni información de
   otras personas.**
9. En ambos horarios, agrega un elemento personalizado obligatorio:
   **Consentimiento de datos sensibles**. Texto recomendado: **Escribe ACEPTO para
   confirmar que leíste el Aviso de Privacidad y consientes expresamente el tratamiento
   del motivo de consulta únicamente para gestionar esta cita.**
10. En la descripción de la página incluye el enlace completo al aviso:
    `https://www.psicologamayumikitahara.com/aviso-de-privacidad`.
11. Abre **Política de pagos y cancelación**, confirma **Requerir pago al reservar** y
    valida el importe correspondiente. Conserva la política aprobada de 48 horas.
12. Guarda el horario.

Google puede cambiar los nombres de los controles. Si la interfaz ofrece una casilla de
aceptación obligatoria en lugar de respuesta personalizada, conviene usar la casilla.
Si sólo ofrece texto, la instrucción **Escribe ACEPTO** es la alternativa operativa y
debe revisarse legalmente como evidencia suficiente.

## Prueba obligatoria

Ejecuta el flujo desde una ventana privada y con un correo de prueba distinto al de la
organizadora:

1. Abre el enlace público y selecciona un horario.
2. Comprueba que no sea posible continuar con nombre, teléfono, tipo —cuando aplique—,
   motivo o consentimiento vacíos.
3. Confirma que el precio sólo aparezca dentro de Google Calendar/Stripe y coincida con
   el servicio.
4. Completa un pago real controlado.
5. Verifica confirmación de Stripe, evento en Calendar, Google Meet y correos.
6. Revisa quién puede ver el motivo y limita coorganizadores o invitados innecesarios.
7. Cancela la prueba y valida el procedimiento de reembolso. Google advierte que el
   reembolso no se procesa automáticamente; se ejecuta desde Stripe.
8. Documenta fecha, horario probado, resultado y responsable sin copiar el motivo ni
   otros datos personales a tickets o analítica.

## Analítica

La landing puede emitir `click_booking` al abrir la agenda, únicamente con la ubicación
genérica del CTA. Ese evento mide intención, no una reserva pagada. No debe incluir
nombre, teléfono, correo, servicio ni motivo de consulta. Para medir pagos confirmados
se necesita una señal posterior del proveedor; no debe inferirse desde el clic.

## Referencias del proveedor

- [Crear una agenda de citas](https://support.google.com/calendar/answer/10729749?hl=es)
- [Solicitar el pago de las citas](https://support.google.com/calendar/answer/13762729?hl=es)
