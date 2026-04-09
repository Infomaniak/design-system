import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateDesignTokenFilesSchema } from '../../shared/dtcg/operations/validate/schema/files/validate-design-token-files-schema.ts';

const LOCAL_DIR: string = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR: string = join(LOCAL_DIR, '../../..');
const TOKENS_DIR: string = join(ROOT_DIR, 'tokens');

export async function validateTokensScript(): Promise<void> {
  await validateDesignTokenFilesSchema([`${TOKENS_DIR}/**/*.tokens.json`]);
}

await validateTokensScript();
