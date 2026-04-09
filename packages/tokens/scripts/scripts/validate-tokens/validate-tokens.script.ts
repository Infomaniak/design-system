import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateDesignTokenFiles } from '../../shared/dtcg/operations/validate/files/validate-design-token-files.ts';

const LOCAL_DIR: string = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR: string = join(LOCAL_DIR, '../../..');
const TOKENS_DIR: string = join(ROOT_DIR, 'tokens');

export async function validateTokensScript(): Promise<void> {
  await validateDesignTokenFiles([`${TOKENS_DIR}/**/*.tokens.json`]);
}

await validateTokensScript();
