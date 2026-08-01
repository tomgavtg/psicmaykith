# Plan de pruebas

## Objetivo

Validar que la landing permita conocer la oferta y contactar de forma accesible,
privada, segura y rápida en los dispositivos objetivo. Este plan especifica pruebas;
no autoriza crear datos profesionales, configurar proveedores ni desplegar durante la
Fase 1.

## Referencias y trazabilidad

- [Brief de producto](../specs/00-product-brief.md)
- [Especificación funcional](../specs/01-functional-specification.md)
- [Definición de terminado](../specs/07-definition-of-done.md)
- [Lista de lanzamiento](launch-checklist.md)

Cada caso usa un ID estable. La ejecución debe enlazar el ID con los criterios `DOD-*`
correspondientes y con su evidencia sanitizada.

## Enfoque, ambientes y datos

Se aplican cuatro capas:

1. análisis estático y pruebas de unidad/contrato en cada cambio;
2. integración contra servicios de prueba o dobles controlados;
3. end-to-end sobre preview protegido;
4. smoke y observación sobre la versión candidata de producción.

Los datos sintéticos deben ser inequívocos, por ejemplo nombre `Prueba QA`, correo de
un buzón controlado `[POR DEFINIR: buzón de QA]` y mensajes sin contenido clínico. No
se usan datos de pacientes, de prospectos ni secretos en fixtures, capturas o reportes.
Turnstile, Resend, Sanity, Cloudflare y analítica deben usar entornos o credenciales de
prueba aprobados cuando el proveedor lo permita.

Ambientes y versiones por registrar antes de ejecutar:

| Elemento | Valor |
| --- | --- |
| URL preview | `[POR DEFINIR: URL protegida]` |
| URL candidata | `https://www.psicologamayumikitahara.com` |
| Identificador de versión | `[POR DEFINIR: commit o deployment ID]` |
| Chrome Android | versión estable vigente y dispositivo `[POR DEFINIR: modelo Android]` |
| Safari iOS | versión estable vigente y dispositivo `[POR DEFINIR: modelo iPhone]` |
| Chrome escritorio | versión estable vigente |
| Safari macOS | versión estable vigente |
| Red móvil de laboratorio | perfil Lighthouse móvil predeterminado, documentado |

Las pruebas en preview no demuestran controles exclusivos de Cloudflare o del dominio
productivo. Esos controles se repiten sobre producción con solicitudes inocuas.

## Clasificación y evidencia

| Clase | Uso | Evidencia mínima |
| --- | --- | --- |
| Automatizable (A) | contrato, regresión, escaneo y métricas repetibles | reporte con comando/configuración, versión y artefacto |
| Manual (M) | percepción, dispositivos reales, foco, lector y proveedor | captura/video o bitácora con pasos y resultado |
| Híbrida (H) | automatización más juicio o verificación externa | ambos tipos de evidencia |

Una prueba automatizada aprobada no reemplaza la validación manual de accesibilidad,
dispositivo real, copy, consentimiento o entrega de correo.

## Matriz responsiva obligatoria

Probar a zoom del navegador 100 % y repetir reflow/zoom donde se indica. Las alturas son
referencias para hacer reproducible la captura; no se debe diseñar para una altura fija.

| ID | Viewport CSS de referencia | Plataforma principal | Cobertura crítica |
| --- | --- | --- | --- |
| VP-320 | 320 × 568 | Chrome Android, emulación auxiliar | navegación compacta, textos largos, campos, Turnstile, CTA flotante, reflow |
| VP-375 | 375 × 667 | Safari iOS en dispositivo real | teclado, fuente de campos, safe areas, foco y scroll al error |
| VP-390 | 390 × 844 | Safari iOS y Chrome Android | flujo completo, preselección de servicio, WhatsApp |
| VP-768 | 768 × 1024 | tablet vertical | tarjetas, encabezado fijo, orden de foco, orientación |
| VP-1024 | 1024 × 768 | tablet horizontal/laptop | rejilla, longitudes de línea, navegación y formulario |
| VP-1440 | 1440 × 900 | escritorio | ancho máximo, equilibrio visual, foco, CTA flotante |

En cada fila se verifica: exactamente tres secciones; cero overflow horizontal; sin
texto, foco o controles ocultos; objetivos táctiles ≥ 44 × 44 CSS px; campos ≥ 16 CSS
px en móvil; imágenes sin deformación; anclas no quedan bajo el header; CTA flotante no
tapa aviso, campos, consentimiento ni footer; contenido usable en ambas orientaciones
aplicables. Chrome Android y Safari iOS deben probarse en equipo real; las herramientas
responsive sólo amplían cobertura.

