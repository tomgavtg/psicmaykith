# Runbook: GA4, Google Ads y Google Tag Manager

## Estado implementado

La aplicación implementa consentimiento básico: no descarga Google Tag Manager ni
envía eventos mientras la persona no acepte analítica o marketing. La preferencia se
guarda por categorías durante 180 días, se puede cambiar desde el enlace del pie de
página y mantiene `ad_personalization=denied` aun al aceptar marketing.

La capa de datos sólo admite estos eventos y parámetros:

| Evento | Parámetros disponibles |
| --- | --- |
| `view_landing` | `path`, `referrer_class`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_content` |
| `click_whatsapp` | `location` |
| `form_start` | ninguno |
| `generate_lead` | `method` |
| `click_email` | `location` |
| `click_booking` | `location` |

No se envían campos del formulario, identificadores de clic almacenados manualmente,
`utm_term`, URL de referencia completa ni servicio solicitado.

## 1. Crear los activos

1. Crear una propiedad GA4 empresarial y un flujo web para
   `https://www.psicologamayumikitahara.com`.
2. Crear un contenedor web de Google Tag Manager exclusivo para Production.
3. Crear otro contenedor para Preview sólo si realmente se medirá ese ambiente.
4. Vincular Google Ads con GA4 usando cuentas nominales, MFA y mínimo privilegio.
5. Registrar propietario, suplente y propósito de cada activo fuera del repositorio.
6. No configurar Enhanced Conversions, User-ID, Google Signals, remarketing ni
   audiencias relacionadas con salud sin una evaluación legal y de políticas separada.

## 2. Configurar Vercel

1. Abrir **Vercel → Project → Settings → Environment Variables**.
2. Crear `NEXT_PUBLIC_GTM_ID` con el valor `GTM-...` del contenedor.
3. Marcar únicamente **Production** para el contenedor productivo.
4. Si existe un contenedor de prueba, crear un valor distinto con alcance **Preview**.
5. No crear una variable para GA4 en la aplicación: el ID `G-...` vive en GTM.
6. Guardar y generar un deployment nuevo; las variables públicas se incorporan durante
   el build.

Si `NEXT_PUBLIC_GTM_ID` está vacío o no tiene formato `GTM-...`, la aplicación no carga
GTM. Nunca colocar el ID directamente en un componente.

## 3. Configurar GTM

1. Crear variables de capa de datos para cada parámetro permitido de la tabla anterior.
2. Crear disparadores **Custom Event** con coincidencia exacta para los seis eventos.
3. Crear una etiqueta **Google tag** con el ID `G-...` de GA4.
4. Desactivar medición automática que capture formularios, búsquedas o clics no
   aprobados. No habilitar DOM scraping.
5. Crear etiquetas de evento GA4 para los seis eventos y mapear sólo los parámetros
   que corresponden a cada uno.
6. En **Consent Settings**, exigir `analytics_storage` para GA4.
7. Crear en Google Ads una acción de conversión web para `generate_lead`; usarla como
   conversión principal sólo después de validar que representa envíos exitosos.
8. Crear opcionalmente una conversión secundaria para `click_whatsapp`.
9. Mantener `click_booking` como evento de intención y conversión secundaria: el clic
   no demuestra que la reserva ni el pago se hayan completado.
10. En las etiquetas de Google Ads exigir `ad_storage` y `ad_user_data`. Mantener
   personalización y remarketing deshabilitados.
11. No crear variables de nombre, correo, teléfono, mensaje, selección de servicio ni
    elementos del DOM.

## 4. Convención de campañas

Usar únicamente valores normalizados sin información de una persona o condición:

```text
utm_source:  google | bing | facebook | instagram | meta | tiktok | linkedin | newsletter | direct
utm_medium:  cpc | paid_social | organic | referral | email | social
utm_campaign y utm_content: letras, números, punto, guion o guion bajo; máximo 100 caracteres
```

Ejemplo permitido:

```text
https://www.psicologamayumikitahara.com/?utm_source=google&utm_medium=cpc&utm_campaign=consulta_mx_brand&utm_content=anuncio_1
```

No usar diagnósticos, síntomas, nombre, teléfono, correo ni audiencias clínicas en una
UTM. `utm_term` se descarta deliberadamente.

## 5. Validar y publicar el contenedor

