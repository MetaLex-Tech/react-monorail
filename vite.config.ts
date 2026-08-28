import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";
import { defineConfig } from "vite";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  root: path.join(rootDir, "demo"),
  resolve: {
    alias: {
      "react-monorail": path.join(rootDir, "src/index.ts"),
    },
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss({ config: path.join(rootDir, "tailwind.config.ts") }),
        autoprefixer(),
      ],
    },
  },
  server: {
    port: 5173,
  },
});
