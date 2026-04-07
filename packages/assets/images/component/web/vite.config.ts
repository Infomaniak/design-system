import esbuild from 'esbuild';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://github.com/vitejs/vite/issues/6555
const minifyBundle = (): Plugin => ({
  name: 'minify-bundle',
  async generateBundle(_, bundle) {
    for (const asset of Object.values(bundle)) {
      if (asset.type == 'chunk')
        asset.code = (await esbuild.transform(asset.code, { minify: true })).code;
    }
  },
});

export default defineConfig({
  build: {
    target: 'es2022',
    lib: {
      entry: resolve(__dirname, 'src/public-api.ts'),
      name: 'EsdsSvg',
      fileName: 'esds-svg',
      formats: ['es', 'umd'],
    },
  },
  plugins: [minifyBundle()],
});
