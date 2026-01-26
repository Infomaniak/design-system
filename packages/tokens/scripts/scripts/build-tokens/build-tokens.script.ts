import { rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEFAULT_LOG_LEVEL } from '../../../../../scripts/helpers/log/log-level/defaults/default-log-level.ts';
import { Logger } from '../../../../../scripts/helpers/log/logger.ts';
import { buildTokens } from './helpers/build-tokens.ts';
import { generatePackage } from './helpers/generate-package.ts';

const ROOT_DIR: string = join(dirname(fileURLToPath(import.meta.url)), '../../..');

const SOURCE_DIR: string = join(ROOT_DIR, 'tokens');

const OUTPUT_DIR: string = join(ROOT_DIR, 'dist');

const logger = Logger.root({ logLevel: DEFAULT_LOG_LEVEL });

export async function buildTokensScript(): Promise<void> {
  await rm(OUTPUT_DIR, { force: true, recursive: true });

  await buildTokens({
    sourceDirectory: SOURCE_DIR,
    outputDirectory: OUTPUT_DIR,
    logger,
  });

  await generatePackage({
    rootDirectory: ROOT_DIR,
    outputDirectory: OUTPUT_DIR,
    logger,
  });
}

try {
  await buildTokensScript();
} catch (error: unknown) {
  logger.fatal(error);
}
