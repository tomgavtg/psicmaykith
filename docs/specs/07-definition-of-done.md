# Definición de terminado

## Propósito y alcance

Este documento define las condiciones mínimas, verificables y acumulativas para
autorizar una salida a producción. No sustituye la aprobación explícita de la Fase 1
ni autoriza implementar, configurar proveedores o desplegar.

La evidencia se obtiene conforme al [plan de pruebas](../qa/test-plan.md) y se registra
en la [lista de lanzamiento](../qa/launch-checklist.md). “Cumple” significa que existe
evidencia reproducible sobre el mismo artefacto candidato que se pretende publicar.

## Regla de aprobación

Una versión está terminada únicamente cuando:

- todos los criterios `DOD-*` están en estado **Cumple** o **No aplica** con
  justificación;
- no existen defectos P0 ni P1 abiertos;
- los defectos P2 tienen aceptación explícita, responsable, mitigación y fecha;
- QA, producto, arquitectura y seguridad aprobaron el mismo identificador de versión;
- los valores profesionales, legales, de contacto, dominio, proveedores y campañas
  dejaron de ser placeholders y fueron validados por su responsable;
- el rollback y los contactos de respuesta están definidos y ensayados.

Severidad:

| Nivel | Significado | Regla de salida |
| --- | --- | --- |
| P0 | Riesgo inmediato para personas, privacidad, seguridad o disponibilidad total | bloquea |
| P1 | Conversión principal rota, incumplimiento AA, fuga de datos o control crítico ausente | bloquea |
| P2 | Degradación relevante con alternativa utilizable | requiere aceptación explícita |
| P3 | Defecto menor, cosmético o documental | puede programarse |

## Evidencia mínima

Cada ejecución debe registrar: ID de prueba, fecha y zona horaria, ambiente y URL,
identificador de versión, navegador/dispositivo o herramienta y versión, condición de
consentimiento, resultado esperado/observado, estado, responsable y enlace al artefacto.
Las capturas deben omitir o redactar datos personales, tokens, cookies y secretos.

Son evidencias válidas los reportes exportados de pruebas, axe, Lighthouse, análisis de
headers, trazas de red sanitizadas, capturas o video de pruebas manuales y eventos de
proveedor sin payload personal. Una afirmación sin artefacto no cuenta como aprobación.

## Criterios de producto, contenido y rutas

- **DOD-01 — Alcance:** `/` muestra exactamente Sobre mí, Servicios y Agendar; no
  incorpora blog, carrusel, pop-up invasivo, testimonios, contadores ni promesas de
  resultados.
- **DOD-02 — Rutas:** `/`, `/aviso-de-privacidad`, `/admin`, `/api/contact`,
  `/robots.txt` y `/sitemap.xml` responden conforme a la especificación funcional. No
  se indexan `/admin` ni `/api/contact`.
- **DOD-03 — Contenido real:** nombre, credenciales, servicios, honorarios, horarios,
  contacto, imágenes y afirmaciones publicadas fueron comprobados y aprobados. No hay
  `[POR DEFINIR: ...]`, contenido de muestra ni secretos visibles.
- **DOD-04 — Contenido seguro:** ningún formulario o copy solicita diagnóstico,
  síntomas detallados, historial clínico o fotografías de pacientes. Los avisos de
  privacidad, datos sensibles y crisis aparecen en el contexto definido.
- **DOD-05 — Gestión:** una persona autorizada puede editar y publicar los campos
  previstos desde Sanity; los campos obligatorios, vistas previas, textos alternativos
  y reglas contra contenido incompleto funcionan. `/admin` exige autenticación.

## Criterios responsivos y de interacción

- **DOD-06 — Matriz responsiva:** se aprueban 320, 375, 390, 768, 1024 y 1440 px según
  la matriz del plan, sin scroll horizontal a zoom 100 %, superposición, recorte de
  contenido ni pérdida de funcionalidad.
- **DOD-07 — Dispositivos objetivo:** los flujos críticos se aprueban en Chrome para
  Android y Safari para iOS sobre dispositivo real. Emulación puede complementar, no
  sustituir, esas ejecuciones.
- **DOD-08 — Táctil y formularios:** controles táctiles miden al menos 44 × 44 CSS px;
  los campos usan fuente de 16 CSS px o más, `autocomplete`, tipo y teclado apropiados.
- **DOD-09 — Orientación y zoom:** la interfaz sigue utilizable en vertical y
  horizontal, con zoom de texto al 200 % y reflow a 320 CSS px; no bloquea zoom.
