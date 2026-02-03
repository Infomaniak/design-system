import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnvFile } from '../../../../../../../scripts/helpers/env/load-env-file.ts';
import { postKchatWebhookMessage } from '../../../../../../../scripts/helpers/kchat/api/post-kchat-webhook-message.ts';
import { getEnvKchatWebhookId } from '../../../../../../../scripts/helpers/kchat/env/get-env-kchat-webhook-id.ts';
import { DEFAULT_LOG_LEVEL } from '../../../../../../../scripts/helpers/log/log-level/defaults/default-log-level.ts';
import { Logger } from '../../../../../../../scripts/helpers/log/logger.ts';

/*
doc:
 - gitlab:
   - https://docs.gitlab.com/ee/ci/variables/predefined_variables.html
 */

const ROOT_DIR: string = join(dirname(fileURLToPath(import.meta.url)), '../../..');

const OUTPUT_DIR: string = join(ROOT_DIR, 'dist');

const logger = Logger.root({ logLevel: DEFAULT_LOG_LEVEL });

function onFigmaCommitScript(): Promise<void> {
  return logger.asyncTask('on-figma-commit.script', async (logger: Logger): Promise<void> => {
    loadEnvFile();

    // await importIconsAndIllustrations({
    //   figmaSourceFileKey: getEnvFigmaIconFileKey(),
    //   outputDirectory: OUTPUT_DIR,
    //   logger,
    // });

    // let mr: ExpandedMergeRequestSchema | undefined;
    // try {
    //   mr = await createIconsAndIllustrationMergeRequest(logger.child('GIT'));
    // } catch (mrError: unknown) {
    //   errors.push(mrError as Error);
    // }

    // await notifyProcessCompletion(logger.child('KCHAT'), { mr, errors });

    await postKchatWebhookMessage({
      webhookId: getEnvKchatWebhookId(),
      text: 'Test',
    });
  });
}

try {
  await onFigmaCommitScript();
} catch (error: unknown) {
  logger.fatal(error);
}
