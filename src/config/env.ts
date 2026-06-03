const asTrimmed = (value: unknown, fallback: string): string => {
  if (typeof value !== "string") {
    return fallback;
  }
  const trimmed = value.trim();
  return trimmed || fallback;
};

const DEFAULT_API_BASE_URL = "https://events.dinenation.com/ai";

/**
 * API origin:
 * - Non-empty `VITE_API_BASE_URL`: browser calls this URL directly (CORS applies in dev).
 * - Dev + unset: empty string → same-origin `/…` so Vite `server.proxy` forwards to the real API (no browser CORS).
 * - Production + unset: default hosted API URL.
 */
const apiBaseUrl = (): string => {
  const raw = import.meta.env.VITE_API_BASE_URL;
  if (typeof raw === "string" && raw.trim() !== "") {
    return raw.trim().replace(/\/$/, "");
  }
  if (import.meta.env.DEV) {
    return "";
  }
  return DEFAULT_API_BASE_URL;
};

const asPositiveInt = (value: unknown, fallback: number): number => {
  if (typeof value !== "string" || !value.trim()) {
    return fallback;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
};

export const ENV = {
  apiBaseUrl: apiBaseUrl(),
  analyzeImageEndpoint: asTrimmed(import.meta.env.VITE_ANALYZE_IMAGE_ENDPOINT, "/analyze-image"),
  maxImages: asPositiveInt(import.meta.env.VITE_MAX_IMAGES, 10),
  downloadFilename: asTrimmed(import.meta.env.VITE_DOWNLOAD_FILENAME, "tasteframe-enhanced.zip"),
  supportUrl: asTrimmed(import.meta.env.VITE_SUPPORT_URL, "https://flashcores.app/support"),
  termsUrl: asTrimmed(import.meta.env.VITE_TERMS_URL, "https://flashcores.app"),
  privacyUrl: asTrimmed(import.meta.env.VITE_PRIVACY_URL, "https://flashcores.app")
};
