import { getEnvVariable } from '../../env/get-env-variable.ts';

export const ENV_KCHAT_WEBHOOK_ID = 'KCHAT_WEBHOOK_ID';

export function getEnvKchatWebhookId(): string {
  return getEnvVariable(ENV_KCHAT_WEBHOOK_ID);
}
