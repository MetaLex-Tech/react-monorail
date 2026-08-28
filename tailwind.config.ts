import type { Config } from "tailwindcss";
import preset from "./src/tailwind-preset";

const config: Config = {
  presets: [preset],
  content: ["./demo/**/*.{ts,tsx,html}", "./src/**/*.{ts,tsx}"],
};

export default config;
