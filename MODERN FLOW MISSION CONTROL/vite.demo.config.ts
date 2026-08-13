import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

/**
 * Builds the shareable single-file demo (see demo/main.tsx). Everything is
 * inlined into one HTML file by scripts/build-demo.mjs afterwards, so it can be
 * hosted anywhere with no server and no external requests.
 *
 * This is separate from the production build and doesn't affect it.
 */
export default defineConfig({
  root: path.resolve(process.cwd(), 'demo'),
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), 'src'),
      '@shared': path.resolve(process.cwd(), 'shared'),
    },
  },
  build: {
    outDir: path.resolve(process.cwd(), 'dist-demo'),
    emptyOutDir: true,
    // One JS file, one CSS file — no lazy chunks to inline.
    assetsInlineLimit: 100_000_000,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        entryFileNames: 'app.js',
        assetFileNames: 'app.[ext]',
      },
    },
  },
});
