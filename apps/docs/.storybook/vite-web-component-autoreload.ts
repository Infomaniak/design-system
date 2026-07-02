import type { Plugin } from 'vite';

/**
 * Forces a full page reload when web component source files change.
 *
 * Vite's default HMR tries to hot-swap modified modules in-place, but
 * web components registered via `customElements.define()` cannot be
 * re-defined on the same registry. This causes the following error on
 * every save:
 *
 *   "Failed to execute 'define' on 'CustomElementRegistry':
 *    the name "..." has already been used with this registry"
 *
 * This plugin detects changes to `.component.ts` files and opts out of
 * module-level HMR, triggering a full page reload instead. The browser
 * then starts with a fresh registry so the updated component class can
 * be re-registered safely.
 */
export function webComponentAutoReload(): Plugin {
  return {
    name: 'web-component-auto-reload',
    handleHotUpdate({ file, server }) {
      // When any .component.ts file changes, force a full page reload
      // instead of module-level HMR to avoid
      // CustomElementRegistry re-definition errors.
      if (file.includes('/src/') && file.endsWith('.component.ts')) {
        server.ws.send({ type: 'full-reload' });

        // Prevent Vite from processing any further HMR steps for this file
        return [];
      }
    },
  };
}
