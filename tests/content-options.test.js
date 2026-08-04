import { describe, expect, it } from "vitest";
import { EMPTY_OPTIONS, safeOptions } from "../lib/content/options";

describe("safeOptions", () => {
  it("conserva arreglos válidos", () => {
    const options = ["En línea"];
    expect(safeOptions(options)).toBe(options);
  });

  it("normaliza valores indefinidos o nulos", () => {
    expect(safeOptions(undefined)).toBe(EMPTY_OPTIONS);
    expect(safeOptions(null)).toBe(EMPTY_OPTIONS);
    expect(() => safeOptions(undefined).map(String)).not.toThrow();
  });
});
