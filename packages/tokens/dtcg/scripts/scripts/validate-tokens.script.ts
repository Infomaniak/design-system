import { glob, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { designTokenGroupSchema } from '../shared/dtcg/design-token/tree/design-tokens-tree.schema.ts';

const TOKENS_DIR: string = join(dirname(fileURLToPath(import.meta.url)), '../../tokens');

export async function validateTokensScript(): Promise<void> {
  for await (const entry of glob(`${TOKENS_DIR}/**/*.tokens.json`)) {
    designTokenGroupSchema.parse(JSON.parse(await readFile(entry, { encoding: 'utf-8' })));
  }
}

await validateTokensScript();