## Casos de producto, navegación y responsive

| ID | Tipo | Procedimiento y resultado esperado | Evidencia |
| --- | --- | --- | --- |
| NAV-01 | A+M | Inspeccionar `/`: sólo hay Sobre mí, Servicios y Agendar; anclas y CTA llegan al destino correcto | reporte E2E y video corto |
| NAV-02 | M | Recorrer header fijo y CTA flotante en toda la matriz; no ocultan contenido o foco | capturas por viewport |
| NAV-03 | H | Activar “Solicitar información”: llega a Agendar, preselecciona el servicio sin enviar y anuncia el cambio | traza E2E y revisión con lector |
| NAV-04 | A | Visitar rutas públicas y privadas; status, indexación y métodos coinciden con la especificación | reporte HTTP |
| RWD-01 | H | Ejecutar VP-320 a VP-1440 y detectar overflow; revisar visualmente recortes y superposiciones | reporte y capturas |
| RWD-02 | M | Rotar móviles/tablet durante el flujo; se conserva el contexto y se puede continuar | video por plataforma |
| RWD-03 | M | Aumentar texto a 200 % y usar reflow a 320 CSS px; no hay pérdida ni scroll en dos ejes salvo componentes que lo requieran | capturas |
| DEG-01 | M | Deshabilitar JavaScript: contenido, avisos, anclas y WhatsApp configurado siguen operables | captura y bitácora |
| CMS-01 | H | Editar y publicar cada modelo autorizado con usuario de prueba; cambios válidos aparecen y contenido incompleto se impide u omite | video sanitizado y lista de campos |
| CMS-02 | M | Simular indisponibilidad de Sanity conforme a arquitectura; se presenta el último contenido publicado o la degradación aprobada | bitácora |

## Casos de accesibilidad

La conformidad objetivo es WCAG 2.2 AA. Se recomienda axe en E2E y Lighthouse como
apoyo; la decisión final incluye revisión manual.

| ID | Tipo | Procedimiento y resultado esperado | Evidencia |
| --- | --- | --- | --- |
| A11Y-01 | A | Ejecutar axe en `/` y `/aviso-de-privacidad`, en estado inicial, errores y éxito; cero hallazgos críticos/serios sin resolver | reporte axe |
| A11Y-02 | M | Recorrer con Tab, Shift+Tab, Enter, Espacio, flechas y Escape donde aplique; orden lógico, sin trampa y toda acción disponible | video con indicador de teclas |
| A11Y-03 | M | Revisar foco visible, contraste ≥ 3:1 y que header/CTA no lo oculten; anclas sitúan contexto visible | capturas |
| A11Y-04 | H | Comprobar jerarquía, landmarks, `lang="es-MX"`, nombres accesibles, etiquetas, instrucciones y relaciones | árbol de accesibilidad y checklist |
| A11Y-05 | M | Con VoiceOver en Safari iOS y TalkBack en Chrome Android, recorrer secciones, preselección, errores, Turnstile, éxito y alternativa WhatsApp | video/bitácora por SO |
| A11Y-06 | H | Medir contraste: texto 4.5:1, texto grande 3:1 y componentes/foco 3:1; revisar todos los estados | reporte y muestras |
| A11Y-07 | M | Activar `prefers-reduced-motion`; el movimiento no esencial desaparece o se reduce y no hay destellos | captura de ajuste y video |
| A11Y-08 | M | Zoom 200 % y 400 % donde aplique; no se bloquea zoom, contenido y mensajes siguen disponibles | capturas |
| A11Y-09 | M | Verificar objetivos táctiles ≥ 44 × 44 CSS px y separación; operar con una mano en móviles objetivo | medición y bitácora |
| A11Y-10 | H | Forzar cada error: resumen o primer error recibe contexto, mensajes son específicos y asociados, y el color no es la única señal | video y DOM sanitizado |

## Casos del formulario

La automatización del endpoint debe usar tokens/dobles de prueba y no intentar evadir
controles productivos. La verificación de entrega consulta un buzón controlado sin
exponer direcciones en el reporte.

