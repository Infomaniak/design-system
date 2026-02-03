import { type KchatWebhookMessage } from '../types/kchat-webhook-message.ts';

export interface PostKchatWebhookMessageOptions {
  readonly webhookId: string;
  readonly text: string;
  readonly channel?: string;
  readonly username?: string;
  readonly icon_url?: string;
  readonly icon_emoji?: string;
  readonly attachments?: readonly unknown[];
  readonly type?: `custom_${string}`;
}

export async function postKchatWebhookMessage({
  webhookId,
  ...options
}: PostKchatWebhookMessageOptions): Promise<KchatWebhookMessage> {
  const response: Response = await fetch(
    `https://infomaniak.kchat.infomaniak.com/hooks/${webhookId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    },
  );

  return response.json();
}
