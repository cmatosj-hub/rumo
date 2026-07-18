import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  plugins: [react()],
  root: 'src/renderer',
  build: {
    emptyOutDir: false,
    outDir: '../../.vite/renderer/main_window',
    sourcemap: true,
  },
});
