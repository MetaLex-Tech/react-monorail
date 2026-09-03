import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Config } from "tailwindcss";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

const config: Config = {
  content: [
    path.join(rootDir, "demo/index.html"),
    path.join(rootDir, "demo/**/*.tsx"),
    path.join(rootDir, "demo/**/*.ts"),
    path.join(rootDir, "demo/**/*.html"),
  ],
  safelist: ["h-[38px]", "h-[50px]", "text-sm"],
  theme: {
    extend: {
      colors: {
        monorail: {
          bg: "rgb(var(--monorail-bg) / <alpha-value>)",
          text: "rgb(var(--monorail-text) / <alpha-value>)",
          "active-bg": "rgb(var(--monorail-active-bg) / <alpha-value>)",
          "active-text": "rgb(var(--monorail-active-text) / <alpha-value>)",
        },
      },
    },
  },
};

export default config;
