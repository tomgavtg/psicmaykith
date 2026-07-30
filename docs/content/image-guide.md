# Guía de imágenes

## Rutas locales

Sólo para placeholders, preparación y migraciones:

```text
/public/images/psychologist/portrait-placeholder.webp
/public/images/services/services-placeholder.webp
/public/images/booking/booking-placeholder.webp
```

Otros recursos iniciales se organizan en:

```text
/public/images/brand/
/public/images/psychologist/
/public/images/services/
/public/images/booking/
```

Las imágenes finales se cargan y administran desde Sanity. No se confirman placeholders
como contenido final.

## Especificaciones

| Uso | Proporción sugerida | Exportación inicial | Máximo previo a carga |
| --- | --- | --- | --- |
| retrato hero | 4:5 | 1,200 × 1,500 px | 500 KB |
| servicios/consultorio | 3:2 | 1,600 × 1,067 px | 600 KB |
| agendar | 4:3 | 1,400 × 1,050 px | 600 KB |
| Open Graph | 1.91:1 | 1,200 × 630 px | 500 KB |

Preferir AVIF o WebP con calidad visual revisada, perfil sRGB y metadatos EXIF
eliminados salvo que exista una razón editorial. Conservar el original autorizado fuera
del repositorio. Sanity almacena el activo final y Next.js genera variantes responsivas.

## Dirección y exclusiones

Fotografía auténtica, luminosa y serena de la profesional o el espacio. Evitar personas
sufriendo, cerebros, divanes vacíos, símbolos clínicos, stock ambiguo y cualquier imagen
que sugiera una población o especialidad no confirmada.

Nunca almacenar fotografías de pacientes, sesiones, documentos, pantallas con citas o
información clínica.

## Texto alternativo

Describe propósito y contenido sin interpretar emociones: “Retrato de [NOMBRE] en
[CONTEXTO RELEVANTE]”. Imágenes decorativas usan alt vacío. No repetir captions ni
rellenar palabras clave. `imageAssetMetadata` registra alt, autoría y permiso.

## Derechos y aprobación

Antes de publicar: titular de derechos, autorización escrita, alcance web/ads, fecha,
caducidad, crédito y presencia de terceros. Si existe una persona identificable distinta
de la profesional, no usar el activo sin consentimiento explícito y revisión.

## Implementación futura

`next/image` debe reservar ancho/alto o `fill` con contenedor proporcionado, declarar
`sizes`, priorizar sólo el posible LCP y usar lazy loading debajo del primer viewport.
Los dominios/paths remotos de Sanity se limitan en configuración.
