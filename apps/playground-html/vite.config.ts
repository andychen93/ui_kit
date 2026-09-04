import { defineConfig } from 'vite';

export default defineConfig({
  server: { port: 5175 },
  build: {
    outDir: 'dist',
    rollupOptions: {
      external: ['@argon-kit/html-charts', '@argon-kit/html-calendar', '@argon-kit/html-editor']
    }
  }
});
