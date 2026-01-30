import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readJsonFile } from '../../../../../scripts/helpers/file/read-json-file.ts';
import { writeJsonFileSafe } from '../../../../../scripts/helpers/file/write-json-file-safe.ts';
import { tokensBrueckeToDtcg } from '../../shared/tokens-bruecke/dtcg-from-tokens-bruecke.ts';

const TOKENS_DIR: string = join(dirname(fileURLToPath(import.meta.url)), 'tokens');
const TOKENS_PATH: string = join(TOKENS_DIR, 'tokens.json');
const DTCG_TOKENS_PATH: string = join(TOKENS_DIR, 'dtcg.tokens.json');

export async function convertFigmaTokensScript(): Promise<void> {
  await writeJsonFileSafe(DTCG_TOKENS_PATH, tokensBrueckeToDtcg(await readJsonFile(TOKENS_PATH)));
}

await convertFigmaTokensScript();
