import { rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { convertFigmaTokens } from './src/convert-figma.tokens.ts';

const TOKENS_DIR: string = join(dirname(fileURLToPath(import.meta.url)), 'tokens');
const TOKENS_PATH: string = join(TOKENS_DIR, 'tokens.json');
const OUTPUT_DIR: string = join(TOKENS_DIR, 'dtcg');
// const DTCG_TOKENS_PATH: string = join(TOKENS_DIR, 'dtcg.tokens.json');

export async function convertFigmaTokensScript(): Promise<void> {
  await rm(OUTPUT_DIR, { force: true, recursive: true });

  await convertFigmaTokens({
    tokensPath: TOKENS_PATH,
    outputDirectory: OUTPUT_DIR,
  });
}

await convertFigmaTokensScript();
