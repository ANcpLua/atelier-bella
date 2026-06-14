import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Vite 8 bundles with Rolldown, which dropped Rollup's object form of
        // `manualChunks`. The current API is `output.codeSplitting.groups`,
        // which captures vendor modules by id via a `test` pattern.
        codeSplitting: {
          groups: [
            { name: "react", test: /node_modules[\\/]react(-dom)?[\\/]/ },
            {
              name: "three",
              test: /node_modules[\\/](three|@react-three[\\/]fiber)[\\/]/,
            },
          ],
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
