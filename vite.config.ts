import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

/** Must match default in `src/config/env.ts` when `VITE_API_BASE_URL` is unset. */
const DEFAULT_API_BASE_URL = "https://events.dinenation.com/ai";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const target = (env.VITE_API_BASE_URL?.trim() || DEFAULT_API_BASE_URL).replace(/\/$/, "");
  const endpointRaw = (env.VITE_ANALYZE_IMAGE_ENDPOINT || "/analyze-image").trim() || "/analyze-image";
  const proxyPath = endpointRaw.startsWith("/") ? endpointRaw : `/${endpointRaw}`;

  return {
    plugins: [react()],
    server: {
      proxy: {
        [proxyPath]: {
          target,
          changeOrigin: true,
          secure: true
        }
      }
    }
  };
});
