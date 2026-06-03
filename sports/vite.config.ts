import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// In dev we proxy `/statsapi` to the MLB Stats API. This sidesteps any CORS
// issues during local development. In production the client talks to the API
// directly (the MLB Stats API responds with permissive CORS headers for GET).
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/statsapi": {
        target: "https://statsapi.mlb.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/statsapi/, ""),
      },
    },
  },
});
