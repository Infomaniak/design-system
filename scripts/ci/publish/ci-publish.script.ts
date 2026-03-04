import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { loadOptionallyEnvFile } from '../../helpers/env/env-file/load-optionally-env-file.ts';
import { getEnvGithubCiConfig } from '../../helpers/github/github-ci-config/env/get-env-github-ci-config.ts';
import type { GithubCiConfig } from '../../helpers/github/github-ci-config/github-ci-config.ts';
import { DEFAULT_LOG_LEVEL } from '../../helpers/log/log-level/defaults/default-log-level.ts';
import { Logger } from '../../helpers/log/logger.ts';
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

    if (!ciPublishContext.shouldPublish) {
      logger.info(
        `SKIP: CI publish disabled for ${githubCiConfig.event_name}:${ciPublishContext.branchName} (missing required PR label "dev").`,
      );
      return;
    }

    await ciPublish({
      ...ciPublishContext,
      rootDirectory: ROOT_DIR,
      dryRun: getEnvCiPublishDryRun(),
      logger,
    });
  });
}

try {
  await ciPublishScript();
} catch (error: unknown) {
  logger.fatal(error);
}
