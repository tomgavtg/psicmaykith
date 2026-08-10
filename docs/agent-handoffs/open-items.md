# Asuntos abiertos de Fase 2 antes del lanzamiento

La Fase 2 fue autorizada el 30 de julio de 2026. Ningún placeholder autoriza inventar
información ni publicar la demostración como sitio definitivo.
Los datos profesionales y operativos deben confirmarlos la psicóloga y las personas
responsables correspondientes.

## Decisiones cerradas al iniciar Fase 2

- [x] Stack fijado en `package.json`: Node 22, Next.js 16, React 19, Tailwind CSS 4,
  Yarn 1, Sanity 6, Zod 4 y Resend 6.
- [x] Sanity Studio se implementó embebido en `/admin`.
- [x] Se adoptó lectura publicada de Sanity con caché de 3,600 segundos.
- [x] Se adoptó CSP con nonce y render dinámico para las páginas HTML.
- [x] El sitio permanece en modo preview y `noindex` hasta habilitar dos controles
  explícitos de publicación.
- [x] Docker y Docker Compose se aprobaron como rutas adicionales de desarrollo y
  portabilidad; Vercel permanece como destino de Production.
- [x] La v1 solicita servicio, modalidad y tres preferencias semanales distintas de
  día/hora; no simula disponibilidad ni confirma automáticamente una cita.

## A. Preguntas para la psicóloga

- [x] Servicios corregidos en Sanity Production: Adultos, Adolescentes y Pareja están
  activos con slugs canónicos y duraciones de 50, 50 y 70 minutos.
- [x] Nombre profesional visible confirmado: “Psicóloga Mayumi Kit”. La identidad
  legal completa debe aparecer únicamente en el aviso de privacidad.
- [x] Cédula profesional confirmada y cargada en Sanity: `10630199`.
- [ ] Confirmar evidencia y texto exacto de formación, certificaciones y hasta tres
  elementos de enfoque publicables.
- [ ] ¿A qué audiencia adulta atiende, en qué ubicaciones y para qué motivos de consulta
  ofrece efectivamente sus servicios? ¿Atiende a menores?
- [x] Modalidad y honorarios confirmados: sólo en línea; adultos y adolescentes,
  `$750 MXN`; pareja, `$1,200 MXN`, todos por sesión.
- [x] Duraciones confirmadas: terapia para adultos y adolescentes, 50 minutos; terapia
  de pareja, 70 minutos.
- [x] Política comercial confirmada: cancelación sin penalización con 48 horas de
  anticipación; no se permite reprogramar por solicitud de la persona usuaria;
  cancelación tardía e inasistencia sin reembolso; si cancela la psicóloga se ofrece
  reprogramación.
- [x] Enlaces públicos de Google Calendar confirmados: Adultos y Adolescentes comparten
  el horario individual de 50 minutos; Pareja utiliza el horario de 70 minutos.
- [x] Se comprobó que el flujo de Google Calendar solicita el pago para confirmar la
  reserva.
- [ ] En ambos horarios de Google Calendar, hacer obligatorios antes del pago: nombre,
  correo, teléfono, tipo de sesión, motivo breve, aceptación del aviso y consentimiento
  expreso para datos sensibles. Probar la evidencia que conserva cada proveedor.
- [x] Número de WhatsApp Business actualizado el 10 de agosto de 2026:
  `+52 55 1609 8584`; valor técnico `525516098584`, sin el antiguo prefijo móvil
  mexicano `1`.
- [ ] Confirmar titular operativo del número y aprobar el mensaje inicial definitivo.
- [x] Se creó el buzón empresarial público
  `contacto@psicologamayumikitahara.com` en Namecheap Private Email.
- [ ] Confirmar si `contacto@psicologamayumikitahara.com` será también
  `LEADS_TO_EMAIL` y en qué plazo real se responderán las solicitudes.
- [ ] ¿Quién atiende mensajes que indiquen crisis y cuál es el protocolo operativo sin
  presentar WhatsApp o el sitio como servicio de emergencia?
- [ ] Se recibieron `PhotoMK.jpeg` y `PhotoMK1.jpeg`; confirmar que `PhotoMK1.jpeg` será
  el retrato principal y documentar titularidad, permiso, alcance y vigencia. Aprobar el
  texto alternativo propuesto en `docs/content/application-copy.md`.
- [ ] ¿Qué perfiles sociales oficiales se enlazarán?

## B. Producto, contenido y legal

- [ ] Revisar y aprobar la hoja editorial `docs/content/application-copy.md`; confirmar
  que adolescentes, adultos, parejas, atención en línea y enfoque psicoanalítico
  describen la práctica real antes de publicar.
- [ ] Elegir el título principal definitivo entre la propuesta implementada y las
  alternativas documentadas; cualquier prueba A/B debe aprobarse y medirse sin datos
  sensibles.
- [x] Crear repositorio documental con borradores separados para sitio/contacto,
  psicoterapia, aviso simplificado y consentimiento de datos sensibles.
- [x] Aviso integral del sitio `v1.0` aprobado, versionado y publicado en Sanity con
  fecha de entrada en vigor del 4 de agosto de 2026.
- [x] Identidad legal de la responsable confirmada en Sanity y reservada para el aviso
  de privacidad; no debe utilizarse como nombre público del perfil.
- [x] Canales ARCO confirmados: `contacto@psicologamayumikitahara.com` y WhatsApp
  empresarial `+52 55 1609 8584`.
- [x] Domicilio profesional aprobado e incorporado al aviso `v1.0`.
- [x] El 6 de agosto de 2026 se decidió sustituir “Mensaje” por “Motivo de consulta”,
  obligatorio, breve y limitado a 500 caracteres.
