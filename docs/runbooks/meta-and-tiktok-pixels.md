# Runbook: Meta y TikTok Pixels

## Precondiciones

Business Manager/Business Center, activos y responsables `[POR DEFINIR]`; dominio
verificado; consentimiento de marketing; aviso aprobado; y revisión de políticas para
publicidad relacionada con salud.

## Configuración

1. Guardar `NEXT_PUBLIC_META_PIXEL_ID` y `NEXT_PUBLIC_TIKTOK_PIXEL_ID` en Vercel por
   entorno, nunca IDs mezclados entre Preview y Production.
2. Cargar cada SDK sólo después de consentimiento afirmativo.
3. Mapear únicamente eventos genéricos aprobados y parámetros en lista permitida.
4. Desactivar Advanced Matching, identificación automática y scraping automático.
5. No habilitar Conversions API en v1; requeriría un análisis separado de datos y base
   legal.
6. En Click-to-WhatsApp usar el mismo número Business confirmado y copy aprobado.
7. Registrar versión, fecha, responsable y propósito de cada cambio.

## Prohibiciones

No transmitir PII, hashes, mensajes, diagnósticos, síntomas, especialidades como
atributos de una persona, ni construir audiencias sensibles. No usar texto libre como
nombre de evento o parámetro.

## Prueba

Con herramientas de píxel y Network: cero request antes de aceptar y después de
rechazar; un disparo por acción tras aceptar; revocar detiene futuros eventos; payloads
sin PII; y entornos de prueba separados. Repetir al cambiar el banner o contenedor.
