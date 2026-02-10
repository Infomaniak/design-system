import { type ExpandedMergeRequestSchema } from '@gitbeaker/core';
import { type Logger } from '../../helpers/log/logger.ts';
import { postWebhookMessage } from '../../helpers/kchat/api/post-webhook-message.ts';
import { getEnvKchatWebhookId } from '../../helpers/kchat/env/get-env-kchat-webhook-id.ts';
import { getEnvKchatRecipient } from '../../helpers/kchat/env/get-env-kchat-recipient.ts';
import { getEnvProjectName } from '../../helpers/misc/get-env-project-name.ts';
import { getEnvGitlabJobUrl } from '../../helpers/gitlab/env/get-env-gitlab-job-url.ts';

export interface ProcessResult {
  mr?: ExpandedMergeRequestSchema;
  errors: Error[];
}

export async function notifyProcessCompletion(
  logger: Logger,
  processResult: ProcessResult,
): Promise<void> {
  logger.info('Notify process completion...');

  const message = buildMessage(processResult);

  if (!message) {
    logger.warn('Given process result has neither errors nor a mr. Nothing to notify.');
    return;
  }

  const recipient = getEnvKchatRecipient();

  if (!recipient) {
    logger.warn('Recipient is not defined. No notification has been sent.');
    return;
  }

  const webhookId = getEnvKchatWebhookId();

  await postWebhookMessage(webhookId, recipient, message);

  logger.info(`Notification sent to ${recipient}`);
}

function buildMessage(processResult: ProcessResult): string {
  return [
    buildMessageTitle(processResult),
    buildMessageForMr(processResult),
    buildMessageForErrors(processResult),
  ]
    .filter(Boolean)
    .join('\n')
    .trim();
}

function buildMessageTitle(processResult: ProcessResult): string {
  if (processResult.errors.length > 0) {
    return processResult.mr
      ? '#### :warning: The extraction process completed with warnings'
      : '#### :boom: The extraction process failed';
  }

  if (processResult.mr) {
    return '#### :white_check_mark: The extraction process has completed successfuly';
  }

  return '';
}

function buildMessageForMr({ mr }: ProcessResult): string {
  if (!mr) {
    return '';
  }

  const projectName = getEnvProjectName();
  const previewServerUrl = encodeURIComponent(
    `https://${mr.iid}.${projectName}.preprod.dev.infomaniak.ch`,
  );
  const previewCatalogUrl = `https://infomaniak.pages.infomaniak.com/design-system/svg/catalog/?endpoint=${previewServerUrl}`;

  return [
    `:eyes: See the new icons here: ${previewCatalogUrl}`,
    `:gitlab: Review the changes here: ${mr.web_url}`,
  ].join('\n');
}

function buildMessageForErrors({ errors }: ProcessResult): string {
  if (errors.length === 0) {
    return '';
  }

  const jobUrl = getEnvGitlabJobUrl();

  return [
    `See the detailed output here: ${jobUrl}`,
    ...errors.map((error) => '```\n' + error.message + '\n```'),
  ].join('\n');
}
