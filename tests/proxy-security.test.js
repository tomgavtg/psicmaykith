import { describe, expect, it } from "vitest";
import { contentSecurityPolicy, isTagAssistantPreview } from "../proxy";

describe("Content Security Policy", () => {
  it("permite el CDN de módulos de Sanity sólo en el Studio", () => {
    const adminPolicy = contentSecurityPolicy("nonce", true, true);
    const publicPolicy = contentSecurityPolicy("nonce", false, true);

    expect(adminPolicy).toContain("https://sanity-cdn.com");
    expect(adminPolicy).toContain("https://*.sanity-cdn.com");
    expect(publicPolicy).not.toContain("sanity-cdn.com");
  });

  it("permite los recursos oficiales requeridos por GTM Preview", () => {
    const policy = contentSecurityPolicy("nonce", false, false);

    expect(policy).toContain("https://tagmanager.google.com");
    expect(policy).toContain("https://www.googletagmanager.com");
    expect(policy).toContain("https://fonts.googleapis.com");
    expect(policy).toContain("https://fonts.gstatic.com");
    expect(policy).toContain("https://ssl.gstatic.com");
    expect(policy).toContain("https://www.gstatic.com");
  });

  it("permite el endpoint activo de recopilación de GA4", () => {
    const policy = contentSecurityPolicy("nonce", false, false);
    const connectDirective = policy
      .split("; ")
      .find((directive) => directive.startsWith("connect-src "));

    expect(connectDirective?.split(" ")).toContain(
      "https://analytics.google.com",
    );
  });

  it("identifica únicamente señales reconocidas de Tag Assistant", () => {
    expect(isTagAssistantPreview(new URLSearchParams("_dbg=1"))).toBe(true);
    expect(
      isTagAssistantPreview(new URLSearchParams("gtm_preview=env-2")),
    ).toBe(true);
    expect(isTagAssistantPreview(new URLSearchParams("utm_source=google"))).toBe(
      false,
    );
  });
});
