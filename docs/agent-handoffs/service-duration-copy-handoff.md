# Entrega de duraciones y retiro de placeholders visibles

## Alcance

Se configuraron las duraciones confirmadas: 50 minutos para terapia de adultos, 50
minutos para terapia de adolescentes y 70 minutos para terapia de pareja. La interfaz
muestra 70 minutos como “1 h 10 min”.

## Decisiones

- Las duraciones se aplican por `slug` cuando un servicio antiguo de Sanity no contiene
  el dato; un valor explícito posterior en Sanity conserva prioridad.
- Los valores con la marca interna `[POR DEFINIR]` se normalizan a texto vacío antes de
  renderizar perfil, disponibilidad, tiempo de respuesta y responsable de privacidad.
- Cuando un dato opcional no existe, la interfaz omite el campo en lugar de mostrar un
  placeholder o inventar información.

## Riesgos y pendientes

- Conviene guardar también 50, 50 y 70 en los documentos correspondientes de Sanity
  para que el CMS refleje la misma fuente editorial.
- Honorarios, disponibilidad y plazo de respuesta siguen pendientes, pero ya no se
  muestran como campos incompletos en el sitio.
- Los pendientes continúan registrados en documentación interna para no perder su
  seguimiento antes del lanzamiento.
