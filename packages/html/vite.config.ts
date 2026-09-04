import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    dts({
      tsconfigPath: "./tsconfig.json",
      include: ["src/**/*.ts"],
      exclude: ["src/**/*.test.ts", "__tests__/**/*.ts"],
    }),
  ],
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      fileName: () => "index.js",
    },
    rollupOptions: {
      external: [/^@argon-kit\//],
      output: { preserveModules: false },
    },
  },
});
