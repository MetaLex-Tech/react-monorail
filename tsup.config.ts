import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
  },
  format: ["esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  injectStyle: true,
  noExternal: ["augmented-ui"],
  external: [
    "react",
    "react-dom",
    "react/jsx-runtime",
    "framer-motion",
    "jotai",
    "class-variance-authority",
    "clsx",
    "tailwind-merge",
  ],
});
