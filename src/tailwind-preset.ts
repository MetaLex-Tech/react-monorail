import type { Config } from "tailwindcss";

const preset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        brand: {
          white: "rgb(var(--brand-white) / <alpha-value>)",
        },
        highlight: {
          500: "rgb(var(--highlight-500) / <alpha-value>)",
        },
        neutral: {
          500: "rgb(var(--neutral-500) / <alpha-value>)",
        },
        muted: {
          foreground: "rgb(var(--brand-white) / 0.60)",
        },
      },
    },
  },
};

export default preset;
