import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { rolldown } from 'rolldown';
import { runScript } from '../../../../../scripts/helpers/misc/run-script/run-script.ts';

const ROOT_DIR: string = join(dirname(fileURLToPath(import.meta.url)), '../../..');
const SRC_DIR: string = join(ROOT_DIR, 'src');
const OUTPUT_DIR: string = join(ROOT_DIR, 'dist');

const BUNDLE_MARKER: string = '<!--FIGMA_LINT_UI_BUNDLE-->';

const MANIFEST = {
  name: 'Infomaniak Design Linter',
  id: '000000000',
  api: '1.0.0',
  editorType: ['figma'],
  main: 'code.js',
  ui: 'ui.html',
  documentAccess: 'dynamic-page',
  networkAccess: {
    allowedDomains: ['none'],
  },
} as const;

await runScript('build-figma-lint-plugin', async (): Promise<void> => {
  await rm(OUTPUT_DIR, { force: true, recursive: true });
  await mkdir(OUTPUT_DIR, { recursive: true });

  await writeSandboxBundle();
  await writeInlinedUiHtml();
  await writeFile(
    join(OUTPUT_DIR, 'manifest.json'),
    `${JSON.stringify(MANIFEST, null, 2)}\n`,
    'utf-8',
  );
});

async function writeSandboxBundle(): Promise<void> {
  const bundle = await rolldown({
    input: join(SRC_DIR, 'sandbox/code.ts'),
    platform: 'browser',
  });

  const { output } = await bundle.generate({ format: 'iife' });
  await writeFile(join(OUTPUT_DIR, 'code.js'), output[0]!.code, 'utf-8');
  await bundle.close();
}

async function writeInlinedUiHtml(): Promise<void> {
  const bundle = await rolldown({
    input: join(SRC_DIR, 'ui/main.ts'),
    platform: 'browser',
  });

  const { output } = await bundle.generate({ format: 'iife' });
  await bundle.close();

  const uiSource: string = output[0]!.code;
  const htmlTemplate: string = await readFile(join(SRC_DIR, 'ui/ui.html'), 'utf-8');

  if (!htmlTemplate.includes(BUNDLE_MARKER)) {
    throw new Error(`Missing ${BUNDLE_MARKER} marker in src/ui/ui.html.`);
  }

  const html: string = htmlTemplate.replace(BUNDLE_MARKER, `<script>\n${uiSource}\n</script>`);

  await writeFile(join(OUTPUT_DIR, 'ui.html'), html, 'utf-8');
}
