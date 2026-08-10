# Búsqueda tradicional y descubrimiento mediante asistentes de IA

## Objetivo

Mantener las páginas públicas rastreables, verificables y fáciles de citar sin debilitar
la seguridad, autorizar entrenamiento innecesario ni publicar datos clínicos. Ninguna
configuración garantiza que Google, Bing o un asistente recomienden a la profesional.

## Rutas públicas canónicas

- `/`
- `/sobre-mi`
- `/psicoterapia-en-linea`
- `/terapia-para-adultos`
- `/terapia-para-adolescentes`
- `/terapia-de-pareja`
- `/preguntas-frecuentes`
- `/aviso-de-privacidad`

Las páginas de servicios deben obtener nombre, descripción, modalidad, duración y URL
de reserva desde Sanity. No deben crear páginas por alcaldía con contenido repetido.

## Política de rastreadores

`app/robots.js` aplica esta separación:

- Permite rastreadores de búsqueda de Google, Bing, OpenAI, Anthropic y Perplexity en
  las páginas públicas.
- Excluye `/admin` y `/api/` de todo rastreo de búsqueda.
- Bloquea `GPTBot`, `ClaudeBot` y `Google-Extended`, que no son necesarios para aparecer
  en Google Search, Bing o resultados de búsqueda de asistentes.
- Mantiene una regla general para rastreadores que no tienen una política específica.

`robots.txt` no es un control de acceso. `/admin` y `/api/` deben conservar autenticación,
validación y controles de firewall independientes. Nunca se debe permitir un bypass del
WAF sólo por el texto del `User-Agent`; si se requieren excepciones, deben verificarse
con los mecanismos oficiales del proveedor.

El proxy añade `X-Robots-Tag: noindex, nofollow, noarchive, nosnippet` y
`Cache-Control: private, no-store` a `/admin` y `/api`. Esto es defensa en profundidad;
no reemplaza la autenticación, el rate limiting ni el WAF. El canal público para reportes
de seguridad está en `/.well-known/security.txt` y su fecha `Expires` debe renovarse antes
del 10 de agosto de 2027.

## Google Search Console

1. Entrar con la cuenta profesional a Google Search Console.
2. Confirmar la propiedad de dominio `psicologamayumikitahara.com`.
3. En **Sitemaps**, enviar `https://www.psicologamayumikitahara.com/sitemap.xml`.
4. Usar **Inspección de URL** para cada ruta pública canónica.
5. Confirmar que la URL declarada por Google coincide con la canónica `www` y HTTPS.
6. Solicitar indexación después del primer despliegue; no repetir solicitudes sin cambios.
7. Revisar semanalmente **Páginas**, **Resultados de búsqueda** y **Core Web Vitals**.
8. Registrar errores, fecha y resolución sin guardar consultas que revelen datos de salud.

## Bing Webmaster Tools e IndexNow

1. Crear o abrir Bing Webmaster Tools con la cuenta responsable.
2. Importar la propiedad desde Search Console o verificar el dominio por DNS.
3. Enviar el mismo sitemap HTTPS.
4. Revisar robots, inspección de URLs y errores de rastreo.
5. Crear una clave IndexNow sólo cuando se defina quién la custodiará.
6. Guardar la clave como secreto del proveedor, nunca en Git.
7. Implementar la notificación tras publicaciones de Sanity mediante un webhook o una
   tarea controlada; no exponer un endpoint público sin autenticación.

## Autoridad y consistencia externa

1. Usar públicamente `Psic. Mayumi Kitahara` y la cédula profesional verificada.
2. Mantener iguales modalidad, servicios, teléfono, correo, dominio y enlaces de agenda
   en directorios y perfiles administrados.
3. Revisar Doctoralia y retirar ubicaciones, precios, públicos o servicios desactualizados.
4. Añadir en Sanity únicamente perfiles sociales oficiales y activos; éstos alimentan
   `sameAs` en los datos estructurados.
5. No comprar enlaces, crear reseñas, copiar testimonios ni solicitar narrativas clínicas.
6. No crear Perfil de Negocio de Google mientras la atención sea exclusivamente en línea.

## Datos estructurados

- La portada declara `WebSite`, `WebPage`, `Organization`, `Person` y `Service`.
- `/sobre-mi` declara `ProfilePage`, `Person` y `BreadcrumbList`.
- Cada servicio declara `WebPage`, `Service`, `Person` y `BreadcrumbList`.
- Preguntas frecuentes declara `FAQPage` únicamente con respuestas visibles idénticas.
- No se publican honorarios, reseñas, ratings ni dirección física en JSON-LD.

Validar después de cada cambio con Rich Results Test y Schema Markup Validator. Un dato
estructurado válido ayuda a interpretar la página, pero no garantiza un resultado
enriquecido ni una recomendación.

## Medición

- Mantener como conversiones principales `click_booking` y `click_whatsapp` según la
  estrategia aprobada en Google Ads.
- Crear en GA4 una exploración de referencias desde `chatgpt.com`, `perplexity.ai`,
  `copilot.microsoft.com` y `gemini.google.com`.
- No enviar a analítica nombre, teléfono, correo, motivo de consulta, servicio elegido,
  diagnóstico, síntomas ni información clínica.
- Evaluar resultados después de 28 días y contenido orgánico después de 8 a 12 semanas;
  no hacer cambios diarios con datos incompletos.

## Checklist después de desplegar

- [ ] Todas las rutas responden `200` sin autenticación ni challenge global.
- [ ] Canonical y metadatos coinciden con la URL pública.
- [ ] `robots.txt` contiene reglas de búsqueda y entrenamiento esperadas.
- [ ] `sitemap.xml` incluye las ocho rutas públicas.
- [ ] El HTML contiene texto útil sin depender de JavaScript del cliente.
- [ ] JSON-LD no contiene identidad legal, honorarios ni datos no aprobados.
- [ ] Search Console y Bing aceptaron el sitemap.
- [ ] El WAF no bloquea Googlebot, bingbot ni rastreadores de búsqueda verificados.

## Referencias oficiales

- [Rastreadores de OpenAI](https://developers.openai.com/api/docs/bots)
- [Rastreadores de Anthropic](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)
- [Rastreadores de Perplexity](https://docs.perplexity.ai/docs/resources/perplexity-crawlers)
- [Guía SEO de Google Search Central](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Datos estructurados en Google Search](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
