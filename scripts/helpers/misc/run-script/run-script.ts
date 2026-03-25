import { loadOptionallyEnvFile } from '../../env/env-file/load-optionally-env-file.ts';
import { postKchatWebhookMessage } from '../../kchat/api/post-kchat-webhook-message.ts';
import { getEnvKchatWebhookId } from '../../kchat/env/get-env-kchat-webhook-id.ts';
import { DEFAULT_LOG_LEVEL } from '../../log/log-level/defaults/default-log-level.ts';
import { Logger, type LoggerOptions } from '../../log/logger.ts';
import { dedent } from '../string/dedent/dedent.ts';
import { getEnvIsSubScript } from './env/get-env-is-sub-script.ts';

export interface RunScriptOptions extends LoggerOptions {
  readonly skipKChatNotificationOnError?: boolean;
}

export async function runScript(
  name: string,
  script: (logger: Logger) => PromiseLike<void> | void,
  {
    skipKChatNotificationOnError = getEnvIsSubScript(),
    logLevel = DEFAULT_LOG_LEVEL,
  }: RunScriptOptions = {},
): Promise<void> {
  const logger: Logger = Logger.root({ logLevel });

  try {
    await logger.asyncTask(`${name}.script`, async (logger: Logger): Promise<void> => {
      try {
        loadOptionallyEnvFile(logger);

        await script(logger);
      } catch (error: unknown) {
        if (!skipKChatNotificationOnError) {
          try {
            await logger.asyncTask('send-kchat-notification', async (): Promise<void> => {
              await postKchatWebhookMessage({
                webhookId: getEnvKchatWebhookId(),
                text: dedent`
                #### ❌ Script "${name}" failed

                - 💬 ${Error.isError(error) ? error.message : String(error)}
              `,
              });
            });
          } catch (childError: unknown) {
            throw new SuppressedError(childError, error);
          }
        }

        throw error;
      }
    });
  } catch (error: unknown) {
    logger.fatal(error);
  }
}
