import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { loadOptionallyEnvFile } from '../../helpers/env/env-file/load-optionally-env-file.ts';
import { getEnvGithubCiConfig } from '../../helpers/github/github-ci-config/env/get-env-github-ci-config.ts';
import type { GithubCiConfig } from '../../helpers/github/github-ci-config/github-ci-config.ts';
import { postKchatWebhookMessage } from '../../helpers/kchat/api/post-kchat-webhook-message.ts';
import { getEnvKchatWebhookId } from '../../helpers/kchat/env/get-env-kchat-webhook-id.ts';
import { DEFAULT_LOG_LEVEL } from '../../helpers/log/log-level/defaults/default-log-level.ts';
import { Logger } from '../../helpers/log/logger.ts';
import { dedent } from '../../helpers/misc/string/dedent/dedent.ts';
import { getEnvCiPublishDryRun } from '../../helpers/publish/env/get-env-ci-publish-dry-run.ts';
import { ciPublish } from './src/ci-publish.ts';
import {
  type CiPublishContext,
  inferCiPublishContext,
} from './src/context/infer-ci-publish-context.ts';

const ROOT_DIR: string = join(dirname(fileURLToPath(import.meta.url)), '../../..');

const logger = Logger.root({ logLevel: DEFAULT_LOG_LEVEL });

export function ciPublishScript(): Promise<void> {
  return logger.asyncTask('ci-publish.script', async (logger: Logger): Promise<void> => {
    loadOptionallyEnvFile(logger);

    const githubCiConfig: GithubCiConfig = getEnvGithubCiConfig();
    const ciPublishContext: CiPublishContext = inferCiPublishContext(githubCiConfig);
    const dryRun: boolean = getEnvCiPublishDryRun();

    if (!ciPublishContext.shouldPublish) {
      logger.info(
        `SKIP: CI publish disabled for ${githubCiConfig.event_name}:${ciPublishContext.branchName} (missing required PR label "dev").`,
      );
      return;
    }

    const jobUrl: string = `${githubCiConfig.server_url}/${githubCiConfig.repository}/actions/runs/${githubCiConfig.run_id}`;
    const shouldNotify: boolean = !dryRun && ciPublishContext.mode !== 'dev';

    try {
      await ciPublish({
        ...ciPublishContext,
        rootDirectory: ROOT_DIR,
        dryRun,
        logger,
      });
    } catch (error: unknown) {
      if (shouldNotify) {
        await logger.asyncTask('send-kchat-notification', async (): Promise<void> => {
          await postKchatWebhookMessage({
            webhookId: getEnvKchatWebhookId(),
            text: dedent`
              #### ❌ publish job failed
    
              - 🔗 ${jobUrl}
              - 🌱 ${ciPublishContext.branchName}
              - ⚙️ ${ciPublishContext.mode}
              - 💬 ${Error.isError(error) ? error.message : String(error)}
            `,
          });
        });
      }

      throw error;
    }

    if (shouldNotify) {
      await logger.asyncTask('send-kchat-notification', async (): Promise<void> => {
        await postKchatWebhookMessage({
          webhookId: getEnvKchatWebhookId(),
          text: dedent`
            #### ✅ publish job succeed
    
              - 🔗 ${jobUrl}
              - 🌱 ${ciPublishContext.branchName}
              - ⚙️ ${ciPublishContext.mode}
          `,
        });
      });
    }
  });
}

try {
  await ciPublishScript();
} catch (error: unknown) {
  logger.fatal(error);
}
