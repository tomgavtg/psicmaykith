# Lista de verificación de lanzamiento

## Cómo usarla

Esta lista se completa sobre el mismo artefacto candidato a producción. Para cada
elemento registrar `Pendiente`, `Cumple`, `No cumple` o `No aplica`, responsable, fecha
y enlace a evidencia sanitizada. `No aplica` exige justificación. No pegar secretos,
tokens, cookies, direcciones personales ni payloads de formulario.

## Identificación y aprobaciones

| Verificación | Estado / evidencia |
| --- | --- |
| Dominio canónico | `https://www.psicologamayumikitahara.com` |
| Identificador exacto de versión/deployment | `[POR DEFINIR: commit o deployment ID]` |
| Fecha y ventana de lanzamiento | `[POR DEFINIR: fecha y horario]` |
| Responsable de lanzamiento y rollback | `[POR DEFINIR: nombre o rol autorizado]` |
| Producto aprueba alcance, copy e imágenes | Pendiente |
| Profesional aprueba credenciales, servicios, contacto y afirmaciones | Pendiente |
| Revisión legal en México aprueba aviso de privacidad y textos aplicables | Pendiente |
| Arquitectura aprueba configuración e integraciones | Pendiente |
| Seguridad aprueba perímetro, headers, secretos y riesgos | Pendiente |
| QA aprueba matriz y reporte final | Pendiente |
| No existen P0/P1; P2 aceptados tienen responsable y fecha | Pendiente |

## Contenido y experiencia

- [ ] `/` contiene exactamente Sobre mí, Servicios y Agendar.
- [ ] Nombre, credenciales, servicios, modalidades, horarios, honorarios, contacto e
  imágenes son reales, aprobados y no contienen placeholders.
- [ ] No hay testimonios, promesas de cura, superioridad, contadores ni contenido
  clínico inventado.
- [ ] Los avisos de datos sensibles y emergencia aparecen en el contexto especificado;
  los datos de orientación fueron verificados antes de publicar.
- [ ] WhatsApp, formulario y correo visibles corresponden a la configuración aprobada.
- [ ] Cambios válidos de Sanity fueron publicados y revisados; contenido incompleto no
  produce tarjetas o etiquetas vacías.
- [ ] Sin JavaScript permanecen legibles el contenido, avisos, anclas y alternativa
  de WhatsApp configurada.

## Matriz responsiva y navegadores

| Ancho | Ambiente requerido | Sin overflow/solape | Flujo y evidencia |
| --- | --- | --- | --- |
| 320 px | Chrome Android + emulación auxiliar | [ ] | `[POR DEFINIR: enlace]` |
| 375 px | Safari iOS real | [ ] | `[POR DEFINIR: enlace]` |
| 390 px | Safari iOS y Chrome Android | [ ] | `[POR DEFINIR: enlace]` |
| 768 px | tablet vertical | [ ] | `[POR DEFINIR: enlace]` |
| 1024 px | tablet horizontal/laptop | [ ] | `[POR DEFINIR: enlace]` |
| 1440 px | escritorio | [ ] | `[POR DEFINIR: enlace]` |

- [ ] Se probó orientación vertical/horizontal aplicable sin perder contexto.
- [ ] Objetivos táctiles miden ≥ 44 × 44 CSS px.
- [ ] Campos móviles usan fuente ≥ 16 CSS px, teclado y `autocomplete` adecuados.
- [ ] Header y CTA flotante no cubren contenido, foco, Turnstile ni controles.
- [ ] Texto a 200 %, zoom y reflow no eliminan contenido ni fuerzan scroll en dos ejes.

## Accesibilidad WCAG 2.2 AA

- [ ] axe en landing, privacidad, errores y éxito: cero críticos/serios abiertos.
- [ ] Flujo completo sólo con teclado; orden lógico y sin trampa.
- [ ] Foco visible ≥ 3:1 y nunca oculto por elementos fijos.
- [ ] Anclas, preselección, errores y éxito sitúan o anuncian el contexto.
- [ ] Idioma `es-MX`, landmarks, encabezados, nombres, etiquetas y relaciones correctos.
- [ ] Contraste: texto normal ≥ 4.5:1; grande ≥ 3:1; componentes/estados ≥ 3:1.
- [ ] La información y los errores no dependen sólo del color.
- [ ] Revisión con tecnologías de asistencia en plataformas móviles objetivo.
- [ ] `prefers-reduced-motion` reduce movimiento no esencial; no hay destellos.
- [ ] La aceptación del aviso inicia desmarcada y es operable.

## Formulario y Resend

- [ ] Payload mínimo válido devuelve `200`, genera una sola entrega y éxito accesible.
- [ ] El remitente es el configurado y el correo sintético sólo se usa como `replyTo`.
- [ ] Requeridos, formatos, longitudes, enums, claves inesperadas y consentimiento
  inválido reciben `400` sin entrega.