- **DOD-10 — Degradación:** sin JavaScript se leen el contenido, avisos y enlaces
  ancla y continúa disponible WhatsApp cuando está configurado. Si Turnstile o Resend
  falla, los datos introducidos se conservan sólo en la interfaz sin persistirlos, se
  explica el error sin filtrar detalles y se ofrece WhatsApp.

## Criterios de accesibilidad WCAG 2.2 AA

- **DOD-11 — Semántica:** idioma `es-MX`, regiones, encabezados, listas, controles,
  nombres, estados y relaciones son discernibles por tecnologías de asistencia.
- **DOD-12 — Teclado:** todo el flujo funciona sólo con teclado, el orden es lógico, no
  hay trampas y el foco visible no queda oculto por el encabezado o CTA flotante.
- **DOD-13 — Foco y cambios:** saltos por ancla, errores, éxito y preselección de
  servicio mueven o anuncian el contexto de manera predecible, sin provocar envíos.
- **DOD-14 — Contraste:** texto normal alcanza 4.5:1, texto grande 3:1 y componentes,
  indicadores de foco y estados 3:1 contra colores adyacentes. La información no
  depende sólo del color.
- **DOD-15 — Movimiento:** con `prefers-reduced-motion: reduce` se elimina o reduce el
  movimiento no esencial; no hay destellos, video de fondo ni animaciones que impidan
  operar.
- **DOD-16 — Validación AA:** no quedan violaciones conocidas de WCAG 2.2 nivel A o AA.
  El escaneo automatizado debe reportar cero hallazgos críticos o serios, y la
  revisión manual debe cubrir teclado, foco, reflow, zoom, contraste y anuncios.

## Criterios de contacto

- **DOD-17 — WhatsApp:** todos los CTA publicados usan el número internacional
  configurado sin `+`, espacios ni guiones y un mensaje correctamente codificado; se
  prueban apertura móvil, escritorio, nombre accesible y el aviso de privacidad.
- **DOD-18 — Formulario válido:** un envío válido produce una sola entrega por Resend,
  usa `RESEND_FROM_EMAIL` como remitente y el correo capturado sólo como `replyTo`;
  muestra éxito, limpia los campos y emite una sola vez `generate_lead` sin PII.
- **DOD-19 — Validación:** cliente y servidor cubren campos requeridos, formatos,
  límites y lista cerrada de valores. Los errores se asocian al campo, se anuncian y no
  borran entradas. La casilla de privacidad inicia desmarcada.
- **DOD-20 — Protección:** se verifican honeypot, Turnstile válido/inválido/vencido,
  body mayor a 10 KB, tipo no admitido, claves inesperadas, `Origin`/`Host` ajenos,
  contenido automatizado y límites de frecuencia en aplicación y Cloudflare.
- **DOD-21 — Contrato HTTP:** sólo `POST` procesa leads y se comprueban los resultados
  previstos `200`, `400`, `403`, `413`, `415`, `429` y `500/502`. La respuesta pública
  no revela stack, proveedor, reglas, tokens ni existencia de direcciones.
- **DOD-22 — Minimización:** no se persisten leads ni aparecen nombre, correo, teléfono,
  mensaje o token Turnstile en logs, analítica, URL, almacenamiento del navegador,
  trazas públicas o mensajes de error.

## Criterios de privacidad, analítica y campañas

- **DOD-23 — Aviso:** `/aviso-de-privacidad` contiene la versión aprobada mediante
  revisión legal aplicable en México, fecha o versión y medio de contacto válidos.
- **DOD-24 — Consentimiento:** en una sesión nueva GTM, Meta Pixel y TikTok Pixel no
  descargan scripts, crean cookies ni envían solicitudes antes de una acción afirmativa.
  Rechazar debe ser tan operable como aceptar y no impide usar la landing o contactar.
- **DOD-25 — Revocación:** la preferencia se puede cambiar; la conducta posterior y el
  tratamiento de identificadores existentes coinciden con el aviso y la solución de
  consentimiento aprobada.
- **DOD-26 — Datos de eventos:** `view_landing`, `click_whatsapp`, `form_start`,
  `generate_lead` y `click_email` no incluyen nombre, correo, teléfono, texto libre,
  diagnóstico, síntomas ni otros datos clínicos. No se habilitan conversiones
  mejoradas con estos datos.
- **DOD-27 — Atribución:** UTMs válidas no rompen la interfaz ni el canonical y, con
  consentimiento, se atribuyen según el diseño aprobado sin introducir datos de campos
  o parámetros arbitrarios en eventos.

