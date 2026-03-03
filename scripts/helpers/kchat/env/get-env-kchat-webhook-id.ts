import { getEnvVariable } from '../../env/get-env-variable.ts';

export function getEnvKchatWebhookId(): string {
  return getEnvVariable('KCHAT_WEBHOOK_ID');
}
