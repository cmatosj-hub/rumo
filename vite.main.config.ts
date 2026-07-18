import { builtinModules } from 'node:module';
import { defineConfig } from 'vite';

const nodeBuiltins = builtinModules.flatMap((moduleName) => [
  moduleName,
  `node:${moduleName}`,
]);

export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: 'src/main/index.ts',
      fileName: 'main',
      formats: ['cjs'],
    },
    outDir: '.vite/build',
    rollupOptions: {
      external: ['better-sqlite3', 'electron', ...nodeBuiltins],
    },
    sourcemap: true,
  },
});
