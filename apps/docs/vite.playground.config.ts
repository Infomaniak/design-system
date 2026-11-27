import { copyFileSync, mkdirSync, readdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';

// Resolve from the docs workspace, wherever yarn hoists the package.
const require_ = createRequire(import.meta.url);
const { version } = JSON.parse(
  readFileSync(require_.resolve('playground-elements/package.json'), 'utf8'),
) as {
  version?: string;
};

if (version === undefined) {
  throw new Error('The installed playground-elements package.json has no version field.');
}

// Gitignored build output, served by the Storybook dev server and shipped with
// the Storybook deploy.
const OUT_DIR = fileURLToPath(new URL('./public/playground', import.meta.url));

/**
 * Vite externalizes the worker's static import of the vendored TypeScript
 * compiler (`import "./internal/typescript.js"`) without emitting the file
 * (playground-elements README, "Bundling"). Copy it next to the emitted worker
 * chunk so the relative import resolves. Fail the build when the chunk cannot
 * be located, so a change in Vite's worker emission surfaces here instead of
 * as a silent 404 in the editor.
 */
function copyPlaygroundWorkerTypeScript(): Plugin {
  return {
    name: 'copy-playground-worker-typescript',
    apply: 'build',
    closeBundle(): void {
      const assetsDir = join(OUT_DIR, 'assets');
      const workerChunk = readdirSync(assetsDir).find((file) =>
        file.startsWith('playground-typescript-worker-'),
      );
      if (workerChunk === undefined) {
        throw new Error(
          `No playground-typescript-worker-* chunk found in ${assetsDir}: Vite's worker ` +
            `emission changed and the TypeScript copy target is stale.`,
        );
      }
      const source = require_.resolve('playground-elements/internal/typescript.js');
      const workerChunkPath = join(assetsDir, workerChunk);
      const destination = join(dirname(workerChunkPath), 'internal', 'typescript.js');
      mkdirSync(dirname(destination), { recursive: true });
      copyFileSync(source, destination);
    },
  };
}

/**
 * The sandbox must be a different origin than this page (untrusted code). The
 * version is pinned to the exact installed playground-elements version, since
 * the service worker files must match the bundled components (README,
 * "Sandbox security" / requirement 4). The sandbox base is the package root on
 * unpkg — that is where `playground-service-worker.js` and
 * `playground-service-worker-proxy.html` are published.
 */
const PLAYGROUND_SANDBOX_BASE_URL = `https://unpkg.com/playground-elements@${version}/`;

export default defineConfig({
  root: fileURLToPath(new URL('./playground', import.meta.url)),
  base: './',
  publicDir: false,
  define: {
    PLAYGROUND_SANDBOX_BASE_URL: JSON.stringify(PLAYGROUND_SANDBOX_BASE_URL),
  },
  plugins: [copyPlaygroundWorkerTypeScript()],
  build: {
    outDir: OUT_DIR,
    emptyOutDir: true,
    target: 'es2022',
  },
});
