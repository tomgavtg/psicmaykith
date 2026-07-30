# Guía de coordinación

## Alcance actual

Este repositorio está en **Fase 2: desarrollo**. La persona responsable autorizó
continuar con la implementación el 30 de julio de 2026. Se permite crear componentes,
instalar dependencias y verificar la aplicación localmente. La configuración de cuentas
externas y el despliegue a producción siguen condicionados a credenciales, contenido
real, revisión legal y aprobación del checklist de lanzamiento.

La fuente de requisitos es el encargo adjunto en:
`/home/tomas/.codex/attachments/b237319a-6bc8-4d20-a26b-3fbf548a4f39/pasted-text.txt`.

## Reglas para agentes

1. Leer este archivo completo y después el encargo y las especificaciones relacionadas.
2. Trabajar sólo en los archivos asignados; no editar archivos cuyo propietario sea otro agente.
3. No inventar datos profesionales, credenciales, honorarios, testimonios, dominio ni datos de contacto.
4. Marcar valores faltantes como `[POR DEFINIR: ...]` y registrarlos en
   `docs/agent-handoffs/open-items.md` mediante el agente integrador.
5. No incluir secretos ni datos personales reales.
6. Documentar supuestos, decisiones, riesgos y entrega en un archivo propio dentro de
   `docs/agent-handoffs/`.
7. Priorizar español de México, accesibilidad WCAG 2.2 AA, privacidad por diseño,
   rendimiento móvil y conversión sin patrones invasivos.

## Propiedad histórica de archivos en Fase 1

- Producto/UX (agente integrador): `00`, `01`, `02`, `05`, `06`, `docs/content/*`,
  `README.md`, `.gitignore`, `.env.example`, `open-items.md`.
- Arquitectura: `03`, `ADR-001`, runbooks de dominio, WhatsApp, Resend y HTTPS local,
  más `technical-handoff.md`.
- Seguridad: `04`, runbook de Cloudflare Security y `security-handoff.md`.
- QA: `07`, `docs/qa/*` y `qa-handoff.md`.

El agente integrador revisa la coherencia final, pero no modifica entregas de otro agente
mientras éste siga trabajando.

## Convenciones

- Markdown en UTF-8, títulos descriptivos y enlaces relativos.
- Decisiones normativas con “debe”; recomendaciones con “conviene”.
- Todo control dependiente de plan, proveedor o revisión legal debe indicarlo.
- Rutas de producción previstas: `/`, `/admin`, `/api/contact`,
  `/aviso-de-privacidad`, `/robots.txt` y `/sitemap.xml`.
