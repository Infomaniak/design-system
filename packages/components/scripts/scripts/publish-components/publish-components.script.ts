import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadOptionallyEnvFile } from '../../../../../scripts/helpers/env/env-file/load-optionally-env-file.ts';
import { DEFAULT_LOG_LEVEL } from '../../../../../scripts/helpers/log/log-level/defaults/default-log-level.ts';
import { Logger } from '../../../../../scripts/helpers/log/logger.ts';
import { publishNpmPackageDirectory } from '../../../../../scripts/helpers/npm/publish-npm-package-directory/publish-npm-package-directory.ts';
import { getEnvPublishConfig } from '../../../../../scripts/helpers/publish/publish-config/env/get-env-publish-config.ts';
import type { PublishConfig } from '../../../../../scripts/helpers/publish/publish-config/publish-config.ts';
import { publishModeToNpmTag } from '../../../../../scripts/helpers/publish/publish-mode/publish-mode-to-npm-tag.ts';

const ROOT_DIR: string = join(dirname(fileURLToPath(import.meta.url)), '../../..');

const OUTPUT_DIR: string = join(ROOT_DIR, 'dist');

const logger = Logger.root({ logLevel: DEFAULT_LOG_LEVEL });

export async function publishComponentsScript(): Promise<void> {
  return logger.asyncTask(
    'publish-components.script',
    async (logger: Logger): Promise<void> => {
      loadOptionallyEnvFile(logger);

      const { mode }: PublishConfig = getEnvPublishConfig();

      await publishNpmPackageDirectory({
        packageDirectory: OUTPUT_DIR,
        tag: publishModeToNpmTag(mode),
        logger,
      });
    },
  );
}

try {
  await publishComponentsScript();
} catch (error: unknown) {
  logger.fatal(error);
}
