import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { loadOptionallyEnvFile } from '../../../../../scripts/helpers/env/load-env-file.ts';
import { DEFAULT_LOG_LEVEL } from '../../../../../scripts/helpers/log/log-level/defaults/default-log-level.ts';
import { Logger } from '../../../../../scripts/helpers/log/logger.ts';
import { publishTokens } from './src/publish-tokens.ts';

const ROOT_DIR: string = join(dirname(fileURLToPath(import.meta.url)), '../../..');

const OUTPUT_DIR: string = join(ROOT_DIR, 'dist');

const logger = Logger.root({ logLevel: DEFAULT_LOG_LEVEL });

export async function publishTokensScript(): Promise<void> {
  const {
    values: { mode, tag },
  } = parseArgs({
    options: {
      mode: {
        type: 'string',
        short: 'm',
        default: 'dev',
      },
      tag: {
        type: 'string',
      },
    },
  });

  if (mode !== 'prod' && mode !== 'dev') {
    throw new Error(`Invalid mode: ${mode}.`);
  }

  loadOptionallyEnvFile(logger);

  await publishTokens({
    outputDirectory: OUTPUT_DIR,
    mode,
    tag,
    logger,
  });
}

try {
  await publishTokensScript();
} catch (error: unknown) {
  logger.fatal(error);
}
