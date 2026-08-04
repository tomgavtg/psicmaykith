# Runbook: Meta Pixel y TikTok Pixel

## Estado implementado

Los píxeles son opcionales y sólo se descargan con consentimiento de marketing. La
aplicación valida el formato de los IDs y mapea únicamente:

| Acción local | Meta | TikTok | Parámetros enviados directamente |
| --- | --- | --- | --- |
| formulario entregado con HTTP 200 | `Lead` | `Lead` | ninguno |
| clic para abrir WhatsApp | `Contact` | `Contact` | ninguno |

No se activa Advanced Matching, identificación automática, Conversions API, hashes,
servicio seleccionado ni campos del formulario.

## 1. Decidir una sola ruta de instalación

Se debe elegir una de estas rutas por píxel:

1. **Carga directa de la aplicación:** configurar los IDs públicos de Vercel y no
   crear esos mismos píxeles dentro de GTM.
2. **Carga administrada por GTM:** dejar vacías las variables directas y configurar las
   etiquetas en GTM con consentimiento de marketing.

No combinar ambas rutas para el mismo píxel porque duplicaría `PageView`, `Lead` y
`Contact`. Para la primera salida a producción conviene la carga directa implementada,
porque mantiene el bloqueo de red bajo control del código versionado.

## 2. Preparar Meta

1. Crear o seleccionar el Business Portfolio y el dataset/píxel empresarial.
2. Crear o reclamar la página de Facebook empresarial y asignar accesos nominales.
3. Convertir Instagram en cuenta profesional si todavía es personal y vincularla a la
   página desde **Configuración → Permisos → Cuentas vinculadas → Instagram**.
4. Incorporar página e Instagram al mismo Business Portfolio, exigir MFA y evitar
   contraseñas compartidas.
5. Agregar y verificar `psicologamayumikitahara.com` con el método indicado por Meta.
   Si solicita TXT DNS, copiarlo en Cloudflare como **DNS only**.
6. Desactivar Automatic Advanced Matching y cualquier captura automática de campos.
7. Registrar el Pixel ID numérico; el ID es público, pero los accesos y tokens no.
8. En Vercel crear `NEXT_PUBLIC_META_PIXEL_ID` sólo en **Production**.
9. No configurar Access Token ni Conversions API en esta versión.

Instagram no requiere un píxel separado para el sitio: el Meta Pixel del mismo
Business Portfolio mide las campañas web de Facebook e Instagram. Cuando existan URLs
oficiales de ambos perfiles, se agregan a `socialProfiles` en Sanity y se validan antes
de producir `sameAs` en JSON-LD.

## 3. Preparar TikTok

1. Crear o seleccionar un origen de datos web en TikTok Events Manager.
2. Elegir instalación manual de Pixel, sin Advanced Matching.
3. Registrar el Pixel ID alfanumérico.
4. En Vercel crear `NEXT_PUBLIC_TIKTOK_PIXEL_ID` sólo en **Production**.
5. No configurar Events API ni identidad avanzada en esta versión.
6. Revisar en Events Manager que el uso de cookies respete la elección del sitio.

Cada cambio de variables de Vercel exige un deployment nuevo.

## 4. Revisar campañas y contenido

1. Utilizar sólo campañas y creatividades aprobadas por la profesional.
2. No segmentar ni construir audiencias por diagnóstico, síntoma, condición o historia
   clínica real o inferida.
3. No incluir PII o datos sensibles en nombre de campaña, URL, UTM o parámetros.
4. Mantener deshabilitadas audiencias personalizadas basadas en leads del formulario.
5. Validar las políticas vigentes de salud y servicios profesionales antes de publicar
   cada campaña; la aceptación técnica de un píxel no autoriza una campaña.

## 5. Probar

1. Generar un deployment Preview con IDs de prueba distintos o sin IDs productivos.
2. Abrir Production en incógnito y limpiar storage/cookies.
3. Sin decisión y después de **Rechazar todo**, comprobar cero solicitudes a
   `connect.facebook.net`, `facebook.com/tr` y `analytics.tiktok.com`.
4. Con **Sólo analítica**, confirmar que ambos píxeles siguen sin cargar.
5. Con **Aceptar todo**, confirmar un `PageView` de cada proveedor.
6. Usar Meta Pixel Helper y TikTok Pixel Helper para revisar un único disparo.
7. Probar clic a WhatsApp y un envío sintético: deben producir sólo `Contact` y `Lead`,
   respectivamente, sin parámetros personales.
8. Revocar desde el pie de página y comprobar que no se envían eventos futuros. Como
   verificación adicional, borrar cookies ya creadas por los proveedores.
9. Revisar que GTM no contenga otra copia de los mismos píxeles.
10. Registrar fecha, responsable, deployment y capturas sanitizadas en el checklist.

## Fuentes oficiales

- [Meta: políticas de datos de Business Tools](https://www.facebook.com/legal/technology_terms)
- [Meta: vincular una página y una cuenta de Instagram](https://www.facebook.com/help/1148909221857370)
- [TikTok: uso de cookies con Pixel](https://ads.tiktok.com/help/article/how-to-use-cookies-with-tiktok-pixel)
- [TikTok: eventos estándar y parámetros](https://ads.tiktok.com/help/article/standard-events-parameters)
