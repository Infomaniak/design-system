import { rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadOptionallyEnvFile } from '../../../../../../../scripts/helpers/env/load-env-file.ts';
import { getEnvFigmaApiToken } from '../../../../../../../scripts/helpers/figma/env/get-env-figma-api-token.ts';
import { getEnvFigmaIconFileKey } from '../../../../../../../scripts/helpers/figma/env/get-env-figma-icon-file-key.ts';
import { DEFAULT_LOG_LEVEL } from '../../../../../../../scripts/helpers/log/log-level/defaults/default-log-level.ts';
import { Logger } from '../../../../../../../scripts/helpers/log/logger.ts';
import { importIconsAndIllustrations } from './src/import/import-icons-and-illustrations.ts';

const ROOT_DIR: string = join(dirname(fileURLToPath(import.meta.url)), '../../..');

const OUTPUT_DIR: string = join(ROOT_DIR, 'dist');

const logger = Logger.root({ logLevel: DEFAULT_LOG_LEVEL });

function onFigmaCommitScript(): Promise<void> {
  return logger.asyncTask('on-figma-commit.script', async (logger: Logger): Promise<void> => {
    loadOptionallyEnvFile(logger);

    await rm(OUTPUT_DIR, { force: true, recursive: true });

    await importIconsAndIllustrations({
      figmaAPIToken: getEnvFigmaApiToken(),
      figmaSourceFileKey: getEnvFigmaIconFileKey(),
      outputDirectory: OUTPUT_DIR,
      logger,
    });

    // let mr: ExpandedMergeRequestSchema | undefined;
    // try {
    //   mr = await createIconsAndIllustrationMergeRequest(logger.child('GIT'));
    // } catch (mrError: unknown) {
    //   errors.push(mrError as Error);
    // }

    // await notifyProcessCompletion(logger.child('KCHAT'), { mr, errors });

    // await postKchatWebhookMessage({
    //   webhookId: getEnvKchatWebhookId(),
    //   text: 'Test',
    // });
  });
}

try {
  await onFigmaCommitScript();
} catch (error: unknown) {
  logger.fatal(error);
}