## Criterios de seguridad

- **DOD-28 — Secretos:** repositorio, historial entregable, artefactos, source maps,
  HTML, JavaScript, logs y respuestas no contienen llaves privadas, tokens ni valores
  de servidor. Sólo las variables `NEXT_PUBLIC_*` expresamente públicas llegan al
  cliente.
- **DOD-29 — Headers:** producción aprueba CSP efectiva y los headers HSTS,
  `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
  `Permissions-Policy`, `Cross-Origin-Opener-Policy` y
  `Cross-Origin-Resource-Policy` definidos por seguridad; no hay directivas
  contradictorias ni recursos necesarios bloqueados.
- **DOD-30 — Perímetro:** HTTPS y redirección canónica son consistentes; Cloudflare
  permanece como proxy; se verifican WAF, protección bot, métodos no usados, rutas
  comunes de ataque, protección de `/admin`, geoprotección y rate limit de
  `/api/contact` conforme al plan contratado y a la especificación aprobada.
- **DOD-31 — Observación segura:** Security Events muestra las pruebas de desafío o
  bloqueo y permite investigar sin exponer payload personal. Google y Bing verificados
  y previews legítimos no quedan bloqueados.

## Criterios de rendimiento y estabilidad visual

- **DOD-32 — Lighthouse:** en la URL candidata de producción, la mediana de tres
  ejecuciones móviles con configuración documentada alcanza Performance ≥ 90,
  Accessibility ≥ 95, Best Practices ≥ 95 y SEO ≥ 95; ningún hallazgo contradice un
  criterio explícito aunque el puntaje global sea suficiente.
- **DOD-33 — Core Web Vitals de laboratorio:** en esas ejecuciones LCP ≤ 2.5 s,
  CLS ≤ 0.10 y TBT ≤ 200 ms como aproximación de interactividad. No se acepta una
  regresión causada por consentimiento, imágenes o fuentes.
- **DOD-34 — Core Web Vitals de campo:** cuando exista una ventana representativa,
  el percentil 75 por origen y por móvil debe ser LCP ≤ 2.5 s, INP ≤ 200 ms y
  CLS ≤ 0.10. La ausencia de datos al lanzar no bloquea por sí sola, pero exige
  responsable, medición y revisión a los 28 días `[POR DEFINIR: responsable y fecha]`.
- **DOD-35 — Recursos:** imágenes finales tienen autorización, dimensiones,
  `sizes`, texto alternativo o tratamiento decorativo correctos, WebP/AVIF y carga
  diferida bajo el primer viewport. No hay video de fondo, fuentes excesivas ni
  dependencias sin uso.

## Criterios de SEO técnico

- **DOD-36 — Metadatos:** cada URL indexable tiene título, descripción, canonical
  absoluto, `lang="es-MX"`, favicon y Open Graph con contenido real y una imagen
  accesible públicamente.
- **DOD-37 — Rastreo:** `robots.txt` y `sitemap.xml` usan el dominio canónico, sólo
  incluyen URLs públicas adecuadas, responden `200` y no bloquean recursos necesarios.
- **DOD-38 — Datos estructurados:** JSON-LD válido usa `LocalBusiness` o
  `ProfessionalService` sólo con datos comprobados; coincide con el contenido visible
  y no incluye reseñas, valoraciones, especialidades o ubicación inventadas.
- **DOD-39 — Calidad técnica:** no hay enlaces rotos, cadenas de redirección,
  duplicados canónicos, errores de consola relevantes ni indexación accidental del
  ambiente de preview.

## Criterios de lanzamiento y operación

- **DOD-40 — Configuración:** variables y valores de Sanity, Resend, Turnstile,
  Cloudflare, Vercel y analítica fueron validados en producción sin copiar secretos a
  evidencia.
- **DOD-41 — Smoke test:** inmediatamente después de publicar se ejecutan navegación,
  WhatsApp, formulario controlado, privacidad, consentimiento, headers, canonical,
  robots y sitemap; no se usan datos personales reales.
- **DOD-42 — Operación:** responsables y acceso para Vercel, Cloudflare, Sanity,
  Resend, campañas e incidentes están `[POR DEFINIR: responsables autorizados]`; el
  rollback se ensaya o documenta con un objetivo verificable.
- **DOD-43 — Cierre:** la lista de lanzamiento está firmada con fecha, versión y
  evidencia; se registran defectos aceptados y fecha de seguimiento sin declarar
  “terminado” por silencio o falta de datos.
