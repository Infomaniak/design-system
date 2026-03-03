import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadOptionallyEnvFile } from '../../helpers/env/load-env-file.ts';
import { getEnvGithubCiConfig } from '../../helpers/github/github-ci-config/env/get-env-github-ci-config.ts';
import type { GithubCiConfig } from '../../helpers/github/github-ci-config/github-ci-config.ts';
import { DEFAULT_LOG_LEVEL } from '../../helpers/log/log-level/defaults/default-log-level.ts';
import { Logger } from '../../helpers/log/logger.ts';
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
        `[skip] CI publish disabled for ${githubCiConfig.event_name}:${ciPublishContext.branchName} (missing required PR label "dev").`,
      );
      return;
    }

    // console.log(ciPublishContext);

    await ciPublish({
      ...ciPublishContext,
      rootDirectory: ROOT_DIR,
      logger,
    });

    // console.log(githubCiConfig);
    // const branchName: string | undefined =
    //   process.env['CI_PUBLISH_TARGET_BRANCH'] ?? process.env['GITHUB_REF_NAME'];
    //
    // if (branchName === undefined || branchName === '') {
    //   throw new Error(
    //     'Missing required env variable "GITHUB_REF_NAME" (or "CI_PUBLISH_TARGET_BRANCH").',
    //   );
    // }
    //
    // await ciPublish({
    //   rootDirectory: ROOT_DIR,
    //   eventName: process.env['GITHUB_EVENT_NAME'] ?? 'push',
    //   branchName,
    //   pullRequestLabels: parseJsonStringArray(
    //     process.env['CI_PUBLISH_PR_LABELS'],
    //     'CI_PUBLISH_PR_LABELS',
    //   ),
    //   gitBaseSha: process.env['CI_PUBLISH_GIT_BASE_SHA'],
    //   gitHeadSha: process.env['CI_PUBLISH_GIT_HEAD_SHA'],
    //   publishTimestamp: parseNumber(process.env['CI_PUBLISH_TIMESTAMP']),
    //   strictVersionPolicy: parseBoolean(process.env['CI_PUBLISH_STRICT_VERSION_POLICY'], true),
    //   dryRun: parseBoolean(process.env['CI_PUBLISH_DRY_RUN'], false),
    //   logger,
    // });
  });
}

try {
  await ciPublishScript();
} catch (error: unknown) {
  logger.fatal(error);
}