| ID | Tipo | Escenario | Resultado esperado |
| --- | --- | --- | --- |
| FORM-01 | H | Payload mínimo válido y consentimiento marcado | `200`, una entrega, éxito accesible, limpieza y un `generate_lead` sin PII |
| FORM-02 | H | Todos los opcionales válidos y caracteres de español | se normaliza sin corrupción, una sola entrega y `replyTo` correcto |
| FORM-03 | A | Campo requerido ausente, consentimiento falso o formato inválido | `400`; mensajes útiles; sin Resend ni evento de lead |
| FORM-04 | A | Valores fuera de longitud, enum desconocido o clave adicional | `400`; lista cerrada; sin eco del payload |
| FORM-05 | A | `Content-Type` distinto del admitido | `415`; sin procesamiento |
| FORM-06 | A | Body de 10 KB exactos y de 10 KB + 1 byte, medidos como bytes | el límite aprobado pasa sólo si es válido; el exceso recibe `413` |
| FORM-07 | A | Método `GET`, `PUT`, `PATCH`, `DELETE`, `TRACE` o `CONNECT` | nunca procesa ni envía; origen y perímetro responden según política |
| FORM-08 | A | `Origin` o `Host` ausente/manipulado/no autorizado | rechazo según contrato, esperado `403`; sin correo |
| FORM-09 | H | Honeypot vacío y luego lleno | vacío no afecta; lleno se rechaza silenciosa o explícitamente según diseño, sin entrega |
| FORM-10 | H | Turnstile válido, inválido, reutilizado, vencido y no enviado | sólo el token válido y de contexto esperado permite continuar; fallos reciben `403` |
| FORM-11 | H | Texto con URL o patrón de spam documentado | se aplica la regla aprobada sin rechazar falsos positivos razonables |
| FORM-12 | H | Sexta solicitud desde una IP en 10 minutos | Cloudflare aplica Managed Challenge durante una hora; evidencia en Security Events |
| FORM-13 | H | Exceder el límite de aplicación documentado | `429`, sin correo; ventana y recuperación coinciden con arquitectura |
| FORM-14 | H | Timeout/indisponibilidad de Resend | `500/502`, mensaje neutral, conserva campos, permite reintentar y ofrece WhatsApp |
| FORM-15 | H | Turnstile indisponible o vencido durante interacción | mensaje accesible, renovación/reintento utilizable y alternativa de WhatsApp |
| FORM-16 | A | Doble clic, Enter repetido y reintento tras timeout | interfaz evita envíos concurrentes; no produce duplicados previsibles |
| FORM-17 | A | Revisar logs de cada status | sólo código, timestamp, request ID y latencia; nunca payload, PII ni token |
| FORM-18 | M | En móvil, recorrer campos | teclado correcto, `autocomplete`, fuente ≥ 16 px, no zoom forzado y CTA de envío visible |
| FORM-19 | H | `500/502` controlado y excepción no prevista | no expone stack, proveedor, variables, destinatario ni reglas internas |
| FORM-20 | H | Fecha vacía, actual, futura, inexistente y pasada | vacía/actual/futura válidas; inexistente/pasada reciben `400`; ninguna respuesta confirma cita |
| FORM-21 | M | Seleccionar servicio desde una tarjeta | formulario controlado se actualiza y el cambio se anuncia sin enviar ni guardar datos |

Para `FORM-12`, cinco solicitudes por IP durante diez minutos es el máximo perimetral
especificado. La prueba se ejecuta con una IP autorizada y ventana coordinada para no
afectar tráfico real. El límite adicional de aplicación queda
`[POR DEFINIR: umbral y ventana en arquitectura]`.

## Casos de WhatsApp y canales

| ID | Tipo | Procedimiento y resultado esperado | Evidencia |
| --- | --- | --- | --- |
| WA-01 | A | Validar todos los `href`: `https://wa.me/`, número sólo dígitos y mensaje URL-encoded | reporte de enlaces sin revelar el número en evidencia pública |
| WA-02 | M | Abrir CTA en Chrome Android con WhatsApp instalado y no instalado | abre conversación o fallback web legítimo; mensaje coincide con Sanity |
| WA-03 | M | Abrir CTA en Safari iOS y escritorio | no hay página rota, popup bloqueado inesperado ni pérdida de la landing |
| WA-04 | M | Revisar CTA fijo, flotante y de error | nombre accesible consistente, aviso de datos sensibles cercano y foco visible |
| WA-05 | M | Probar configuración sin número | CTA no se publica y siguen disponibles formulario/correo conforme a especificación |
| WA-06 | A | Probar números con menos de 10 o más de 15 dígitos | no se genera ningún enlace ni CTA roto |
| WA-07 | A | Ingresar `+52 1 56 3955 1234` como valor heredado | se normaliza a `525639551234`; el enlace no conserva el antiguo prefijo móvil `1` |
| MAIL-01 | M | Activar enlace de correo | destino y evento `click_email` son correctos, sin PII en analítica |

