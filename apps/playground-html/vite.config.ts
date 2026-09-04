import { defineConfig } from 'vite';
import path from 'node:path';

export default defineConfig({
  server: {
    port: 5175,
    fs: {
      // Allow importing tests/contract/component-manifest.ts so the
      // "component coverage" panel reads the same manifest used by the
      // contract test, instead of a hand-maintained duplicate.
      allow: [path.resolve(__dirname, '../..')]
    }
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      external: ['@argon-kit/html-charts', '@argon-kit/html-calendar', '@argon-kit/html-editor']
    }
  }
});
