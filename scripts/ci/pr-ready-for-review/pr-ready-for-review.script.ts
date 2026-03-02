import { loadOptionallyEnvFile } from '../../helpers/env/load-env-file.ts';
import {
  getEnvGithubPullRequestDetails,
  type GithubPullRequestDetails,
} from '../../helpers/github/pull-request/env/get-env-github-pull-request-details.ts';
import { postKchatWebhookMessage } from '../../helpers/kchat/api/post-kchat-webhook-message.ts';
import { getEnvKchatWebhookId } from '../../helpers/kchat/env/get-env-kchat-webhook-id.ts';
import { DEFAULT_LOG_LEVEL } from '../../helpers/log/log-level/defaults/default-log-level.ts';
import { Logger } from '../../helpers/log/logger.ts';
import { dedent } from '../../helpers/misc/string/dedent/dedent.ts';

const logger = Logger.root({ logLevel: DEFAULT_LOG_LEVEL });

function prReadyForReviewScript(): Promise<void> {
  return logger.asyncTask('on-pull-request-ready.script', async (logger: Logger): Promise<void> => {
    loadOptionallyEnvFile(logger);

    const details: GithubPullRequestDetails = getEnvGithubPullRequestDetails();

    await logger.asyncTask('send-kchat-notification', async (): Promise<void> => {
      await postKchatWebhookMessage({
        webhookId: getEnvKchatWebhookId(),
        text: dedent`
          #### 🚀 new pull request: ${details.title}

          - 🔗 ${details.html_url}
          - 🧑 ${details.user.login}
        `,
      });
    });
  });
}

try {
  await prReadyForReviewScript();
} catch (error: unknown) {
  logger.fatal(error);
}
