# Especificación funcional

## Mapa del sitio

| Ruta | Función | Indexación |
| --- | --- | --- |
| `/` | Landing con exactamente tres secciones | sí |
| `/aviso-de-privacidad` | texto legal editable | sí |
| `/admin` | Sanity Studio autenticado | no |
| `/api/contact` | recepción de formulario por `POST` | no |
| `/robots.txt` | directivas a buscadores | sí |
| `/sitemap.xml` | URLs públicas canónicas | sí |

## Navegación global

El encabezado fijo muestra nombre, anclas “Sobre mí”, “Servicios”, “Agendar” y CTA
“Reservar”. En móvil puede compactar los enlaces sin crear un menú extenso. El CTA
flotante de WhatsApp lleva primero al formulario breve del sitio para solicitar nombre,
servicio, motivo y consentimiento antes de abrir la aplicación externa.

## 1. Sobre mí

- Nombre completo, titular específico y texto de máximo 55 palabras.
- Retrato administrado desde Sanity con placeholder local sólo durante preparación.
- Máximo tres credenciales o elementos de enfoque comprobados.
- CTA primario a `#agendar` y secundario al formulario de WhatsApp.
- Aviso: “Este espacio no sustituye servicios de emergencia ni atención en crisis.”

Copy estructural, no publicable:

> Soy [NOMBRE], psicóloga [ENFOQUE VERIFICADO]. Te ofrezco un espacio profesional y
> respetuoso para [NECESIDAD QUE REALMENTE ATIENDE], de forma [MODALIDAD]. Podemos
> comenzar con una conversación breve para revisar disponibilidad y resolver dudas.

## 2. Servicios

Entre tres y cuatro tarjetas ordenables: nombre, descripción breve, modalidad y
duración. Los honorarios no se muestran en la landing; aparecen dentro de Google
Calendar antes de confirmar el pago. Cada CTA abre el horario correspondiente. Una
imagen editorial o del consultorio es administrable desde Sanity.

No se muestra una tarjeta incompleta ni se inventan servicios. Si precio o duración no
se publican, se omiten sin dejar etiquetas vacías.

## 3. Agendar

Presenta dos rutas, con la reserva como acción principal:

- Google Calendar: selección de un horario disponible, captura de datos, aceptación
  de privacidad y pago con Stripe antes de confirmar el espacio.
- WhatsApp: formulario local breve con nombre, servicio, motivo de consulta y dos
  consentimientos obligatorios; al enviarlo construye un enlace
  `https://wa.me/[NUMERO]?text=[MENSAJE_CODIFICADO]` que la persona revisa antes de
  enviarlo.

El motivo se limita a 500 caracteres e instruye compartir sólo lo necesario, sin
diagnósticos, medicamentos, antecedentes ni datos de terceros. Ningún valor del
formulario se envía a analítica ni se almacena en la aplicación.

## Flujo de WhatsApp

1. Al interactuar por primera vez emite `form_start` sin valores del formulario.
2. El navegador valida nombre, servicio, motivo y ambos consentimientos.
3. La aplicación construye el mensaje sólo en memoria y abre WhatsApp mediante una
   acción explícita.
4. Emite `click_whatsapp` sin nombre, servicio, motivo ni otro dato personal. No emite
   `generate_lead`, porque el sitio no puede confirmar que el mensaje fue enviado.
5. El formulario anterior de correo y `/api/contact` permanecen disponibles como
   infraestructura de contingencia, pero no forman parte del flujo visible vigente.

## Flujo de reserva

1. `click_booking` registra únicamente la ubicación genérica del CTA, con
   consentimiento analítico y sin identificar el servicio ni a la persona.
2. Google Calendar debe solicitar, antes del pago, nombre, correo, teléfono, tipo de
   sesión, motivo breve, aceptación del aviso y consentimiento de datos sensibles.
3. Stripe procesa el pago dentro del flujo administrado por Google Calendar.
4. La reserva sólo se considera confirmada cuando el proveedor muestra la confirmación
   posterior al pago. El sitio no infiere ni registra esa confirmación.

## Privacidad y emergencia

La casilla enlaza a `/aviso-de-privacidad` y no viene marcada. El texto legal inicial se
identifica como borrador sujeto a revisión jurídica en México.

En Agendar:

> Si estás en una situación de emergencia o riesgo inmediato, llama al 911. Para
> orientación en salud mental en México, puedes comunicarte a la Línea de la Vida:
> 800 911 2000.

Fuentes oficiales consultadas el 27 de julio de 2026: [servicio de emergencias
9-1-1](https://www.gob.mx/911/es/articulos/servicio-de-atencion-de-llamadas-de-emergencias-9-1-1?idiom=es)
y [Línea de la
Vida](https://www.gob.mx/conasama/es/articulos/linea-de-la-vida-800-911-2000?idiom=es).
Estos datos deberán verificarse nuevamente antes de publicar.

## Estados y degradación

- Sanity no disponible: la compilación usa el último contenido publicado disponible;
  la estrategia exacta de caché se define en arquitectura.
- JavaScript desactivado: el contenido y los enlaces de reserva siguen disponibles; el
  mensaje estructurado de WhatsApp requiere JavaScript.
- Turnstile o Resend caído: mensaje neutral y alternativa de WhatsApp.
- WhatsApp no configurado: el CTA no se publica; el formulario y correo quedan visibles.
- Sin consentimiento: no se cargan GTM, Meta ni TikTok.

## Criterios funcionales

- Sólo las tres secciones requeridas aparecen en la landing.
- Todos los enlaces y botones tienen destino, foco y etiqueta discernibles.
- Cada servicio con agenda abre el horario correcto sin revelar el precio en la landing.
- Ningún valor sensible entra en analítica, URL, almacenamiento del navegador o logs.
- Contenido, mensajes, contacto, SEO y aviso legal definidos en el modelo de Sanity son
  editables por una persona autenticada.
