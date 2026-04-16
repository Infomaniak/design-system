import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ensureDesignTokenFilesContainsOnlyReferences } from '../../shared/dtcg/operations/validate/data/ensure-contains-only-references/files/ensure-design-token-files-contains-only-references.ts';
import { validateDesignTokenFilesSchema } from '../../shared/dtcg/operations/validate/schema/files/validate-design-token-files-schema.ts';
import {
  MODIFIERS_DIRECTORY_NAME,
  T2_DIRECTORY_NAME,
  T3_DIRECTORY_NAME,
} from '../build-tokens/src/constants/design-token-tiers.ts';

const LOCAL_DIR: string = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR: string = join(LOCAL_DIR, '../../..');
const TOKENS_DIR: string = join(ROOT_DIR, 'tokens');

export async function validateTokensScript(): Promise<void> {
  await validateDesignTokenFilesSchema([`${TOKENS_DIR}/**/*.tokens.json`]);

  await ensureDesignTokenFilesContainsOnlyReferences([
    `${TOKENS_DIR}/${T2_DIRECTORY_NAME}/*.tokens.json`,
    `${TOKENS_DIR}/${T3_DIRECTORY_NAME}/*.tokens.json`,
    `${TOKENS_DIR}/${MODIFIERS_DIRECTORY_NAME}/*.tokens.json`,
  ]);
}

await validateTokensScript();
