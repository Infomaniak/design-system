import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { loadOptionallyEnvFile } from '../../../../../scripts/helpers/env/env-file/load-optionally-env-file.ts';
import { DEFAULT_LOG_LEVEL } from '../../../../../scripts/helpers/log/log-level/defaults/default-log-level.ts';
import { Logger } from '../../../../../scripts/helpers/log/logger.ts';
import { getEnvPublishConfig } from '../../../../../scripts/helpers/publish/publish-config/env/get-env-publish-config.ts';
import type { PublishConfig } from '../../../../../scripts/helpers/publish/publish-config/publish-config.ts';
import { publishIosTokens } from './src/ios/publish-ios-tokens.ts';
import { publishWebTokens } from './src/web/publish-web-tokens.ts';

const ROOT_DIR: string = join(dirname(fileURLToPath(import.meta.url)), '../../..');

const OUTPUT_DIR: string = join(ROOT_DIR, 'dist');

const logger = Logger.root({ logLevel: DEFAULT_LOG_LEVEL });

export async function publishTokensScript(): Promise<void> {
  return logger.asyncTask('publish-tokens.script', async (logger: Logger): Promise<void> => {
    loadOptionallyEnvFile(logger);

    const publishConfig: PublishConfig = getEnvPublishConfig();

    await publishWebTokens({
      ...publishConfig,
      outputDirectory: OUTPUT_DIR,
      logger,
    });

    await publishIosTokens({
      ...publishConfig,
      rootDirectory: ROOT_DIR,
      outputDirectory: OUTPUT_DIR,
      logger,
    });
  });
}

try {
  await publishTokensScript();
} catch (error: unknown) {
  logger.fatal(error);
}