## Casos de privacidad, consentimiento y analítica

La evidencia de red se captura con perfil nuevo, sin extensiones, caché, cookies ni
service workers previos. Se buscan solicitudes, scripts, cookies y almacenamiento de
Google/GTM, Meta y TikTok.

| ID | Tipo | Procedimiento y resultado esperado | Evidencia |
| --- | --- | --- | --- |
| PRIV-01 | H | Abrir sesión nueva sin interactuar con consentimiento | no se cargan ni contactan GTM, Meta o TikTok ni se crean sus cookies |
| PRIV-02 | H | Rechazar | landing y contactos funcionan; píxeles permanecen ausentes |
| PRIV-03 | H | Aceptar afirmativamente | sólo entonces cargan proveedores aprobados y eventos permitidos |
| PRIV-04 | H | Cambiar/revocar preferencia y recargar | conducta coincide con aviso y configuración aprobada |
| PRIV-05 | H | Activar los cinco eventos con valores señuelo en campos | payloads no incluyen nombre, correo, teléfono, mensaje, diagnóstico ni datos clínicos |
| PRIV-06 | A | Inspeccionar URL, history, local/session storage, IndexedDB y cachés tras error/éxito | no contienen valores del formulario ni token Turnstile |
| PRIV-07 | H | Visitar con UTMs válidas y parámetros arbitrarios | canonical permanece limpio; sólo atribución aprobada se procesa tras consentimiento |
| PRIV-08 | M | Revisar checkbox y aviso | casilla inicia desmarcada, enlaza al aviso y no usa consentimiento agrupado o forzado |
| PRIV-09 | M | Revisar `/aviso-de-privacidad` | versión legal aprobada, legible, fechada y coherente con proveedores y revocación |

## Casos de seguridad y secretos

| ID | Tipo | Procedimiento y resultado esperado | Evidencia |
| --- | --- | --- | --- |
| SEC-01 | A | Escanear árbol, historial entregable y artefactos con herramienta aprobada | cero secretos; falsos positivos revisados sin copiar valores |
| SEC-02 | A | Buscar variables de servidor en bundles, HTML, source maps y respuestas | no aparecen tokens, destinatarios ni variables privadas |
| SEC-03 | H | Analizar headers en `/`, privacidad, `/admin` y respuesta API | coinciden con seguridad; CSP no tiene errores ni abre orígenes no aprobados |
| SEC-04 | H | Verificar HTTP→HTTPS, host alterno→canónico, TLS y proxy Cloudflare | una política consistente, sin loop ni contenido mixto |
| SEC-05 | H | Solicitar rutas `/wp-admin`, `/wp-login.php`, `/.env`, `/.git`, `/phpmyadmin`, `/xmlrpc.php` | bloqueo/desafío conforme a política, sin contenido filtrado |
| SEC-06 | H | Revisar `/admin` sin sesión y desde contexto no autorizado controlado | autenticación y controles Cloudflare funcionan; no es indexable |
| SEC-07 | H | Ejecutar geoprueba autorizada sobre `/api/contact` | fuera de lista permitida recibe Managed Challenge; landing pública sigue accesible |
| SEC-08 | M | Revisar Security Events tras pruebas | eventos visibles y accionables; sin payload personal |
| SEC-09 | M | Confirmar Google/Bing verificados y previews sociales | no quedan bloqueados por reglas generales |
| SEC-10 | A | Revisar dependencias cuando exista implementación | cero vulnerabilidades críticas/altas explotables o excepción aprobada con mitigación |

Validaciones mínimas de headers, subordinadas a la especificación de seguridad aprobada:
CSP efectiva y restrictiva; HSTS sólo en HTTPS productivo; `nosniff`;
`X-Frame-Options: DENY`; referrer `strict-origin-when-cross-origin`; cámara, micrófono,
geolocalización y pagos deshabilitados; COOP y CORP sin romper Turnstile, Sanity ni
recursos legítimos. `unsafe-inline`, `unsafe-eval`, comodines y hosts amplios en CSP
deben justificarse o eliminarse.

