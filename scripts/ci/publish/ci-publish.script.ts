import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadOptionallyEnvFile } from '../../helpers/env/load-env-file.ts';
import { DEFAULT_LOG_LEVEL } from '../../helpers/log/log-level/defaults/default-log-level.ts';
import { Logger } from '../../helpers/log/logger.ts';
import type { CiPublishConfig } from './src/publish-config/ci-publish-config.ts';
import { getEnvCiPublishConfig } from './src/publish-config/env/get-env-ci-publish-config.ts';

const ROOT_DIR: string = join(dirname(fileURLToPath(import.meta.url)), '../../..');

const logger = Logger.root({ logLevel: DEFAULT_LOG_LEVEL });

export function ciPublishScript(): Promise<void> {
  return logger.asyncTask('ci-publish.script', async (logger: Logger): Promise<void> => {
    loadOptionallyEnvFile(logger);

    console.log(process.env['GITHUB_CONFIG']);
    const ciPublishConfig: CiPublishConfig = getEnvCiPublishConfig();

    console.log(ciPublishConfig);
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
