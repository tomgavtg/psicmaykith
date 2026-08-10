# Entrega: endpoint de recopilación de GA4 en CSP

Fecha: 10 de agosto de 2026.

## Alcance

Se corrigió la política CSP del sitio público para permitir el endpoint de
recopilación que GA4 usa actualmente en producción:
`https://analytics.google.com/g/collect`.

## Evidencia y decisión

- La consola del navegador registró un bloqueo de `connect-src` para ese endpoint.
- Tag Assistant mostraba `GA4 - click_whatsapp` como activada, pero el hit no llegaba
  a Tiempo real de GA4 porque el navegador lo bloqueaba antes de enviarlo.
- `https://*.analytics.google.com` no coincide con el dominio raíz
  `analytics.google.com`.
- Se añadió únicamente `https://analytics.google.com`; no se incorporaron comodines
  generales, protocolos inseguros ni permisos distintos.

## Verificación requerida después del despliegue

1. Abrir una sesión nueva de Preview de GTM para recibir la CSP actualizada.
2. Autorizar analítica desde las preferencias de privacidad.
3. Pulsar **Continuar en WhatsApp**.
4. Confirmar en Network una solicitud a `analytics.google.com/g/collect` con estado
   `204` y sin errores CSP.
5. Confirmar `click_whatsapp` en GA4 Tiempo real o DebugView.

No deben enviarse nombre, servicio ni motivo de consulta en el evento.
