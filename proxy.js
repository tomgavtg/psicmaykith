import { NextResponse } from "next/server";

export function contentSecurityPolicy(nonce, isAdmin, isDevelopment) {
  const scriptSources = [
    "'self'",
    `'nonce-${nonce}'`,
    "'strict-dynamic'",
    "https://challenges.cloudflare.com",
    "https://www.googletagmanager.com",
    "https://tagmanager.google.com",
    "https://connect.facebook.net",
    "https://analytics.tiktok.com",
  ];

  if (isDevelopment) {
    scriptSources.push("'unsafe-eval'");
  }

  if (isAdmin) {
    scriptSources.push("https://*.sanity.io");
  }

  const connectSources = [
    "'self'",
    "https://*.sanity.io",
    "wss://*.sanity.io",
    "https://challenges.cloudflare.com",
    "https://www.google-analytics.com",
    "https://region1.google-analytics.com",
    "https://*.google-analytics.com",
    "https://analytics.google.com",
    "https://*.analytics.google.com",
    "https://www.googletagmanager.com",
    "https://www.googleadservices.com",
    "https://*.doubleclick.net",
    "https://www.facebook.com",
    "https://connect.facebook.net",
    "https://analytics.tiktok.com",
    "https://*.tiktok.com",
  ];

  if (isAdmin) {
    // Sanity Studio consulta su CDN de módulos para comprobar actualizaciones.
    // Se limita a /admin para no ampliar la política del sitio público.
    connectSources.push(
      "https://sanity-cdn.com",
      "https://*.sanity-cdn.com",
    );
  }

  const directives = [
    "default-src 'self'",
    `script-src ${scriptSources.join(" ")}`,
    "style-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://tagmanager.google.com https://fonts.googleapis.com",
    "img-src 'self' data: blob: https://cdn.sanity.io https://www.googletagmanager.com https://ssl.gstatic.com https://www.gstatic.com https://www.google-analytics.com https://*.google-analytics.com https://www.googleadservices.com https://*.doubleclick.net https://www.facebook.com https://analytics.tiktok.com https://*.tiktok.com",
    "font-src 'self' data: https://fonts.gstatic.com",
    `connect-src ${connectSources.join(" ")}`,
    "frame-src https://challenges.cloudflare.com https://www.googletagmanager.com",
    "worker-src 'self' blob:",
    "media-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ];

  if (!isDevelopment) {
    directives.push("upgrade-insecure-requests");
  }

  return directives.join("; ");
}

export function isTagAssistantPreview(searchParams) {
  return ["_dbg", "gtm_debug", "gtm_preview", "gtm_auth"].some((parameter) =>
    searchParams.has(parameter),
  );
}

export function proxy(request) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const isAdmin = request.nextUrl.pathname.startsWith("/admin");
  const csp = contentSecurityPolicy(
    nonce,
    isAdmin,
    process.env.NODE_ENV === "development",
  );
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  response.headers.set("Content-Security-Policy", csp);
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains",
  );
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set(
    "Referrer-Policy",
    "strict-origin-when-cross-origin",
  );
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=()",
  );
  response.headers.set(
    "Cross-Origin-Opener-Policy",
    isTagAssistantPreview(request.nextUrl.searchParams)
      ? "unsafe-none"
      : "same-origin",
  );
  response.headers.set("Cross-Origin-Resource-Policy", "same-site");

  return response;
}

export const config = {
  matcher: [
    {
      source:
        "/((?!_next/static|_next/image|favicon.ico|icon.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif)$).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