La CSP de la aplicación debe permitir los recursos oficiales de Preview Mode de
`tagmanager.google.com`, `googletagmanager.com`, `fonts.googleapis.com`,
`fonts.gstatic.com`, `ssl.gstatic.com` y `www.gstatic.com`. Si Tag Assistant muestra
errores para `badge.css`, Material Icons o Google Sans, verificar primero la cabecera
`Content-Security-Policy` del deployment antes de cambiar extensiones o consentimiento.
La directiva `connect-src` debe incluir además el host exacto
`https://analytics.google.com`: GA4 puede usar
`https://analytics.google.com/g/collect` para la recopilación. El comodín
`https://*.analytics.google.com` no cubre el dominio raíz y, por sí solo, provoca que
el navegador bloquee el hit aunque Tag Assistant muestre la etiqueta como activada.
Las respuestas normales conservan `Cross-Origin-Opener-Policy: same-origin`; cuando la
URL incluye una señal reconocida de Tag Assistant (`_dbg`, `gtm_debug`, `gtm_preview` o
`gtm_auth`), el proxy responde temporalmente con `unsafe-none` para conservar el canal
`window.opener` que necesita la sesión de depuración. La excepción no debe activarse
para parámetros de campañas ni para navegación ordinaria.

1. Abrir una ventana incógnita con almacenamiento y cookies limpios.
2. Antes de elegir, comprobar en Network que no existen solicitudes a
   `googletagmanager.com`, `google-analytics.com` o `doubleclick.net`.
3. Elegir **Rechazar todo** y repetir la comprobación.
4. En otro perfil limpio elegir **Sólo analítica**: GTM/GA4 pueden cargar, pero las
   etiquetas publicitarias deben permanecer bloqueadas.
5. En otro perfil elegir **Aceptar todo** y validar los eventos con Tag Assistant.
6. En cada payload comprobar que sólo aparecen los parámetros de la tabla.
7. Probar WhatsApp y la agenda; confirmar un `click_whatsapp` o `click_booking` sin
   datos del formulario. El sitio no puede confirmar el envío externo ni el pago.
8. Cambiar la preferencia a rechazo desde el pie y confirmar que no se envían nuevos
   eventos. Borrar manualmente cookies previas durante la prueba de revocación.
9. Publicar en GTM una versión con nombre, fecha, responsable y ticket de aprobación.
10. Verificar nuevamente Network y GA4 DebugView sobre el deployment productivo.

### Diagnóstico cuando `click_whatsapp` aparece en cero

1. Abrir **Preferencias de privacidad** en el pie del sitio y confirmar que la
   preferencia del navegador permite **Sólo analítica** o **Aceptar todo**. Con
   **Rechazar todo**, el sitio no carga GTM ni emite `click_whatsapp`; es el
   comportamiento esperado y no debe eludirse.
2. Entrar a Preview de GTM, completar los campos obligatorios y pulsar **Continuar en
   WhatsApp**. Debe aparecer un evento de capa de datos `click_whatsapp` con únicamente
   `location: contact_form`.
3. En ese evento, confirmar que se activa `GA4 - click_whatsapp` y que no hay errores
   de consentimiento en la etiqueta.
4. En Network, filtrar por `g/collect` y verificar que la solicitud de
   `analytics.google.com` obtiene `204`. Si aparece `blocked:csp` o la consola indica
   una violación de `connect-src`, comprobar la cabecera CSP del documento y no sólo
   el estado de la etiqueta en Tag Assistant.
5. Confirmar primero la llegada en **GA4 → Tiempo real** o **DebugView**. Los informes
   agregados y el conteo de eventos clave no deben usarse como prueba inmediata.
6. En **Administrar → Eventos**, confirmar que `click_whatsapp` conserva la estrella
   de evento clave. El sitio emite el evento, pero la clasificación como evento clave
   se administra en GA4.
7. No enviar nombre, servicio ni motivo a GTM o GA4 durante la prueba.

Google documenta que el estado predeterminado debe definirse antes de enviar medición y
actualizarse inmediatamente cuando cambia la elección. Esta implementación conserva
todos los estados en `denied` hasta la acción afirmativa y no carga el tag en rechazo.

## Bloqueos antes de campañas

- IDs, responsables y objetivos numéricos aprobados.
- Aviso de privacidad definitivo y consentimiento revisado legalmente.
- Validación de las políticas vigentes de publicidad relacionada con salud.
- Contenedor sin etiquetas automáticas, PII, Enhanced Conversions ni audiencias
  sensibles.
- Evidencia del checklist en `docs/qa/launch-checklist.md`.

## Fuentes oficiales

- [Configurar el modo de consentimiento](https://developers.google.com/tag-platform/security/guides/consent?hl=es-419)
- [Depurar el modo de consentimiento con Tag Assistant](https://developers.google.com/tag-platform/security/guides/consent-debugging)
- [Política de publicidad personalizada: salud](https://support.google.com/adspolicy/answer/143465?hl=es-419)
