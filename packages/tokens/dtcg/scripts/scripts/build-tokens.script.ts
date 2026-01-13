import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildTokensAndroid } from '../shared/styled-dictionary/build-tokens-android.ts';

const SOURCE_DIR: string = join(dirname(fileURLToPath(import.meta.url)), '../../tokens');

const OUTPUT_DIR: string = join(dirname(fileURLToPath(import.meta.url)), '../../dist');

export async function buildTokensScript(): Promise<void> {
  await buildTokensAndroid({
    sourceDirectory: SOURCE_DIR,
    outputDirectory: OUTPUT_DIR,
  });
  // await buildTokens({
  //   sourceDirectory: SOURCE_DIR,
  //   outputDirectory: OUTPUT_DIR,
  // });
  //
  // await buildFigmaTokens({
  //   sourceDirectory: SOURCE_DIR,
  //   outputDirectory: OUTPUT_DIR,
  // });
}

await buildTokensScript();
