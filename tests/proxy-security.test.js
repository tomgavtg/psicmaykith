import { describe, expect, it } from "vitest";
import { contentSecurityPolicy } from "../proxy";

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
});
