import type { Group } from '@terrazzo/token-tools';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  type TokensBrueckeGroupNode,
  tokensBrueckeToDtcg,
} from '../../../../../scripts/helpers/tokens-bruecke/dtcg-from-tokens-bruecke.ts';

export const TOKENS_FILE_PATH: string = join(
  dirname(fileURLToPath(import.meta.url)),
  '../tokens-bruecke/tokens.json',
);

export const SRC_TOKENS_FILE_PATH: string = join(
  dirname(fileURLToPath(import.meta.url)),
  '../src/tokens.json',
);

/**
 * Normalizes the tokens from tokens-bruecke to dtcg.
 * @deprecated
 */
export async function normalize(): Promise<void> {
  const tokens: TokensBrueckeGroupNode = JSON.parse(
    await readFile(TOKENS_FILE_PATH, {
      encoding: 'utf-8',
    }),
  );

  const normalizedTokens: Group = tokensBrueckeToDtcg(tokens);

  await mkdir(dirname(SRC_TOKENS_FILE_PATH), { recursive: true });
  await writeFile(SRC_TOKENS_FILE_PATH, JSON.stringify(normalizedTokens, null, 2), {
    encoding: 'utf-8',
  });
}

normalize();