- [ ] Tipo no admitido recibe `415`; body > 10 KB recibe `413`.
- [ ] `Origin`/`Host` ajenos y Turnstile inválido, reutilizado, ausente o vencido se
  rechazan con `403`.
- [ ] Honeypot y reglas de spam bloquean el envío sin falsos positivos conocidos.
- [ ] Rate limit de aplicación devuelve `429` según el umbral documentado.
- [ ] Cloudflare desafía al exceder cinco solicitudes por IP en diez minutos y registra
  el evento.
- [ ] `GET`, `PUT`, `PATCH`, `DELETE`, `TRACE` y `CONNECT` no procesan leads.
- [ ] Doble clic o Enter repetido no causa entregas duplicadas previsibles.
- [ ] Fallo de Turnstile y Resend conserva campos, no revela internals y ofrece
  WhatsApp.
- [ ] Logs de todos los status sólo contienen metadatos permitidos, nunca payload o PII.
- [ ] Éxito limpia campos y emite un solo `generate_lead` sin PII; error no lo emite.
- [ ] Se exigen tres preferencias distintas; días/horas fuera de la lista publicada y
  combinaciones duplicadas se rechazan sin perder los demás campos.
- [ ] Seleccionar un servicio desde su tarjeta actualiza el formulario y anuncia el
  cambio a tecnologías de asistencia.

## WhatsApp

- [ ] Todos los CTA usan `https://wa.me/`, número sólo con dígitos y mensaje codificado.
- [ ] Mensaje, número y aviso de privacidad coinciden con Sanity y aprobación.
- [ ] Apertura aprobada en Chrome Android y Safari iOS con ruta instalada/fallback.
- [ ] Apertura aprobada en escritorio sin romper ni perder la landing.
- [ ] CTA fijo/flotante/de error tiene nombre accesible, foco visible y no tapa controles.
- [ ] Sin número configurado, el CTA no se publica y queda otra vía válida.
- [ ] Números con menos de 10 o más de 15 dígitos tampoco publican un CTA.
- [ ] El número visible es `+52 55 1609 8584` y todos los enlaces resuelven a
  `https://wa.me/525516098584`, sin el antiguo prefijo móvil mexicano `1`.

## Privacidad, consentimiento y analítica

- [ ] En perfil limpio no hay solicitudes, scripts, cookies o almacenamiento de GTM,
  Meta o TikTok antes de consentimiento afirmativo.
- [ ] Rechazar conserva toda la funcionalidad y mantiene los píxeles sin cargar.
- [ ] Aceptar carga sólo proveedores aprobados; revocar coincide con el aviso.
- [ ] Preferencias no están premarcadas ni usan patrones que fuercen aceptación.
- [ ] Los eventos `view_landing`, `click_whatsapp`, `form_start`, `generate_lead`,
  `click_email` y `click_booking` contienen sólo datos permitidos.
- [ ] Nombre, correo, teléfono, mensaje, diagnóstico, síntomas y datos clínicos están
  ausentes de eventos, URL, storage, cookies, logs y trazas públicas.
- [ ] No están habilitadas conversiones mejoradas con datos personales o clínicos.
- [ ] UTMs no contaminan canonical y sólo se procesan conforme a consentimiento.
- [ ] `/aviso-de-privacidad` publicado es la versión legal aprobada y describe
  proveedores, finalidades y mecanismo de cambio de preferencia.

## Seguridad y Cloudflare

- [ ] Escaneo de secretos del árbol, historial entregable y artefactos sin hallazgos.
- [ ] Bundles, HTML, source maps y respuestas no contienen variables o llaves privadas.
- [ ] TLS válido, HTTPS forzado, host canónico y proxy Cloudflare comprobados.
- [ ] CSP y headers de seguridad aprobados en landing, privacidad, admin y API.
- [ ] CSP no genera bloqueos de recursos legítimos ni autoriza comodines/orígenes
  injustificados.
- [ ] Protección DDoS/WAF/bots del plan contratado está activa; sólo un modo de Bot
  Fight aplicable está habilitado.
- [ ] `/api/contact` aplica geoprotección a la lista de países aprobada y la landing no
  se bloquea por país.
- [ ] `/admin` exige Sanity, desafío y restricciones aprobadas; no es indexable.
- [ ] Rutas comunes de ataque y métodos no requeridos reciben bloqueo/desafío.
- [ ] Security Events registra pruebas sin payload personal; alertas y responsables
  están `[POR DEFINIR: responsables]`.
- [ ] Google/Bing verificados y previews sociales legítimos no quedan bloqueados.

## Rendimiento y estabilidad

