# Entrega de corrección del formulario en runtime

## Incidente

Durante una sesión de desarrollo con Fast Refresh, `ContactForm` recibió al menos una
lista de opciones como `undefined` y lanzó un error al ejecutar `.map()`. La misma
recarga dejó un identificador obsoleto de Turnstile, que posteriormente intentó
reiniciarse aunque Cloudflare ya no reconocía el widget.

## Corrección

- Servicios, modalidades, días y horas se normalizan a arreglos vacíos antes de buscar
  o renderizar opciones. Esto tolera documentos antiguos o incompletos de Sanity y una
  posible desincronización temporal de módulos durante Fast Refresh.
- Turnstile elimina explícitamente el widget al desmontar el componente y crea uno
  nuevo al reiniciar el formulario. La eliminación tolera que Fast Refresh ya haya
  retirado el widget.
- Se corrigió el texto residual del formulario para describir las tres preferencias
  semanales.

## Riesgo residual

Si Sanity no contiene listas y tampoco puede cargarse el fallback, los selectores
quedarán sin opciones, pero la página no colapsará. Debe mantenerse una prueba de envío
sintético en Preview y Production después de cada cambio de schema o variables.
