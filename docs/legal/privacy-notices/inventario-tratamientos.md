# Inventario de tratamientos y decisiones pendientes

> Estado: borrador operativo. Validar contra contratos y paneles reales antes de
> aprobar los avisos.

| Sistema/canal | Datos previstos | Función | Persistencia/ubicación | Estado |
| --- | --- | --- | --- | --- |
| Navegador | preferencia de analítica | recordar elección | `localStorage`; plazo `[POR DEFINIR]` | implementado |
| Formulario Next.js | datos de contacto y preferencias | validar y enviar | transitorio; sin base propia | implementado, envío externo pendiente |
| Cloudflare | IP, red, Turnstile, seguridad | DNS/WAF/antiabuso | `[POR DEFINIR: plan y retención]` | proveedor activo; controles por confirmar |
| Vercel | IP/metadatos/logs de función | alojamiento y operación | `[POR DEFINIR: plan/región/retención]` | activo |
| Resend | mensaje del lead y metadatos de entrega | transportar correo | `[POR DEFINIR: cuenta, región y retención]` | integración en código; producción pendiente |
| Namecheap Private Email | correo completo del lead | buzón receptor | `[POR DEFINIR: retención, respaldos y dispositivos]` | buzón creado |
| Sanity | contenido público/editorial | CMS | dataset `production`; no leads | configurado por confirmar mediante QA |
| WhatsApp/Meta | número, perfil y conversación voluntaria | contacto externo | según cuenta y políticas del proveedor | número confirmado |
| Google/Meta/TikTok | identificadores/eventos sin PII | analítica/publicidad consentida | `[POR DEFINIR]` | no aprobar hasta revisión |
| Expediente clínico | salud, evaluación, notas, consentimientos | psicoterapia | sistema, ubicación y plazo `[POR DEFINIR]` | fuera del sitio; bloqueante |
| Videoconferencia | audio/video y metadatos de sesión | telepsicoterapia | proveedor y política `[POR DEFINIR]` | bloqueante si hay servicio en línea |
| Facturación/pagos | datos fiscales/operación | cobro y comprobantes | proveedor/plazo `[POR DEFINIR]` | alcance por confirmar |

## Decisiones bloqueantes

- identidad y domicilio legal de la responsable;
- canal formal y responsable de solicitudes ARCO;
- atención o exclusión de menores y protocolo de representación;
- retención/borrado de solicitudes en Resend, buzón y dispositivos sincronizados;
- expediente clínico, respaldo, acceso y eliminación;
- plataforma y protocolo de telepsicoterapia;
- mecanismo de consentimiento expreso para datos sensibles;
- transferencias y proveedores que actúan como encargados;
- servicios, plazos y regiones contratadas de cada proveedor;
- cookies/analítica realmente activas;
- protocolo de crisis, confidencialidad e incidentes;
- evidencia de versión del aviso entregada/aceptada sin guardar PII en analítica.
