import { rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildFigmaTokens } from './helpers/build-figma-tokens.ts';
import { buildTokens } from './helpers/build-tokens.ts';

/* FUNCTIONS */

/* MAIN */

const SOURCE_DIR: string = join(dirname(fileURLToPath(import.meta.url)), '../../../tokens');

const OUTPUT_DIR: string = join(dirname(fileURLToPath(import.meta.url)), '../../../dist');

export async function buildTokensScript(): Promise<void> {
  await rm(OUTPUT_DIR, { force: true, recursive: true });
  // await mkdir(OUTPUT_DIR, { recursive: true });

  await Promise.all([
    buildTokens({
      sourceDirectory: SOURCE_DIR,
      outputDirectory: OUTPUT_DIR,
    }),
    buildFigmaTokens({
      sourceDirectory: SOURCE_DIR,
      outputDirectory: OUTPUT_DIR,
    }),
  ]);
}

await buildTokensScript();
