import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import react from "@vitejs/plugin-react";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    vue(),
    react(),
    svelte(),
    dts({
      tsconfigPath: "./tsconfig.json",
      cleanVueFileName: true,
      include: ["src/core/**/*.ts", "src/react/**/*.ts", "src/react/**/*.tsx", "src/*/index.ts", "src/**/*.d.ts"],
    }),
  ],
  build: {
    lib: {
      entry: {
        index: "src/index.ts",
        vue: "src/vue/index.ts",
        react: "src/react/index.ts",
        svelte: "src/svelte/index.ts",
      },
      formats: ["es"],
    },
    rollupOptions: {
      external: (id) => {
        // CSS（含第三方库样式）内联打包，JS 模块外部化
        if (id.endsWith(".css")) return false;
        const jsExternals = [
          "chart.js",
        "vue",
        "react",
        "react-dom",
        "svelte",
        /^@argon-kit\//,
        ];
        return jsExternals.some((e) => id === e || id.startsWith(e + "/"));
      },
      output: {
        entryFileNames: "[name].js",
        assetFileNames: "assets/[name][extname]",
      },
    },
  },
});
