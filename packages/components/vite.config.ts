import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { viteTc39DecoratorsPlugin } from '../../plugins/vite-tc39-decorators-plugin.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    target: 'es2022',
    lib: {
      entry: resolve(__dirname, 'src/public-api.ts'),
      fileName: 'public-api',
      formats: ['es'],
    },
    rolldownOptions: {
      external: ['lit', /lit\/.*/, /@infomaniak-design-system\/tokens\.*/],
      output: {
        preserveModules: true,
      },
    },
  },
  css: {
    postcss: {},
    lightningcss: {},
  },
  plugins: [viteTc39DecoratorsPlugin()],
});
