import { rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { BuildConfig } from '../../../../../../../scripts/helpers/build/build-config/build-config.ts';
import { getEnvBuildConfig } from '../../../../../../../scripts/helpers/build/build-config/env/get-env-build-config.ts';
import { loadOptionallyEnvFile } from '../../../../../../../scripts/helpers/env/env-file/load-optionally-env-file.ts';
import { getEnvFigmaApiToken } from '../../../../../../../scripts/helpers/figma/env/get-env-figma-api-token.ts';
import { getEnvFigmaIconFileKey } from '../../../../../../../scripts/helpers/figma/env/get-env-figma-icon-file-key.ts';
import { getEnvCiPullRequestAuthTokenDesignSystem } from '../../../../../../../scripts/helpers/github/pull-request/env/get-env-ci-pull-request-auth-token-design-system.ts';
import { postKchatWebhookMessage } from '../../../../../../../scripts/helpers/kchat/api/post-kchat-webhook-message.ts';
import { getEnvKchatWebhookId } from '../../../../../../../scripts/helpers/kchat/env/get-env-kchat-webhook-id.ts';
import { DEFAULT_LOG_LEVEL } from '../../../../../../../scripts/helpers/log/log-level/defaults/default-log-level.ts';
import { Logger } from '../../../../../../../scripts/helpers/log/logger.ts';
import { dedent } from '../../../../../../../scripts/helpers/misc/string/dedent/dedent.ts';
import { bumpSvgsPackageJsonVersion } from './src/bump-version/bump-svgs-package-json-version.ts';
import { importIconsAndIllustrations } from './src/import/import-icons-and-illustrations.ts';
import { createImportSvgPullRequests } from './src/pull-request/create-import-svgs-pull-request.ts';

const ROOT_DIR: string = join(dirname(fileURLToPath(import.meta.url)), '../../..');
const OUTPUT_DIR: string = join(ROOT_DIR, 'dist');
const OUTPUT_ASSETS_DIR: string = join(OUTPUT_DIR, 'assets');
const WORKSPACE_ROOT_DIR: string = join(ROOT_DIR, '../../../..');

const logger = Logger.root({ logLevel: DEFAULT_LOG_LEVEL });

export function importSvgsScript(): Promise<void> {
  return logger.asyncTask('build-svgs.script', async (logger: Logger): Promise<void> => {
    try {
      loadOptionallyEnvFile(logger);

      await rm(OUTPUT_DIR, { force: true, recursive: true });

      const buildConfig: BuildConfig = getEnvBuildConfig();

      const hasNewAssets: boolean = await importIconsAndIllustrations({
        ...buildConfig,
        figmaAPIToken: getEnvFigmaApiToken(),
        figmaSourceFileKey: getEnvFigmaIconFileKey(),
        outputDirectory: OUTPUT_ASSETS_DIR,
        logger,
      });

      if (!hasNewAssets) {
        throw new Error('No new assets have been imported from Figma.');
      }

      const version: string = await bumpSvgsPackageJsonVersion({
        outputDirectory: OUTPUT_DIR,
        packageRootDirectory: ROOT_DIR,
        logger,
      });

      await createImportSvgPullRequests({
        outputDirectory: OUTPUT_DIR,
        packageRootDirectory: ROOT_DIR,
        workspaceRootDirectory: WORKSPACE_ROOT_DIR,
        version,
        pullRequestAuthToken: getEnvCiPullRequestAuthTokenDesignSystem(),
        logger,
      });
    } catch (error: unknown) {
      await logger.asyncTask('send-kchat-notification', async (): Promise<void> => {
        await postKchatWebhookMessage({
          webhookId: getEnvKchatWebhookId(),
          text: dedent`
            #### ❌ svg import failed

            - 💬 ${Error.isError(error) ? error.message : String(error)}
          `,
        });
      });

      throw error;
    }
  });
}

try {
  await importSvgsScript();
} catch (error: unknown) {
  logger.fatal(error);
}
