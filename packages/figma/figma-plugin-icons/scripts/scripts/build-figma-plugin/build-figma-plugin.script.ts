import { build, context, type BuildOptions, type BuildResult, type PluginBuild } from 'esbuild';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const packageDir = dirname(dirname(dirname(dirname(fileURLToPath(import.meta.url)))));
const distDir = join(packageDir, 'dist');
const srcDir = join(packageDir, 'src');
const uiDir = join(packageDir, 'ui');

const watch = process.argv.includes('--watch');
const debug = process.argv.includes('--debug');

const UI_BUNDLE_PLACEHOLDER = '/* __UI_BUNDLE__ */';

/**
 * esbuild plugin: takes the built entries (`code.js` and `ui.js`, emitted in
 * memory) and writes the final plugin artifacts to `dist/`:
 * - `dist/code.js` — sandbox code, referenced by manifest.json
 * - `dist/ui.html` — UI template with the bundled UI script inlined,
 *   producing the single file expected by the manifest
 */
const inlineUiPlugin = {
  name: 'inline-ui',
  setup(buildApi: PluginBuild): void {
    buildApi.onEnd((result: BuildResult) => {
      if (result.errors.length > 0) {
        return;
      }
      const outputs = result.outputFiles ?? [];
      const code = outputs.find((file) => file.path.endsWith('/code.js'));
      const ui = outputs.find((file) => file.path.endsWith('/ui.js'));
      if (!code || !ui) {
        throw new Error('esbuild output is missing code.js or ui.js');
      }

      mkdirSync(distDir, { recursive: true });
      writeFileSync(join(distDir, 'code.js'), code.text);

      const template = readFileSync(join(uiDir, 'ui.html'), 'utf8');
      if (!template.includes(UI_BUNDLE_PLACEHOLDER)) {
        throw new Error(`Placeholder ${UI_BUNDLE_PLACEHOLDER} not found in ui/ui.html`);
      }
      // Use a replacement function to avoid `$` sequences in the bundle being
      // interpreted as replacement patterns.
      writeFileSync(
        join(distDir, 'ui.html'),
        template.replace(UI_BUNDLE_PLACEHOLDER, () => ui.text),
      );
    });
  },
};

const buildOptions: BuildOptions = {
  entryPoints: [join(srcDir, 'code.ts'), join(uiDir, 'ui.ts')],
  entryNames: '[name]',
  outdir: distDir,
  bundle: true,
  format: 'iife',
  target: 'es2020',
  write: false,
  define: { __DEBUG__: String(debug) },
  logLevel: 'info',
  plugins: [inlineUiPlugin],
};

if (watch) {
  const ctx = await context(buildOptions);
  await ctx.watch();
  console.log('Watching for changes... (debug builds: pass --debug)');
} else {
  rmSync(distDir, { recursive: true, force: true });
  await build(buildOptions);
  console.log(`Figma plugin built to dist/ (debug: ${debug})`);
}
