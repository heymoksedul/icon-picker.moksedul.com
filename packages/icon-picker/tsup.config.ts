import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  external: ["react", "react-dom", "next"],
  injectStyle: false,
  esbuildOptions(options) {
    // Keep the per-set dynamic imports of `react-icons/*` as real runtime
    // imports so the consumer's bundler can code-split each icon set.
    options.splitting = false;
  },
});
