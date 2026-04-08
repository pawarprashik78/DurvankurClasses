import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Pure frontend Vite config — no backend, no mock API plugin needed.
// Mock data is served directly from client/src/lib/mockData.ts via hooks.
// When integrating with Java Spring Boot, add a proxy here:
//   server: { proxy: { "/api": "http://localhost:8080" } }

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
