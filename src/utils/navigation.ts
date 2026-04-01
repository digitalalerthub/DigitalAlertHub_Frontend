export const sanitizeInternalRedirect = (
  value: string | null | undefined,
  fallback = "/admin"
): string => {
  if (typeof value !== "string") return fallback;

  const trimmedValue = value.trim();
  if (!trimmedValue) return fallback;

  // Solo permitimos rutas absolutas internas del SPA.
  if (!trimmedValue.startsWith("/")) return fallback;
  if (trimmedValue.startsWith("//")) return fallback;
  if (trimmedValue.includes("\\")) return fallback;
  if (/[\r\n]/.test(trimmedValue)) return fallback;

  return trimmedValue;
};
