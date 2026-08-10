# Entrega: actualización del número de WhatsApp

Fecha: 10 de agosto de 2026.

## Cambio aplicado

- Número nacional confirmado por la persona responsable: `55 1609 8584`.
- Presentación pública: `+52 55 1609 8584`.
- Valor técnico E.164 sin signo `+`: `525516098584`.
- Destino esperado de los CTA: `https://wa.me/525516098584`.

Se actualizaron el fallback de la aplicación, Sanity Production, el aviso de privacidad,
la documentación operativa y las pruebas. La página del aviso ya no contiene un número
visible fijo: presenta dinámicamente el valor publicado en Sanity.

La consulta pública incluye una revisión de contenido para invalidar la entrada anterior
del Data Cache de Vercel. Esto evita que el número sustituido permanezca visible durante
la ventana normal de revalidación de una hora.

## Validación

- `yarn test`: 50 pruebas aprobadas.
- `yarn lint`: sin errores.
- `yarn build`: compilación de producción correcta.
- Sanity Production confirmó `phoneDisplay: +52 55 1609 8584` y
  `whatsappNumber: 525516098584`.

## Seguimiento externo

Google Ads, Meta/Instagram, el perfil de WhatsApp Business y cualquier directorio
externo deben revisarse por separado. Los recursos publicitarios que todavía apunten al
número anterior no se actualizan desde este repositorio ni desde Sanity.
