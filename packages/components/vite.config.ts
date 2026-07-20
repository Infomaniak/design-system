import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { viteTc39DecoratorsPlugin } from '../../plugins/vite-tc39-decorators-plugin.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    target: 'es2022',
    lib: {
      entry: {
        'public-api': resolve(__dirname, 'src/public-api.ts'),
        'react/index': resolve(__dirname, 'src/react/index.ts'),
      },
      formats: ['es'],
    },
    rolldownOptions: {
      external: ['lit', /lit\/.*/, 'react'],
      output: {
        preserveModules: true,
      },
    },
  },
  plugins: [viteTc39DecoratorsPlugin()],
});
