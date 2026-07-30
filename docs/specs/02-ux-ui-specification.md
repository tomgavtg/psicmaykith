# Especificación UX/UI

## Intención de experiencia

La interfaz debe sentirse como un primer paso seguro, no como una campaña agresiva.
Usa lenguaje directo, opciones predecibles, jerarquía tranquila y suficiente espacio.
La conversión nunca compite con la comprensión ni con la privacidad.

## Arquitectura de la página

El `main` contiene exactamente:

1. `#sobre-mi`: hero y presentación profesional.
2. `#servicios`: opciones de atención.
3. `#agendar`: WhatsApp y formulario.

El aviso de privacidad tiene página propia, pero no constituye una cuarta sección de la
landing. Header y footer son regiones globales; el footer se limita a datos legales,
contacto y enlace al aviso.

## Mobile-first

### 320–480 px

- Una columna, margen lateral mínimo de 16 px y áreas táctiles de al menos 44 × 44 px.
- Header compacto con nombre abreviado de forma aprobada y navegación por anclas que
  pueda envolver sin provocar scroll horizontal.
- Tipografía fluida sin texto de formulario menor a 16 px.
- CTAs principales de ancho completo cuando favorezca el toque.
- Foto después del titular y antes de las credenciales; proporción estable para evitar
  CLS.
- Tarjetas apiladas. Formulario en una columna.
- CTA flotante separado de barras del navegador y del botón de envío.

### 768–1024 px

Hero en dos columnas equilibradas; tarjetas en dos columnas; formulario y alternativa
de WhatsApp pueden compartir retícula si cada bloque conserva lectura y orden lógico.

### 1440 px

Contenedor máximo aproximado de 1,200 px, líneas de texto de 55–75 caracteres y espacio
exterior generoso. No estirar tarjetas ni fotografía hasta perder proporción.

Los puntos se validan obligatoriamente en 320, 375, 390, 768, 1024 y 1440 px.

## Dirección visual

Tokens orientativos, sujetos a validación de contraste:

| Rol | Color inicial | Uso |
| --- | --- | --- |
| fondo | marfil `#FAF7F0` | superficie principal |
| superficie | blanco cálido `#FFFDFC` | tarjetas y formulario |
| primario | verde `#38584A` | CTA, enlaces y foco |
| texto | grafito `#252927` | cuerpo |
| texto secundario | `#5C625E` | metadatos, nunca texto crítico débil |
| acento | terracota `#A75F48` | detalle limitado |

Cada combinación debe alcanzar WCAG 2.2 AA: 4.5:1 para texto normal y 3:1 para texto
grande, iconos esenciales, bordes de controles y estados de foco. El color no es el
único indicador.

Títulos con una serif editorial optimizada y cuerpo con sans-serif de alta legibilidad,
preferentemente fuentes locales o del sistema. Máximo dos familias y pocos pesos. El
tamaño usa `clamp()` y el interlineado evita bloques densos.

## Componentes conceptuales

### Header

Nombre, tres enlaces ancla y CTA. Es fijo sólo si no reduce demasiado el viewport móvil.
Al navegar, el destino no queda oculto bajo el header (`scroll-margin-top`). El enlace
activo no es imprescindible.

### Hero

Orden semántico: `h1`, titular, descripción, credenciales, CTAs, aviso y fotografía. La
fotografía auténtica tiene fondo limpio, luz natural, permiso documentado y alt que
identifica a la profesional sin atributos subjetivos.

### Tarjeta de servicio

`h3`, descripción, modalidad y datos opcionales; CTA con contexto, por ejemplo
“Solicitar información sobre [servicio]”. Todas las tarjetas mantienen el mismo orden,
pero no fuerzan alturas que creen espacios artificiales.

### Agendar

WhatsApp se presenta como ruta rápida; el formulario, como alternativa por correo.
Ninguna se etiqueta como más confidencial. Privacidad, tiempos de respuesta
`[POR DEFINIR]` y no-emergencia aparecen antes de enviar.

### Consentimiento analítico

Banner no modal, con “Aceptar”, “Rechazar” y configuración equivalente en prominencia y
operable por teclado. Rechazar no bloquea contenido, WhatsApp ni formulario. La elección
puede revisarse desde el footer.

## Copy de ejemplo

Los siguientes textos son placeholders, no afirmaciones publicables:

- H1: “[NOMBRE], atención psicológica [MODALIDAD/ZONA]”.
- Titular: “Un espacio profesional para hablar con claridad y a tu ritmo.”
- CTA primario: “Agendar por WhatsApp”.
- CTA secundario: “Conocer servicios”.
- Servicios: “[SERVICIO REAL]”, “[DESCRIPCIÓN APROBADA EN 25–35 PALABRAS]”.
- Formulario: “Cuéntame sólo lo necesario para contactarte y revisar disponibilidad.”
- Éxito: “Gracias. Tu solicitud fue enviada. Te responderemos en [PLAZO CONFIRMADO].”
- Error: “No pudimos enviar tu solicitud. Intenta de nuevo o escríbenos por WhatsApp.”

Evitar “paciente ideal”, “cura”, “elimina”, “garantizado”, “la mejor” y mensajes que
culpabilicen por no convertir.

## Accesibilidad e interacción

- Un solo `h1`; jerarquía de encabezados sin saltos arbitrarios.
- Enlace “Saltar al contenido”, landmarks y nombres accesibles únicos.
- Foco visible de 2 px o equivalente con contraste mínimo 3:1.
- Orden de DOM igual al orden visual; sin `tabindex` positivo.
- Errores asociados con `aria-describedby`, resumen enfocable y texto específico.
- Estados asíncronos con `aria-live`; el botón indica progreso sin perder su etiqueta.
- Iconos decorativos ocultos; iconos funcionales siempre acompañados por texto o nombre.
- Respeto a zoom 200–400 %, orientación, reflow y preferencias de contraste/movimiento.
- Con `prefers-reduced-motion`, eliminar desplazamiento suave y transiciones no
  esenciales.

## Imágenes y rendimiento percibido

El retrato reserva dimensiones y puede ser candidato LCP con prioridad sólo si aparece
en el primer viewport. Las imágenes de Servicios y Agendar usan lazy loading. Se sirven
AVIF/WebP responsivos mediante `next/image`; nunca se usa una imagen de fondo como
contenido principal. Placeholders locales no llegan a publicación.

## Criterios de aceptación visual

- Cero scroll horizontal en todos los anchos objetivo y a 400 % de zoom.
- CTA flotante no cubre campos, avisos, footer ni mensajes.
- Ningún cambio de contenido desplaza inesperadamente la página.
- Formulario utilizable con una mano y teclados `email`, `tel` y texto correctos.
- Información y acciones siguen disponibles sin animación y antes del consentimiento.
