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
          bg: "rgb(from var(--monorail-bg) r g b / <alpha-value>)",
          text: "rgb(from var(--monorail-text) r g b / <alpha-value>)",
          "active-bg": "rgb(from var(--monorail-active-bg) r g b / <alpha-value>)",
          "active-text":
            "rgb(from var(--monorail-active-text) r g b / <alpha-value>)",
        },
      },
    },
  },
};

export default config;
