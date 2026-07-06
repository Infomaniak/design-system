import { loadOptionallyEnvFile } from '../../env/env-file/load-optionally-env-file.ts';
import { postKchatWebhookMessage } from '../../kchat/api/post-kchat-webhook-message.ts';
import { getEnvKchatWebhookId } from '../../kchat/env/get-env-kchat-webhook-id.ts';
import { DEFAULT_LOG_LEVEL } from '../../log/log-level/defaults/default-log-level.ts';
import { Logger, type LoggerOptions } from '../../log/logger.ts';
import { dedent } from '../string/dedent/dedent.ts';
import { getEnvShouldNotify } from './env/get-env-should-notify.ts';
import { ScriptFailedError } from './script-failed-error.ts';

export interface RunScriptOptions extends LoggerOptions {
  readonly notifyError?: boolean;
}

export async function runScript(
  name: string,
  script: (logger: Logger) => PromiseLike<void> | void,
  { notifyError, logLevel = DEFAULT_LOG_LEVEL }: RunScriptOptions = {},
): Promise<void> {
  const logger: Logger = Logger.root({ logLevel });

  try {
    await logger.asyncTask(`${name}.script`, async (logger: Logger): Promise<void> => {
      try {
        loadOptionallyEnvFile(logger);

        await script(logger);
      } catch (error: unknown) {
        notifyError ??= getEnvShouldNotify();
        if (notifyError) {
          try {
            await logger.asyncTask('send-kchat-notification', async (): Promise<void> => {
              const extraTitle: string =
                error instanceof ScriptFailedError ? (error.title ?? '') : '';
              const extraMessage: string =
                error instanceof ScriptFailedError ? (error.extra ?? '') : '';

              await postKchatWebhookMessage({
                webhookId: getEnvKchatWebhookId(),
                text: dedent`
                  #### ❌ Script "${name}" failed${extraTitle === '' ? '' : ` - ${extraTitle}`}
  
                  - 💬 ${Error.isError(error) ? error.message : String(error)}
                  ${extraMessage}
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