## Casos de rendimiento y Core Web Vitals

Antes de medir: usar la versión candidata, contenido e imágenes finales, consentimiento
en los estados rechazado/aceptado, caché fría, sin extensiones y sin DevTools abiertos
salvo la herramienta. Ejecutar tres veces Lighthouse móvil y reportar mediana y cada
valor.

| ID | Tipo | Procedimiento y resultado esperado | Evidencia |
| --- | --- | --- | --- |
| PERF-01 | A | Lighthouse móvil ×3 en `/` con consentimiento rechazado | mediana: Performance ≥90, A11y/Best Practices/SEO ≥95 |
| PERF-02 | A | Repetir con consentimiento aceptado | mantiene umbrales; sin regresión crítica por píxeles |
| PERF-03 | A | Revisar métricas de laboratorio | LCP ≤2.5 s, CLS ≤0.10, TBT ≤200 ms |
| PERF-04 | H | Inspeccionar waterfall en red 4G representativa | LCP priorizado; scripts de terceros diferidos; sin recursos enormes o duplicados |
| PERF-05 | A | Analizar imágenes, fuentes y JavaScript | WebP/AVIF, dimensiones/sizes, lazy load bajo fold, fuentes mínimas y sin código ocioso relevante |
| PERF-06 | M | Observar carga y cambios en todos los viewports | sin saltos que muevan CTA/campos ni interacción bloqueada |
| PERF-07 | H | Revisar datos de campo al existir muestra representativa | p75 móvil LCP ≤2.5 s, INP ≤200 ms y CLS ≤0.10 |

`PERF-07` se revisa a los 28 días del lanzamiento
`[POR DEFINIR: responsable, fuente y fecha]`; la falta inicial de datos se registra, no
se reemplaza con una afirmación de cumplimiento de campo.

## Casos de SEO técnico

| ID | Tipo | Procedimiento y resultado esperado | Evidencia |
| --- | --- | --- | --- |
| SEO-01 | A | Rastrear URLs públicas | `200`, títulos/descripciones únicos, canonical absoluto, `es-MX`, favicon y OG |
| SEO-02 | A | Validar `robots.txt` y `sitemap.xml` | host canónico, sintaxis válida, sólo URLs públicas correctas |
| SEO-03 | A | Validar JSON-LD con herramienta compatible | tipo aprobado, sin errores y todos los datos coinciden con contenido real |
| SEO-04 | H | Probar imagen y texto de preview | recurso absoluto y accesible; no expone preview ni contenido de muestra |
| SEO-05 | A | Revisar `/admin`, API y previews | `noindex` o exclusión efectiva; no aparecen en sitemap |
| SEO-06 | A | Rastrear enlaces y redirecciones | sin enlaces rotos, cadenas, loops, contenido mixto ni host duplicado |
| SEO-07 | H | Confirmar rastreo detrás de Cloudflare | Google/Bing verificados acceden; WAF no desafía sistemáticamente |
| SEO-08 | A | Probar UTMs | no cambian canonical, indexación, contenido ni estabilidad |

## Pruebas de lanzamiento y regresión

Antes de cada candidata se ejecutan todas las pruebas A de producto, formulario,
privacidad, seguridad, rendimiento y SEO; además A11Y-02 a A11Y-10, toda la matriz
responsiva y WA-02/03. Después de desplegar se ejecuta el bloque smoke de la lista de
lanzamiento con un solo lead sintético coordinado.

Detener o revertir ante: exposición de secreto o PII; envío sin consentimiento de
privacidad; píxeles antes de consentimiento; contacto principal roto; redirección/TLS
incorrectos; P0/P1; regresión AA; o fallo persistente de headers/perímetro.

## Gestión de defectos y cierre

Cada defecto registra versión, ambiente, ID de prueba, severidad, pasos, esperado,
observado, evidencia sanitizada y responsable. Un “no reproducible” requiere ambiente
y evidencia de reintento. Cerrar exige volver a ejecutar el caso original y una
regresión cercana.

El informe final resume cobertura, matriz dispositivo/navegador, defectos, excepciones,
resultados Lighthouse/CWV, accesibilidad, privacidad, seguridad, SEO y smoke. La
aprobación sigue las reglas de la definición de terminado.
