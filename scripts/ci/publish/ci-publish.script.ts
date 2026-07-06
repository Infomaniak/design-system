import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { getEnvGithubCiConfig } from '../../helpers/github/github-ci-config/env/get-env-github-ci-config.ts';
import type { GithubCiConfig } from '../../helpers/github/github-ci-config/github-ci-config.ts';
import { Logger } from '../../helpers/log/logger.ts';
import type { RunScriptNotification } from '../../helpers/misc/run-script/notification/run-script-notification.ts';
import { runScript } from '../../helpers/misc/run-script/run-script.ts';
import { getEnvCiPublishDryRun } from '../../helpers/publish/env/get-env-ci-publish-dry-run.ts';
import { ciPublish } from './src/ci-publish.ts';
import {
  type CiPublishContext,
  inferCiPublishContext,
} from './src/context/infer-ci-publish-context.ts';

const ROOT_DIR: string = join(dirname(fileURLToPath(import.meta.url)), '../../..');

await runScript('ci-publish', async (logger: Logger): Promise<RunScriptNotification | void> => {
  const githubCiConfig: GithubCiConfig = getEnvGithubCiConfig();
  const ciPublishContext: CiPublishContext = inferCiPublishContext(githubCiConfig);
  const dryRun: boolean = getEnvCiPublishDryRun();
  const jobUrl: string = `${githubCiConfig.server_url}/${githubCiConfig.repository}/actions/runs/${githubCiConfig.run_id}`;

  if (!ciPublishContext.shouldPublish) {
    logger.info(
      `SKIP: CI publish disabled for ${githubCiConfig.event_name}:${ciPublishContext.branchName} (missing required PR label "dev").`,
    );
    return;
  }

  return ciPublish({
    ...ciPublishContext,
    rootDirectory: ROOT_DIR,
    dryRun,
    jobUrl,
    logger,
  });
});
