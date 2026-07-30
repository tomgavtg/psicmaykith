# Runbook de certificados HTTPS locales

## Propósito

El desarrollo normal debe usar `https://localhost:3000`. Esto evita diferencias de
esquema entre ambientes, permite probar `Secure` cookies y evita que una variable HTTP
termine por error en metadata, CORS o integraciones.

Los certificados locales nunca se deben reutilizar en producción. Vercel y Cloudflare
administran sus propios certificados públicos.

## Rutas obligatorias

Los archivos locales deben estar exactamente en:

```text
/certs/local/localhost.pem
/certs/local/localhost-key.pem
```

El repositorio ignora `/certs/`, `.env*` y todas las llaves privadas. Ningún `.pem`,
`.key`, `.p12`, `.pfx`, CA o archivo de confianza debe versionarse.

## Método recomendado

Se utiliza `mkcert` para:

1. crear una autoridad certificadora local;
2. instalar su raíz en el almacén de confianza de la estación;
3. emitir un certificado para `localhost`, `127.0.0.1` y `::1`;
4. guardar certificado y llave exactamente en las rutas anteriores.

La instalación de la CA modifica el almacén de confianza y puede requerir privilegios
administrativos. Debe ejecutarse conscientemente en cada estación; nunca se debe copiar
una CA o llave de otra persona.

No se recomienda un certificado autofirmado sin una raíz local confiable porque produce
advertencias, acostumbra a ignorarlas y no reproduce correctamente un contexto seguro.

## Instalación y generación

1. Instalar `mkcert` desde su proyecto oficial o el gestor aprobado del sistema.
2. Confirmar que el binario esperado está disponible:

   ```bash
   command -v mkcert
   ```

3. Instalar la CA local. Revisar antes el impacto en la confianza de la estación:

   ```bash
   mkcert -install
   ```

4. Desde la raíz del repositorio, generar certificado y llave:

   ```bash
   mkdir -p certs/local
   mkcert \
     -cert-file certs/local/localhost.pem \
     -key-file certs/local/localhost-key.pem \
     localhost 127.0.0.1 ::1
   chmod 600 certs/local/localhost-key.pem
   ```

5. Confirmar SAN, emisor y vigencia sin mostrar la llave:

   ```bash
   openssl x509 \
     -in certs/local/localhost.pem \
     -noout -subject -issuer -dates -ext subjectAltName
   ```

En WSL, la confianza instalada dentro de Linux no siempre se propaga al navegador de
Windows. Si el navegador sigue mostrando advertencias, se debe instalar explícitamente
la CA de `mkcert -CAROOT` en el almacén de confianza del sistema operativo donde corre
el navegador, siguiendo el procedimiento de `mkcert`. No se debe desactivar la
validación TLS.

## Uso con Next.js

`yarn dev` ya utiliza las opciones HTTPS de Next.js y las rutas anteriores:

```bash
cp .env.example .env.local
yarn dev
```

Abrir únicamente:

```text
https://localhost:3000
```

Las variables locales deben ser:

```env
NEXT_PUBLIC_SITE_URL=https://localhost:3000
ALLOWED_ORIGIN=https://localhost:3000
```

Requisitos:

- enlazar únicamente a `localhost`;
- no exponer el servidor de desarrollo a internet;
- usar llaves de prueba de Turnstile y destinatarios de prueba;
- no copiar variables de producción;
- no desactivar verificaciones TLS globales en Node.js ni en el navegador.

## Uso con Docker Compose

Development monta el certificado local y publica HTTPS sólo en loopback:

```bash
cp .env.example .env.local
docker compose up --build
```

Abrir `https://localhost:3000`.

El modo Production-like coloca Caddy delante del servidor standalone; el puerto HTTP de
Next.js sólo existe dentro de la red de Compose:

```bash
cp .env.docker.example .env.docker
docker compose --env-file .env.docker -f compose.production.yaml up --build
```

Abrir `https://localhost:3443`.

## Verificación

1. `localhost` resuelve sólo a loopback.
2. El navegador abre `https://localhost:3000` y `https://localhost:3443` sin
   advertencia cuando corresponda.
3. El certificado contiene el hostname en SAN, está vigente y encadena a la CA local.
4. La llave sólo puede leerla el usuario autorizado.
5. HTTP no queda publicado a la red local accidentalmente.
6. Sanity CORS y Turnstile aceptan únicamente el hostname de desarrollo requerido.
7. `/api/contact` rechaza orígenes diferentes al configurado.
8. Git no muestra certificados, llaves ni `.env`.
9. Una búsqueda de secretos no detecta bloques PEM en archivos versionados.
10. No existe una ruta pública HTTP para Development ni para Production-like.

## Renovación y retiro

- Los certificados locales deben ser de vida corta o renovarse según la herramienta.
- Al expirar, reemitir sólo para los hostnames necesarios.
- Al retirar una estación, eliminar la llave y el certificado locales y revocar/quitar
  la confianza de su CA conforme al procedimiento del sistema.
- Si se sospecha copia de la CA o su llave, retirar confianza y crear una CA local
  nueva; no reutilizarla.
- Eliminar una entrada de hosts sólo después de confirmar que ningún proyecto la usa.

Estas acciones afectan únicamente la estación de desarrollo y deben ejecutarse con
targets exactos, nunca con borrados recursivos amplios.

## Problemas frecuentes

| Síntoma | Comprobación segura |
| --- | --- |
| Advertencia de navegador | hostname SAN, vigencia y CA instalada en el almacén correcto |
| `Origin` rechazado | esquema, hostname y puerto exactos de `ALLOWED_ORIGIN` de desarrollo |
| Turnstile falla | site key de prueba y hostname autorizado; nunca usar secret de producción |
| Sanity bloquea Studio | CORS del proyecto para el origen local exacto, con credenciales sólo si se requieren |
| Otro dispositivo no abre | por diseño sólo se publica en loopback; no ampliar exposición sin aprobación |
| Next.js no encuentra el certificado | generar los dos archivos en `certs/local/` con los nombres exactos |
| Docker marca `web` unhealthy | confirmar que Next.js abrió el puerto 3000 y revisar el log del servicio |
| Git muestra `.pem` | detenerse, no hacer commit y pedir al integrador revisar `.gitignore` |

No se debe resolver un error usando `NODE_TLS_REJECT_UNAUTHORIZED=0`, `curl -k`,
ignorando advertencias del navegador o copiando certificados de producción.

## Referencias

- [CLI de Next.js y opciones HTTPS](https://nextjs.org/docs/pages/api-reference/cli/next)
- [mkcert](https://github.com/FiloSottile/mkcert)
