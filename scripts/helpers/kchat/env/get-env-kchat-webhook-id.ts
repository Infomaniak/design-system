import { getEnvVariable } from '../../env/get-env-variable.ts';

export const KCHAT_WEBHOOK_ID = 'KCHAT_WEBHOOK_ID';

export function getEnvKchatWebhookId(): string {
  return getEnvVariable(KCHAT_WEBHOOK_ID);
}
