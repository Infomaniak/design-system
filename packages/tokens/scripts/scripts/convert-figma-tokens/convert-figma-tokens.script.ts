import { rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEFAULT_LOG_LEVEL } from '../../../../../scripts/helpers/log/log-level/defaults/default-log-level.ts';
import { Logger } from '../../../../../scripts/helpers/log/logger.ts';
import { execCommandInherit } from '../../../../../scripts/helpers/misc/exec-command.ts';
import {
  DESIGN_TOKEN_TIERS,
  MODIFIERS_DIRECTORY_NAME,
} from '../build-tokens/src/constants/design-token-tiers.ts';

import { convertFigmaTokens } from './src/convert-figma.tokens.ts';

const LOCAL_DIR: string = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR: string = join(LOCAL_DIR, '../../..');
const TOKENS_DIR: string = join(LOCAL_DIR, 'tokens');
const TOKENS_PATH: string = join(TOKENS_DIR, 'tokens.json');
const OUTPUT_DIR: string = join(ROOT_DIR, 'tokens');

const logger = Logger.root({ logLevel: DEFAULT_LOG_LEVEL });

export async function convertFigmaTokensScript(): Promise<void> {
  for (const subDirectory of [...DESIGN_TOKEN_TIERS, MODIFIERS_DIRECTORY_NAME]) {
    await rm(join(OUTPUT_DIR, subDirectory), { force: true, recursive: true });
  }

  await convertFigmaTokens({
    tokensPath: TOKENS_PATH,
    outputDirectory: OUTPUT_DIR,
  });

  await execCommandInherit(logger, 'yarn', ['format:fix']);
}

await convertFigmaTokensScript();
