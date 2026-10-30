import { shareSchema, type SharedPortfolio } from "@/features/practice/model";

export function encodePortfolio(portfolio: SharedPortfolio) {
  const safe = shareSchema.parse(portfolio);
  const bytes = new TextEncoder().encode(JSON.stringify(safe));
  if (bytes.length > 15000)
    throw new Error(
      "El portafolio es demasiado extenso para un enlace. Descarga el reporte o reduce el texto.",
    );
  const encoded = btoa(String.fromCharCode(...bytes))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replace(/=+$/, "");
  if (encoded.length > 20000)
    throw new Error(
      "El portafolio es demasiado extenso para un enlace. Descarga el reporte o reduce el texto.",
    );
  return encoded;
}
export function decodePortfolio(encoded: string): SharedPortfolio | null {
  if (!encoded || encoded.length > 20000 || !/^[A-Za-z0-9_-]+$/.test(encoded)) return null;
  try {
    const decoded = atob(encoded.replaceAll("-", "+").replaceAll("_", "/"));
    const json = new TextDecoder("utf-8", { fatal: true }).decode(
      Uint8Array.from(decoded, (char) => char.charCodeAt(0)),
    );
    if (!json || json.length > 160000) return null;
    const result = shareSchema.safeParse(JSON.parse(json));
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}
