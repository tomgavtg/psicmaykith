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
“Agendar por WhatsApp”. En móvil puede compactar los enlaces sin crear un menú extenso.
El CTA flotante de WhatsApp es discreto, tiene nombre accesible y no tapa controles.

## 1. Sobre mí

- Nombre completo, titular específico y texto de máximo 55 palabras.
- Retrato administrado desde Sanity con placeholder local sólo durante preparación.
- Máximo tres credenciales o elementos de enfoque comprobados.
- CTA primario a WhatsApp y secundario a `#servicios`.
- Aviso: “Este espacio no sustituye servicios de emergencia ni atención en crisis.”

Copy estructural, no publicable:

> Soy [NOMBRE], psicóloga [ENFOQUE VERIFICADO]. Te ofrezco un espacio profesional y
> respetuoso para [NECESIDAD QUE REALMENTE ATIENDE], de forma [MODALIDAD]. Podemos
> comenzar con una conversación breve para revisar disponibilidad y resolver dudas.

## 2. Servicios

Entre tres y cuatro tarjetas ordenables: nombre, descripción breve, modalidad, duración
y honorarios opcionales. “Solicitar información” mueve el foco a `#agendar`,
preselecciona el servicio y anuncia el cambio a tecnologías de asistencia. Una imagen
editorial o del consultorio es administrable desde Sanity.

No se muestra una tarjeta incompleta ni se inventan servicios. Si precio o duración no
se publican, se omiten sin dejar etiquetas vacías.

## 3. Agendar

Presenta primero dos alternativas equivalentes:

- WhatsApp mediante `https://wa.me/[NUMERO]?text=[MENSAJE_CODIFICADO]`.
- Formulario por correo.

Aviso cercano a ambos controles: “Por tu privacidad, evita compartir información
clínica o sensible por este medio.”

El formulario contiene nombre, correo, teléfono opcional, servicio, modalidad, día u
horario, mensaje opcional, aceptación obligatoria del aviso de privacidad, honeypot y
Turnstile. Usa `autocomplete`, tipos de teclado apropiados y campos de 16 px o más.

## Flujo del formulario

1. Al interactuar por primera vez emite `form_start` sin valores del formulario.
2. El navegador valida requisitos básicos y envía JSON de menos de 10 KB.
3. `/api/contact` acepta sólo `POST`; comprueba `Content-Type`, tamaño, `Origin` y
   `Host` contra configuración canónica.
4. Zod normaliza y valida una lista cerrada de campos; rechaza claves inesperadas,
   honeypot lleno y URLs/contenido claramente automatizado según reglas documentadas.
5. El servidor valida el token Turnstile con Cloudflare y aplica límite operativo en
   aplicación además del rate limit perimetral.
6. Resend envía un correo a `LEADS_TO_EMAIL`; el remitente es
   `RESEND_FROM_EMAIL` y el correo del prospecto se usa sólo como `replyTo`.
7. No hay persistencia. Los logs registran código de resultado, timestamp, request ID y
   latencia, nunca payload, correo, teléfono, nombre ni texto.
8. En éxito se limpia el formulario, se emite `generate_lead` sin PII y se muestra el
   mensaje editable. En error conserva los campos localmente, ofrece reintentar y
   WhatsApp como alternativa.

Respuestas previstas: `200` éxito, `400` entrada inválida, `403` origen o Turnstile,
`413` cuerpo excesivo, `415` tipo no admitido, `429` límite excedido, `500/502` fallo
interno/proveedor. El texto público no revela detalles internos.

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
- JavaScript desactivado: el contenido sigue siendo legible y las anclas funcionan;
  WhatsApp permanece disponible.
- Turnstile o Resend caído: mensaje neutral y alternativa de WhatsApp.
- WhatsApp no configurado: el CTA no se publica; el formulario y correo quedan visibles.
- Sin consentimiento: no se cargan GTM, Meta ni TikTok.

## Criterios funcionales

- Sólo las tres secciones requeridas aparecen en la landing.
- Todos los enlaces y botones tienen destino, foco y etiqueta discernibles.
- Seleccionar un servicio actualiza el formulario sin enviar datos.
- Ningún valor sensible entra en analítica, URL, almacenamiento del navegador o logs.
- Contenido, mensajes, contacto, SEO y aviso legal definidos en el modelo de Sanity son
  editables por una persona autenticada.
