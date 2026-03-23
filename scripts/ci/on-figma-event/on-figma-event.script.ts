import { loadOptionallyEnvFile } from '../../helpers/env/env-file/load-optionally-env-file.ts';
import type { FigmaWebhookV2Event } from '../../helpers/figma/api/webhooks/types/figma-webhook-v2-event.ts';
import { getEnvFigmaEvent } from '../../helpers/figma/env/get-env-figma-event.ts';
import { getEnvFigmaIconFileKey } from '../../helpers/figma/env/get-env-figma-icon-file-key.ts';
import { DEFAULT_LOG_LEVEL } from '../../helpers/log/log-level/defaults/default-log-level.ts';
import { Logger } from '../../helpers/log/logger.ts';
import { execCommandInherit } from '../../helpers/misc/exec-command.ts';

const logger = Logger.root({ logLevel: DEFAULT_LOG_LEVEL });

export async function onFigmaEventScript(): Promise<void> {
  return logger.asyncTask('on-figma-event.script', async (logger: Logger): Promise<void> => {
    loadOptionallyEnvFile(logger);

    const { passcode, ...figmaEvent }: FigmaWebhookV2Event = getEnvFigmaEvent();
    const figmaIconFileKey: string = getEnvFigmaIconFileKey();

    if (passcode !== undefined) {
      // NOTE: CI should remove passcode.
      throw new Error('Invalid Figma event passcode.');
    }

    if (
      figmaEvent.event_type === 'FILE_VERSION_UPDATE' &&
      figmaEvent.file_key === figmaIconFileKey
    ) {
      await execCommandInherit(logger, 'yarn', ['run', 'import:assets:images:svg']);
    } else {
      logger.info('Received unknown Figma event:', figmaEvent);
    }
  });
}

try {
  await onFigmaEventScript();
} catch (error: unknown) {
  logger.fatal(error);
}
