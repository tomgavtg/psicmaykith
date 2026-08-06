# Textos de la aplicación

## Estado editorial

Versión propuesta `v0.1`, elaborada el 4 de agosto de 2026 a partir de
`docs/copys/propuesta-sitio-web-psicoterapia.md` y adaptada a la landing de tres
secciones definida en `docs/specs/02-ux-ui-specification.md`.

Estos textos sirven para revisar la experiencia local y cargar contenido en Sanity.
No equivalen a aprobación profesional, legal ni de publicación. Antes de producción
deben confirmarse la formación, población atendida,
servicios, disponibilidad, plazo de respuesta y
fotografías.

## Configuración del sitio

- Nombre del sitio: **Psicoterapia psicoanalítica en línea**
- Nombre corto: **Psicoterapia en línea**
- Aviso global: **Este espacio no sustituye servicios de emergencia ni atención en
  crisis.**
- Pie de página: **Un espacio de escucha profesional para comprender lo que sientes y
  trabajar aquello que se repite. Atención en línea con cita previa.**

El aviso de crisis conserva el texto técnico existente y debe verificarse contra una
fuente oficial inmediatamente antes de publicar.

## Inicio y sobre mí

- Título principal: **Lo que sientes hoy tiene una historia. Podemos empezar a
  entenderla.**
- Titular: **Psicoterapia psicoanalítica en línea para adolescentes, adultos y
  parejas.**
- Descripción breve: **Un espacio de escucha para comprender lo que sientes, reconocer
  patrones que se repiten y construir nuevas formas de relacionarte contigo y con otras
  personas. Las sesiones se realizan por videollamada y cada proceso se trabaja de
  manera particular.**
- CTA principal: **Reservar una cita**
- CTA secundario: **Contactar por WhatsApp**

### Situaciones de identificación

- Sientes ansiedad y no logras explicar del todo de dónde viene.
- Repites discusiones o situaciones parecidas en tus relaciones.
- Por fuera parece que todo está bien, pero algo por dentro no termina de acomodarse.
- Te preocupa cómo acercarte a tu hija o hijo adolescente sin generar más distancia.
- Sabes que necesitas hablar con alguien, aunque todavía no tengas claro por dónde
  empezar.

### Enfoque

**El enfoque psicoanalítico parte de que no todo lo que sentimos o hacemos tiene una
razón consciente. Explorar la historia de nuestros vínculos permite reconocer patrones,
poner en palabras lo que ocurre y abrir la posibilidad de relacionarnos de otra manera.
No se trata de quedarse en el pasado, sino de comprender cómo sigue presente.**

### Perfil profesional

- Nombre profesional: **Psicóloga Marissa Mayumi Kitahara Funes**.
- Formación: `[POR DEFINIR: formación verificada]`
- Cédula profesional: **10630199**.
- Fotografía propuesta: `public/images/psychologist/PhotoMK1.jpeg`.
- Alt propuesto: **Retrato de la profesional sentada junto a una mesa en un espacio
  interior.**
- Derechos y permiso: `[POR DEFINIR: titular, autorización y alcance de uso]`.

No se convirtió el borrador de “Sobre mí” de la fuente en texto biográfico porque
requiere datos personales y profesionales que todavía no están confirmados.

## Servicios propuestos

### Terapia para adultos

**Un espacio para comprender lo que sientes, reconocer patrones en tus relaciones o
decisiones y poner en palabras aquello que todavía resulta difícil nombrar.**

- Modalidad: En línea.
- Duración: **50 minutos**.
- Honorarios configurados: **$750 MXN por sesión**; no se muestran en la tarjeta y
  aparecen dentro del flujo de reserva.

### Terapia para adolescentes

**Un espacio de escucha adaptado a su edad, donde pueda hablar sin sentirse juzgado o
evaluado. El encuadre y la comunicación con madres, padres o tutores se acuerdan antes
de comenzar.**

- Modalidad: En línea.
- Duración: **50 minutos**.
- Honorarios configurados: **$750 MXN por sesión**; no se muestran en la tarjeta y
  aparecen dentro del flujo de reserva.
- Antes de publicar: confirmar atención real a menores y obtener revisión profesional
  y legal del encuadre, consentimiento, confidencialidad y comunicación con tutores.

### Terapia de pareja

**Un espacio neutral para escuchar lo que sucede entre ambos, comprender los conflictos
que se repiten y conversar sin buscar quién tiene la razón.**

- Modalidad: En línea.
- Duración: **1 hora con 10 minutos**.
- Honorarios configurados: **$1,200 MXN por sesión**; no se muestran en la tarjeta y
  aparecen dentro del flujo de reserva.

## Agenda

- Encabezado: **Reserva tu sesión en línea**
- Introducción: **Consulta los horarios disponibles, completa tus datos y realiza el
  pago para confirmar tu cita. Si antes necesitas orientación, puedes enviar tu nombre,
  el servicio de interés y un motivo de consulta breve por WhatsApp.**
- Campo obligatorio: **Motivo de consulta**. Debe limitarse a 500 caracteres y mostrar
  una instrucción para compartir sólo lo necesario, sin diagnósticos, medicamentos,
  antecedentes ni información de otras personas.
- Consentimiento separado: **Consiento expresamente el tratamiento del motivo de
  consulta, que puede revelar datos personales sensibles, únicamente para atender mi
  solicitud y gestionar una posible cita.**
- WhatsApp: **Completa estos datos para preparar el mensaje. Podrás revisarlo antes de
  enviarlo desde WhatsApp; completar este paso no reserva una cita ni realiza un
  cobro.**
- Recordatorio: **Comparte sólo lo necesario. No incluyas diagnósticos, medicamentos,
  antecedentes ni información de otras personas.**
- El plazo de respuesta no se muestra mientras no exista un compromiso operativo
  aprobado.

El formulario mantiene el lenguaje que aclara que una solicitud no confirma la cita ni
crea un expediente.

### Reserva con pago

- Cada servicio tendrá su propio enlace público de Horarios de citas de Google
  Calendar con pago mediante Stripe.
- Cancelación sin penalización: hasta **48 horas antes** de la sesión.
- Reprogramación solicitada por la persona usuaria: **no disponible**.
- Cancelación tardía: **sin reembolso**.
- Inasistencia: **sin reembolso**.
- Cancelación por parte de la psicóloga: **se ofrecerá reprogramación**.
- Adultos y adolescentes utilizan el horario individual público:
  `https://calendar.app.google/ASqcLDM3toM1cwU39`.
- Pareja utiliza el horario público de 70 minutos:
  `https://calendar.app.google/mYGWH7GsyeatowKMA`.

## SEO propuesto

- Título: **Psicoterapia psicoanalítica en línea | Citas**
- Descripción: **Conoce la propuesta de psicoterapia psicoanalítica en línea para
  adolescentes, adultos y parejas, y solicita información para una primera cita.**
- Imagen social y texto alternativo: `[POR DEFINIR]`.

Mientras falte aprobación del contenido completo, la aplicación debe conservar el modo
de demostración y la directiva `noindex`.

## Contenido reservado para una siguiente iteración

La fuente también propone preguntas frecuentes, blog y recursos. No se agregaron como
secciones independientes porque la arquitectura vigente limita la landing a Inicio,
Servicios y Agendar. Conviene modelarlos en Sanity y revisar el alcance del producto
antes de incorporarlos.
