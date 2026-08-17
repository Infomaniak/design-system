import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { PreRenderedChunk } from 'rolldown';
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
      external: ['lit', /lit\/.*/],
      output: {
        preserveModules: true,
        entryFileNames: (chunkInfo: PreRenderedChunk): string => {
          let name: string = chunkInfo.name;

          if (name.startsWith('node_modules/')) {
            // to avoid conflict with local node_modules (when the consumer does `npm i`)
            name = `external/${name.slice(13)}`;
          } else if (name.startsWith('packages/components/src/')) {
            name = name.slice(24);
          }

          {
            // remove the query string from the chunk name
            // ex: abc.component.css?inline -> abc.component.css
            const index: number = name.indexOf('?');

            if (index !== -1) {
              name = name.slice(0, index);
            }
          }

          return `${name}.js`;
        },
      },
    },
  },
  plugins: [viteTc39DecoratorsPlugin()],
});
