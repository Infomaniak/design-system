import { loadOptionallyEnvFile } from '../../env/env-file/load-optionally-env-file.ts';
import { postKchatWebhookMessage } from '../../kchat/api/post-kchat-webhook-message.ts';
import { getEnvKchatWebhookId } from '../../kchat/env/get-env-kchat-webhook-id.ts';
import { DEFAULT_LOG_LEVEL } from '../../log/log-level/defaults/default-log-level.ts';
import { Logger, type LoggerOptions } from '../../log/logger.ts';
import { dedent } from '../string/dedent/dedent.ts';
import { getEnvShouldNotify } from './env/get-env-should-notify.ts';
import type { RunScriptNotification } from './notification/run-script-notification.ts';
import { ScriptFailedError } from './notification/script-failed-error.ts';

export interface RunScriptOptions extends LoggerOptions {
  readonly notifyError?: boolean;
}

export async function runScript(
  name: string,
  script: (
    logger: Logger,
  ) =>
    | PromiseLike<RunScriptNotification | void | undefined>
    | RunScriptNotification
    | void
    | undefined,
  { notifyError, logLevel = DEFAULT_LOG_LEVEL }: RunScriptOptions = {},
): Promise<void> {
  const logger: Logger = Logger.root({ logLevel });

  try {
    await logger.asyncTask(`${name}.script`, async (logger: Logger): Promise<void> => {
      let successNotification: RunScriptNotification | void | undefined;

      try {
        loadOptionallyEnvFile(logger);

        successNotification = await script(logger);
      } catch (error: unknown) {
        notifyError ??= getEnvShouldNotify();
        if (notifyError) {
          try {
            await logger.asyncTask('send-kchat-notification', async (): Promise<void> => {
              const notificationTitle: string =
                error instanceof ScriptFailedError ? (error.notificationTitle ?? '') : '';
              const notificationMessage: string =
                error instanceof ScriptFailedError ? (error.notificationMessage ?? '') : '';

              await postKchatWebhookMessage({
                webhookId: getEnvKchatWebhookId(),
                text: dedent`
                  #### ❌ Script "${name}" failed${notificationTitle === '' ? '' : ` - ${notificationTitle}`}

                  - 💬 ${Error.isError(error) ? error.message : String(error)}
                  ${notificationMessage}
                `,
              });
            });
          } catch (childError: unknown) {
            throw new SuppressedError(childError, error);
          }
        }

        throw error;
      }

      if (successNotification !== undefined && getEnvShouldNotify()) {
        await logger.asyncTask('send-kchat-notification', async (): Promise<void> => {
          const notificationTitle: string = successNotification.notificationTitle ?? '';
          const notificationMessage: string = successNotification.notificationMessage ?? '';

          await postKchatWebhookMessage({
            webhookId: getEnvKchatWebhookId(),
            text: dedent`
              #### ✅ Script "${name}" succeeded${notificationTitle === '' ? '' : ` - ${notificationTitle}`}

              ${notificationMessage}
            `,
          });
        });
      }
    });
  } catch (error: unknown) {
    logger.fatal(error);
  }
}
