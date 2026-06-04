import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    target: 'es2022',
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        'esds-icon/index': resolve(__dirname, 'src/esds-icon/index.ts'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: ['lit', /lit\/.*/],
      output: {
        preserveModules: false,
      },
    },
  },
});
