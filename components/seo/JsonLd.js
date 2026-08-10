import { headers } from "next/headers";

export async function JsonLd({ data }) {
  if (!data) return null;

  const nonce = (await headers()).get("x-nonce") || undefined;

  return (
    <script
      nonce={nonce}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replaceAll("<", "\\u003c"),
      }}
    />
  );
}
