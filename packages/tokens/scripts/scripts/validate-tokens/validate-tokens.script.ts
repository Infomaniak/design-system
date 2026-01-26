import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateDesignTokenFiles } from '../../shared/dtcg/operations/validate/validate-design-token-files.ts';

const TOKENS_DIR: string = join(dirname(fileURLToPath(import.meta.url)), '../../tokens');

export async function validateTokensScript(): Promise<void> {
  await validateDesignTokenFiles([`${TOKENS_DIR}/**/*.tokens.json`]);
}

await validateTokensScript();
