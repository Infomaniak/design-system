import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { getCliArgValue } from '../../../../scripts/helpers/ci/get-cli-arg-value.ts';
import { generateLlmsDocs } from './src/generate.ts';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const appsDocsDir = join(scriptDir, '..', '..');
const repositoryRoot = join(appsDocsDir, '..', '..');

function main(): void {
  const dist = getCliArgValue(process.argv, '--dist') ?? 'storybook-static';
  const baseUrl = getCliArgValue(process.argv, '--base-url') ?? process.env['LLMS_BASE_URL'] ?? '';
  const result = generateLlmsDocs(
    {
      distDir: join(appsDocsDir, dist),
      appsDocsDir,
      componentsDir: join(repositoryRoot, 'packages', 'components'),
      designMdPath: join(appsDocsDir, 'public', 'DESIGN.md'),
      baseUrl,
      publicDir: join(appsDocsDir, 'public'),
    },
    {
      readFile: (path) => readFileSync(path, 'utf8'),
      writeFile: (path, content) => writeFileSync(path, content),
      mkdir: (path, options) => mkdirSync(path, options),
    },
  );
  console.log(
    `[generate-llms-docs] Generated ${result.pageCount} pages and ${result.fileCount} files in ${join(appsDocsDir, dist)}`,
  );
  console.log(
    '[generate-llms-docs] Mirrored llms.txt and llms-full.txt to public/ (served by the dev server)',
  );
}

try {
  main();
} catch (error) {
  console.error('[generate-llms-docs] Failed:', error);
  process.exitCode = 1;
}
