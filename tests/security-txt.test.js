import { describe, expect, it } from "vitest";
import { GET } from "../app/.well-known/security.txt/route";

describe("security.txt", () => {
  it("publica un canal de reporte canónico y vigente", async () => {
    const response = GET();
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/plain");
    expect(body).toContain(
      "Contact: mailto:contacto@psicologamayumikitahara.com",
    );
    expect(body).toContain(
      "Canonical: https://www.psicologamayumikitahara.com/.well-known/security.txt",
    );
    expect(new Date("2027-08-10T00:00:00.000Z").getTime()).toBeGreaterThan(
      Date.now(),
    );
  });
});
