import { rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEFAULT_LOG_LEVEL } from '../../../../../../scripts/helpers/log/log-level/defaults/default-log-level.ts';
import { Logger } from '../../../../../../scripts/helpers/log/logger.ts';
import { buildFigmaTokens } from './helpers/build-figma-tokens.ts';
import { buildTokens } from './helpers/build-tokens.ts';

const SOURCE_DIR: string = join(dirname(fileURLToPath(import.meta.url)), '../../../tokens');

const OUTPUT_DIR: string = join(dirname(fileURLToPath(import.meta.url)), '../../../dist');

const logger = new Logger('build-tokens', { logLevel: DEFAULT_LOG_LEVEL });

export async function buildTokensScript(): Promise<void> {
  await rm(OUTPUT_DIR, { force: true, recursive: true });

  await buildTokens({
    sourceDirectory: SOURCE_DIR,
    outputDirectory: OUTPUT_DIR,
    logger,
  });

  await buildFigmaTokens({
    sourceDirectory: SOURCE_DIR,
    outputDirectory: OUTPUT_DIR,
    logger,
  });
}

await buildTokensScript();
