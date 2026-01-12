import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildTokens } from '../shared/styled-dictionary/build-tokens.ts';

const SOURCE_DIR: string = join(dirname(fileURLToPath(import.meta.url)), '../../tokens');

const OUTPUT_DIR: string = join(dirname(fileURLToPath(import.meta.url)), '../../dist');

export async function buildTokensScript(): Promise<void> {
  await buildTokens({
    sourceBaseTokenDirectory: join(SOURCE_DIR, 'base'),
    sourceThemesDirectory: join(SOURCE_DIR, 'themes'),
    outputDirectory: OUTPUT_DIR,
  });
}

await buildTokensScript();
