import type { Config } from "tailwindcss";

const preset: Partial<Config> = {
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

export default preset;
