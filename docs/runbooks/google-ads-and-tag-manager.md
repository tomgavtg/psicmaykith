# Runbook: Google Ads y Tag Manager

## Precondiciones

Cuenta empresarial con acceso de mínimo privilegio, contenedor GTM y cuenta Google Ads
`[POR DEFINIR]`, aviso de privacidad aprobado, consentimiento implementado y dominio
verificado. No colocar IDs reales en documentos ni código; usar variables de Vercel.

## Configuración

1. Crear espacios de trabajo separados y registrar propietario.
2. Configurar `NEXT_PUBLIC_GTM_ID` sólo en el entorno correspondiente.
3. Mantener el loader bloqueado hasta consentimiento analítico/marketing afirmativo.
4. Crear variables de capa de datos con lista permitida; nunca habilitar payload del
   formulario ni DOM scraping.
5. Mapear `generate_lead` como conversión principal y `click_whatsapp` como secundaria
   mientras se valida calidad.
6. Definir nombres UTM y plantillas de seguimiento sin PII ni términos clínicos.
7. Probar Preview/Tag Assistant con datos ficticios y publicar una versión documentada.

## Eventos permitidos

`view_landing`, `click_whatsapp`, `form_start`, `generate_lead`, `click_email`, con los
parámetros enumerados en `05-marketing-analytics-and-seo.md`.

## Prohibiciones

No enviar nombre, correo, teléfono, mensaje, diagnóstico, síntomas o datos de salud. No
activar Enhanced Conversions con datos del formulario. No cargar etiquetas antes de
consentimiento ni usar URLs/UTMs que codifiquen información sensible.

## Validación

En una sesión nueva y antes de consentir, Network debe mostrar cero solicitudes a
Google Analytics/Ads/Tag Manager. Tras rechazar, permanece en cero. Tras aceptar, cada
evento se dispara una vez y no contiene PII. Preview nunca contamina producción.

Revisar políticas y configuración nuevamente antes de lanzar campañas.
