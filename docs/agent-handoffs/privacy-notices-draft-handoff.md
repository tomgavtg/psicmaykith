# Entrega: borradores de avisos de privacidad

## Alcance entregado

Se creó `docs/legal/privacy-notices/` como repositorio documental dentro del Git de la
plataforma. Incluye aviso integral del sitio/contacto, aviso simplificado, aviso clínico
de psicoterapia, consentimiento sensible, inventario, fuentes y checklist.

## Decisiones

- Se separa contacto inicial de expediente/psicoterapia.
- El consentimiento de datos sensibles no sustituye el consentimiento informado del
  servicio.
- Todos los textos son `v0.1`, no publicables y conservan datos desconocidos como
  `[POR DEFINIR: ...]`.
- Se usaron fuentes oficiales vigentes consultadas el 1 de agosto de 2026.
- No se agregó PII, domicilio, cédula, honorarios, retención ni proveedor clínico
  inventado.

## Riesgos y bloqueos

La publicación requiere identidad/domicilio, canal ARCO, retención, menores,
expediente, telepsicoterapia, contratos/proveedores, transferencias, protocolo de crisis
y revisión jurídica especializada. La aplicación actual sólo tiene una aceptación
genérica del aviso; no debe presentarse como consentimiento escrito para salud.

## Archivos de aplicación no modificados

No se cargó el borrador a Sanity ni se cambió `/aviso-de-privacidad`, pues hacerlo
publicaría un texto incompleto. Esa integración debe ocurrir después de aprobar `v1.0`.
