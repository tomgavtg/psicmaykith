const SECURITY_CONTACT = "mailto:contacto@psicologamayumikitahara.com";
const SECURITY_TXT_URL =
  "https://www.psicologamayumikitahara.com/.well-known/security.txt";
const SECURITY_TXT_EXPIRES = "2027-08-10T00:00:00.000Z";

export function GET() {
  const body = [
    `Contact: ${SECURITY_CONTACT}`,
    `Expires: ${SECURITY_TXT_EXPIRES}`,
    `Canonical: ${SECURITY_TXT_URL}`,
    "Preferred-Languages: es",
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
