import { dirname, join } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { loadOptionallyEnvFile } from '../../helpers/env/load-env-file.ts';
import { parseBoolean } from '../../helpers/env/parse-value.ts';
import { DEFAULT_LOG_LEVEL } from '../../helpers/log/log-level/defaults/default-log-level.ts';
import { Logger } from '../../helpers/log/logger.ts';
import { ciPublish } from './src/ci-publish.ts';

const ROOT_DIR: string = join(dirname(fileURLToPath(import.meta.url)), '../../..');

const logger = Logger.root({ logLevel: DEFAULT_LOG_LEVEL });

export async function ciPublishScript(): Promise<void> {
  loadOptionallyEnvFile(logger);

  const branchName: string | undefined = process.env['GITHUB_REF_NAME'];

  if (branchName === undefined || branchName === '') {
    throw new Error('Missing required env variable "GITHUB_REF_NAME".');
  }

  await ciPublish({
    rootDirectory: ROOT_DIR,
    branchName,
    strictVersionPolicy: parseBoolean(process.env['CI_PUBLISH_STRICT_VERSION_POLICY'], true),
    dryRun: parseBoolean(process.env['CI_PUBLISH_DRY_RUN'], false),
    logger,
  });
}

try {
  await ciPublishScript();
} catch (error: unknown) {
  logger.fatal(error);
}
