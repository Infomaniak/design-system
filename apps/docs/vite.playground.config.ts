import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';

// Resolve from the docs workspace, wherever yarn hoists the package.
const require_ = createRequire(import.meta.url);
const playgroundElementsPackageJson = JSON.parse(
  readFileSync(require_.resolve('playground-elements/package.json'), 'utf8'),
) as {
  version: string;
};

/**
 * Vite externalizes the worker's static import of the vendored TypeScript
 * compiler (`import "./internal/typescript.js"`) without emitting the file
 * (playground-elements README, "Bundling"). Copy it next to the emitted worker
 * chunk so the relative import resolves.
 */
function copyPlaygroundWorkerTypeScript(): Plugin {
  return {
    name: 'copy-playground-worker-typescript',
    apply: 'build',
    closeBundle(): void {
      const source = require_.resolve('playground-elements/internal/typescript.js');
      const destination = fileURLToPath(
        new URL('./public/playground/assets/internal/typescript.js', import.meta.url),
      );
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
const PLAYGROUND_SANDBOX_BASE_URL = `https://unpkg.com/playground-elements@${playgroundElementsPackageJson.version}/`;

/**
 * Remote Infomaniak Sans stylesheet for the page chrome, same mechanism as the
 * Storybook build (workflow-provided env, dev fallback).
 */
const PLAYGROUND_FONTS_CSS_URL =
  process.env.VITE_FONTS_CSS_URL ??
  'https://fonts.storage.infomaniak.com/design-system/dev/infomaniak-sans.min.css';

export default defineConfig({
  root: fileURLToPath(new URL('./playground', import.meta.url)),
  base: './',
  publicDir: false,
  define: {
    PLAYGROUND_SANDBOX_BASE_URL: JSON.stringify(PLAYGROUND_SANDBOX_BASE_URL),
    PLAYGROUND_FONTS_CSS_URL: JSON.stringify(PLAYGROUND_FONTS_CSS_URL),
  },
  plugins: [copyPlaygroundWorkerTypeScript()],
  build: {
    outDir: fileURLToPath(new URL('./public/playground', import.meta.url)),
    emptyOutDir: true,
    target: 'es2022',
  },
});
