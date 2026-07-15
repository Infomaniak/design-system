import { isFigmaWebhookV2FileVersionUpdateEvent } from '../../helpers/figma/api/webhooks/types/event/built-in/file-version-update/figma-webhook-v2-file-version-update-event.ts';
import type { FigmaWebhookV2Event } from '../../helpers/figma/api/webhooks/types/event/figma-webhook-v2-event.ts';
import { getEnvFigmaIconFileKey } from '../../helpers/figma/env/get-env-figma-icon-file-key.ts';
import { getEnvFigmaWebhookEvent } from '../../helpers/figma/env/get-env-figma-webhook-event.ts';
import { Logger } from '../../helpers/log/logger.ts';
import { execCommandInherit } from '../../helpers/misc/exec-command.ts';
import { ENV_SHOULD_NOTIFY } from '../../helpers/misc/run-script/env/get-env-should-notify.ts';
import { runScript } from '../../helpers/misc/run-script/run-script.ts';

await runScript('on-figma-event', async (logger: Logger): Promise<void> => {
  const { passcode, ...figmaWebhookEvent }: FigmaWebhookV2Event = getEnvFigmaWebhookEvent();
  const figmaIconFileKey: string = getEnvFigmaIconFileKey();

  if (passcode !== undefined) {
    // NOTE: Intermediate server MUST remove passcode.
    throw new Error('Invalid Figma event passcode.');
  }

  if (
    isFigmaWebhookV2FileVersionUpdateEvent(figmaWebhookEvent) &&
    figmaWebhookEvent.file_key === figmaIconFileKey
  ) {
    await execCommandInherit(logger, 'yarn', ['run', 'import:assets:images:svg'], {
      env: {
        ...process.env,
        [ENV_SHOULD_NOTIFY]: 'false',
      },
    });
  } else {
    logger.warn(`Unexpected Figma event: ${JSON.stringify(figmaWebhookEvent)}`);
  }
});