- [x] Aviso integral `v1.1` aprobado y publicado en Sanity Production el 6 de agosto de
  2026 para cubrir motivo de consulta, consentimiento expreso, Google Calendar, Stripe
  y política comercial.
- [ ] Definir cómo acreditar el consentimiento expreso del motivo de consulta sin crear
  una base de expedientes ni ampliar innecesariamente la retención.
- [ ] Definir cómo acreditar versión/aceptación del aviso sin crear una base de leads.
- [ ] Completar y aprobar los campos bloqueantes inventariados en
  `docs/legal/privacy-notices/` antes de convertir los borradores `v0.1` en `v1.0`.
- [ ] Definir retención y borrado en Resend, buzón receptor, logs y analítica; revisar
  contratos/DPA, subencargados y transferencias de todos los proveedores.
- [ ] Revisar legalmente la solución implementada: categorías separadas de analítica y
  marketing, rechazo equivalente, revocación desde el pie y vigencia de 180 días.
- [ ] Confirmar UTMs, eventos y campañas realmente aprobados; conversiones mejoradas y
  audiencias sensibles permanecen excluidas.
- [ ] Volver a verificar texto y datos de emergencia en fuente oficial inmediatamente
  antes de publicar y registrar fecha/responsable.

## C. Arquitectura y proveedores — bloqueantes de producción

- [x] Dominio y variante canónica definidos: Namecheap como registrador,
  `psicologamayumikitahara.com` como dominio y
  `https://www.psicologamayumikitahara.com` como URL canónica.
- [ ] Confirmar titular, responsables y ventana de cambio del dominio.
- [x] La aplicación se desplegó en Vercel y se obtuvieron los destinos específicos del
  proyecto para apex y `www`.
- [x] Completar la delegación hacia Cloudflare y publicar A/CNAME web, MX, SPF, DKIM,
  DMARC, SRV y CNAME de autoconfiguración; la consulta pública confirma HTTPS y
  redirección canónica.
- [x] Confirmar públicamente los nameservers asignados por Cloudflare; los valores
  completos se conservan fuera del repositorio.
- [ ] Probar recepción y envío del buzón desde webmail y desde Gmail por IMAP/SMTP.
- [ ] Decidir y probar la activación de proxy web de Cloudflare con Full (strict), sin
  afectar certificados, Vercel ni correo.
- [ ] Confirmar planes de Cloudflare, Vercel, Sanity y Resend antes de diseñar controles
  dependientes del plan.
- [ ] Resolver el rate limit solicitado: Cloudflare Business admite la ventana de diez
  minutos documentada, pero Free/Pro no; el challenge fijo de una hora tampoco está
  disponible tal como se pidió en todos los planes. Aprobar plan o desviación.
- [ ] Decidir si el límite adicional de aplicación será sólo defensa efímera de mejor
  esfuerzo o un contador distribuido atómico. La segunda opción añade proveedor,
  almacenamiento, tratamiento de IP y un ADR.
- [ ] Resolver y probar el bypass directo de `*.vercel.app`, protección de previews,
  protección de origen y fuente confiable de IP según el plan contratado.
- [x] Elegir estrategia CSP compatible con renderizado: nonce por respuesta puede
  forzar render dinámico y entrar en conflicto con SSG/ISR; evaluar hashes estáticos,
  nonce dinámico o una combinación por ruta.
- [x] Confirmar caché de 3,600 segundos; el Deploy Hook permanece por configurar cuando
  exista el proyecto Sanity.
- [ ] Confirmar dataset Sanity público/privado y necesidad de token de sólo lectura.
- [x] Confirmar Studio embebido en `/admin`.
- [x] Fijar versiones compatibles de Node.js, Next.js, React, Tailwind, Yarn y Sanity.
- [ ] Definir dominio remitente, `RESEND_FROM_EMAIL`, `LEADS_TO_EMAIL`, timeouts y buzón
  sintético de QA.
- [x] Turnstile Production: `action=contact` y hostname
  `www.psicologamayumikitahara.com`; Development usa las claves oficiales de prueba.
- [ ] Crear el widget real `contact-production`, guardar sus claves en Vercel Production
  y definir un widget/hostname separado cuando exista la URL estable de Preview.
- [x] HTTPS local obligatorio en `https://localhost:3000`, con certificado `mkcert`
  individual por estación; Production-like usa `https://localhost:3443`.
- [ ] Definir HSTS, CAA, allowlist administrativa, MFA, recuperación y rotación.

## D. Marketing y operación

- [ ] Confirmar cuentas e IDs de GTM, Google Ads, Meta y TikTok, si se usarán.
- [x] Implementar carga condicional de GTM, Meta y TikTok, Consent Mode v2, eventos con
  lista permitida y atribución UTM sin `utm_term`, servicio ni datos del formulario.
- [ ] Configurar IDs reales por ambiente, crear GA4/conversiones, probar con Tag
  Assistant/Pixel Helpers y publicar los contenedores aprobados.
- [ ] Designar responsables y suplentes de contenido, leads, DNS, seguridad,
  privacidad, analítica, QA, lanzamiento y rollback.
- [ ] Definir matriz de campañas, objetivos numéricos y método de calificación de leads
  fuera de la analítica web.
- [ ] Definir almacenamiento de evidencias sanitizadas y herramienta de escaneo de
  secretos/dependencias.

## E. QA antes del lanzamiento

- [ ] Reservar modelos/versiones reales para Chrome Android y Safari iOS y asignar
  responsables.
- [ ] Definir dominio candidato y URL Preview protegida.
- [ ] Acordar ventana segura para probar Turnstile, Resend, rate limits y WAF.
- [ ] Asignar fuente/responsable para Core Web Vitals de campo y revisión a 28 días.
- [ ] Completar toda la evidencia y los checks de `docs/qa/launch-checklist.md`.
