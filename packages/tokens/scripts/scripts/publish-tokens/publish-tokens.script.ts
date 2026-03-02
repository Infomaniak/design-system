import { dirname, join } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { loadOptionallyEnvFile } from '../../../../../scripts/helpers/env/load-env-file.ts';
import {
  parseJsonStringRecord,
  parseNumber,
} from '../../../../../scripts/helpers/env/parse-value.ts';
import { DEFAULT_LOG_LEVEL } from '../../../../../scripts/helpers/log/log-level/defaults/default-log-level.ts';
import { Logger } from '../../../../../scripts/helpers/log/logger.ts';
import { publishTokens } from './src/publish-tokens.ts';

const ROOT_DIR: string = join(dirname(fileURLToPath(import.meta.url)), '../../..');

const OUTPUT_DIR: string = join(ROOT_DIR, 'dist');

const logger = Logger.root({ logLevel: DEFAULT_LOG_LEVEL });

export async function publishTokensScript(): Promise<void> {
  const {
    values: { tag },
  } = parseArgs({
    options: {
      tag: {
        type: 'string',
        short: 't',
        default: 'dev',
      },
    },
  });

  loadOptionallyEnvFile(logger);

  await publishTokens({
    outputDirectory: OUTPUT_DIR,
    tag,
    publishTimestamp: parseNumber(process.env['CI_PUBLISH_TIMESTAMP']),
    versionOverride: process.env['NPM_PUBLISH_VERSION'],
    internalDependencyVersionOverrides: parseJsonStringRecord(
      process.env['NPM_INTERNAL_DEP_OVERRIDES_JSON'],
      'NPM_INTERNAL_DEP_OVERRIDES_JSON',
    ),
    logger,
  });
}

try {
  await publishTokensScript();
} catch (error: unknown) {
  logger.fatal(error);
}