| Medición candidata | Ejecución 1 | Ejecución 2 | Ejecución 3 | Mediana / estado |
| --- | --- | --- | --- | --- |
| Lighthouse Performance, consentimiento rechazado |  |  |  | ≥ 90 [ ] |
| Lighthouse Performance, consentimiento aceptado |  |  |  | ≥ 90 [ ] |
| Accessibility |  |  |  | ≥ 95 [ ] |
| Best Practices |  |  |  | ≥ 95 [ ] |
| SEO |  |  |  | ≥ 95 [ ] |
| LCP |  |  |  | ≤ 2.5 s [ ] |
| CLS |  |  |  | ≤ 0.10 [ ] |
| TBT |  |  |  | ≤ 200 ms [ ] |

- [ ] Pruebas usan contenido final, caché fría y configuración documentada.
- [ ] Imágenes usan WebP/AVIF, dimensiones, `sizes` y lazy load bajo primer viewport.
- [ ] Recurso LCP está priorizado; fuentes y scripts no bloquean innecesariamente.
- [ ] Consentimiento aceptado no introduce una regresión fuera de umbrales.
- [ ] No hay saltos visuales que desplacen CTA, campos o consentimiento.
- [ ] Seguimiento de campo a 28 días tiene fuente, responsable y fecha
  `[POR DEFINIR: fuente, responsable y fecha]` para p75 LCP/INP/CLS.

## SEO técnico

- [ ] URLs indexables responden `200`, tienen título/descripción únicos, canonical
  absoluto, `lang="es-MX"`, favicon y Open Graph.
- [ ] `robots.txt` y `sitemap.xml` son válidos, usan host canónico y sólo listan rutas
  públicas correspondientes.
- [ ] `/admin`, `/api/contact` y previews no aparecen en sitemap ni se indexan.
- [ ] JSON-LD válido usa el tipo aprobado y exclusivamente datos reales visibles.
- [ ] No hay enlaces rotos, loops, cadenas de redirección o contenido mixto.
- [ ] Imagen Open Graph es accesible y no es placeholder.
- [ ] Cloudflare permite rastreo legítimo de Google y Bing.

## Preparación operativa y rollback

- [ ] Variables de Vercel y proveedores fueron validadas sin exponer sus valores.
- [ ] Accesos mínimos de Cloudflare, Vercel, Sanity, Resend y campañas tienen
  responsables autorizados `[POR DEFINIR: nombres o roles]`.
- [ ] Monitoreo de errores, entregas de Resend, Security Events y CWV tiene responsable.
- [ ] Se documentó qué versión estable restaurar y cómo verificarla.
- [ ] Se definieron criterio y autoridad para rollback.
- [ ] Se respaldó/versionó contenido editable según la arquitectura aprobada.
- [ ] La ventana evita cambios simultáneos de DNS, aplicación, contenido y campañas.
- [ ] Se informó a responsables sin compartir secretos ni datos personales.

## Smoke test inmediatamente después de publicar

Ejecutar en orden y detener ante P0/P1:

1. [ ] Confirmar deployment ID, TLS, host canónico, ausencia de loops y versión visible.
2. [ ] Abrir `/` en perfil móvil limpio; revisar las tres secciones y consola.
3. [ ] Navegar por anclas y teclado; confirmar foco visible y CTA no obstructivo.
4. [ ] Rechazar consentimiento; comprobar en red que no cargan GTM, Meta ni TikTok.
5. [ ] Aceptar en perfil nuevo; comprobar únicamente proveedores/eventos aprobados.
6. [ ] Abrir un CTA WhatsApp en móvil y uno en escritorio; no enviar datos reales.
7. [ ] Enviar un único formulario sintético coordinado; confirmar `200`, una entrega y
   ausencia de PII en analítica/logs.
8. [ ] Forzar una validación `400` y comprobar mensaje accesible sin perder campos.
9. [ ] Abrir `/aviso-de-privacidad`, `/robots.txt` y `/sitemap.xml`; confirmar `200`,
   contenido y host canónico.
10. [ ] Verificar `/admin` sin sesión y `/api/contact` con método no permitido, sin
    intentar evadir controles.
11. [ ] Capturar headers de landing, privacidad, admin y API.
12. [ ] Revisar Vercel, Resend y Cloudflare Security Events por errores inesperados.

## Cierre o rollback

| Decisión | Datos |
| --- | --- |
| Resultado | `[POR DEFINIR: aprobar / rollback]` |
| Hora y zona horaria | `[POR DEFINIR: hora y zona]` |
| Versión finalmente activa | `[POR DEFINIR: deployment ID]` |
| Defectos/excepciones aceptados | `[POR DEFINIR: IDs o ninguno]` |
| Evidencia consolidada | `[POR DEFINIR: enlace]` |
| Aprobación producto | `[POR DEFINIR: responsable y fecha]` |
| Aprobación arquitectura | `[POR DEFINIR: responsable y fecha]` |
| Aprobación seguridad | `[POR DEFINIR: responsable y fecha]` |
| Aprobación QA | `[POR DEFINIR: responsable y fecha]` |
| Revisión a 24 h y a 28 días | `[POR DEFINIR: responsable y fecha]` |
