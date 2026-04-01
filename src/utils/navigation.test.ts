import { describe, expect, it } from "vitest";
import { sanitizeInternalRedirect } from "./navigation";

describe("sanitizeInternalRedirect", () => {
  it("acepta rutas internas validas", () => {
    expect(sanitizeInternalRedirect("/reportes?year=2026#tabla")).toBe(
      "/reportes?year=2026#tabla"
    );
  });

  it("usa el fallback cuando no recibe una ruta", () => {
    expect(sanitizeInternalRedirect(null)).toBe("/admin");
    expect(sanitizeInternalRedirect("")).toBe("/admin");
    expect(sanitizeInternalRedirect("   ")).toBe("/admin");
  });

  it("rechaza redirects externos o ambiguos", () => {
    expect(sanitizeInternalRedirect("https://evil.example")).toBe("/admin");
    expect(sanitizeInternalRedirect("//evil.example")).toBe("/admin");
    expect(sanitizeInternalRedirect("javascript:alert(1)")).toBe("/admin");
  });

  it("rechaza rutas con backslashes o saltos de linea", () => {
    expect(sanitizeInternalRedirect("/\\evil")).toBe("/admin");
    expect(sanitizeInternalRedirect("/admin\r\nLocation: /evil")).toBe("/admin");
  });
});
