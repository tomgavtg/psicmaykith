# Entrega de QA y accesibilidad — Fase 1

## Entrega

Se definieron, sin implementar ni desplegar:

- [definición de terminado](../specs/07-definition-of-done.md), con 43 criterios
  verificables y regla de aprobación;
- [plan de pruebas](../qa/test-plan.md), con matriz responsiva, casos funcionales,
  accesibilidad, privacidad, seguridad, rendimiento y SEO;
- [lista de lanzamiento](../qa/launch-checklist.md), incluidos smoke test, rollback y
  evidencias.

## Supuestos

- La conformidad objetivo es WCAG 2.2 AA y requiere validación manual además de
  escáneres.
- Chrome Android y Safari iOS se validarán en dispositivos reales; emulación es sólo
  auxiliar.
- La versión inicial no tendrá datos de Core Web Vitals de campo representativos. Se
  usa laboratorio como gate y se exige revisión p75 a los 28 días.
- Las pruebas de Cloudflare, TLS, headers y entrega real sólo son concluyentes en el
  dominio y ruta productivos.
- Los servicios externos tendrán un método aprobado de prueba o una ventana coordinada
  para no afectar tráfico, reputación de correo ni usuarios.

## Decisiones de QA

- Se fijaron viewports de referencia 320×568, 375×667, 390×844, 768×1024,
  1024×768 y 1440×900 CSS px; el ancho es normativo y la altura sólo hace reproducible
  la evidencia.
- Un release no puede aprobarse con P0/P1. Un P2 requiere aceptación, mitigación,
  responsable y fecha.
- Lighthouse se ejecuta tres veces sobre el candidato y se evalúa por mediana, sin
  ignorar hallazgos individuales que contradigan un requisito.
- Umbrales de laboratorio: Performance ≥ 90; Accessibility, Best Practices y SEO ≥ 95;
  LCP ≤ 2.5 s, CLS ≤ 0.10 y TBT ≤ 200 ms.
- Umbrales de campo al existir muestra: p75 móvil LCP ≤ 2.5 s, INP ≤ 200 ms y
  CLS ≤ 0.10.
- La evidencia debe identificar versión, ambiente, dispositivo/herramienta y
  consentimiento, y debe estar sanitizada.
- Los estados de consentimiento rechazado y aceptado tienen sus propias mediciones de
  red y rendimiento.

## Pendientes para el agente integrador

Solicito registrar o conciliar en `open-items.md`, sin que QA modifique ese archivo:

- El dominio canónico ya es `https://www.psicologamayumikitahara.com`; permanece
  `[POR DEFINIR: URL preview protegida]`.
- `[POR DEFINIR: dispositivos físicos, versiones y responsables de Chrome Android y Safari iOS]`.
- `[POR DEFINIR: buzón sintético/controlado y estrategia de prueba de Resend]`.
- `[POR DEFINIR: umbral y ventana del rate limit adicional en aplicación]`.
- `[POR DEFINIR: lista de países permitidos para /api/contact]`.
- `[POR DEFINIR: solución de consentimiento, comportamiento de revocación y texto legal aprobado]`.
- `[POR DEFINIR: responsables de QA, seguridad, monitoreo, rollback y revisión CWV a 28 días]`.
- `[POR DEFINIR: fuente de datos de campo y fecha de primera revisión]`.
- `[POR DEFINIR: herramienta de escaneo de secretos/dependencias y almacenamiento de evidencias]`.
- `[POR DEFINIR: versión o fecha de revisión de los datos de emergencia antes de publicar]`.

## Riesgos y mitigaciones

| Riesgo | Consecuencia | Mitigación requerida |
| --- | --- | --- |
| Probar sólo con emulación | fallos reales de teclado, safe areas, foco o WhatsApp | reservar Android/iOS reales antes de candidata |
| Declarar CWV de campo al lanzamiento | conclusión sin muestra representativa | separar gate de laboratorio y revisión a 28 días |
| Medir sólo sin píxeles | regresión posterior al consentimiento | repetir red y Lighthouse aceptando/rechazando |
| Ejecutar rate limit sin coordinación | afectar usuarios o reputación de IP | IP/ventana autorizadas y tráfico sintético mínimo |
| Capturas con payload o tokens | fuga de PII o secretos en evidencia | fixtures sintéticos y sanitización obligatoria |
| CSP/COOP/CORP endurecidos sin integración | Turnstile, Sanity o analítica rotos | probar headers por ruta y revisar consola/red |
| WAF/geobloqueo demasiado amplio | bloqueo de SEO, previews o usuarios legítimos | probar bots verificados, redes externas y limitar georegla al API |
| Consentimiento sólo validado visualmente | trackers disparan antes de aceptar | perfil limpio y evidencia de red/cookies/storage |
| Falta de alternativa ante proveedor caído | pérdida de conversión | probar degradación Turnstile/Resend y WhatsApp |

## Límites de esta entrega

No se ejecutaron pruebas, no se creó código, no se instalaron dependencias, no se
configuraron servicios y no se desplegó. Los estados de la lista permanecen pendientes
hasta que exista una implementación aprobada y un artefacto candidato.
