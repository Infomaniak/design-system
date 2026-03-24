import { rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isFigmaWebhookV2FileVersionUpdateEvent } from '../../../../../../../scripts/helpers/figma/api/webhooks/types/event/built-in/file-version-update/figma-webhook-v2-file-version-update-event.ts';
import type { FigmaWebhookV2Event } from '../../../../../../../scripts/helpers/figma/api/webhooks/types/event/figma-webhook-v2-event.ts';
import { getEnvFigmaApiToken } from '../../../../../../../scripts/helpers/figma/env/get-env-figma-api-token.ts';
import { getEnvFigmaIconFileKey } from '../../../../../../../scripts/helpers/figma/env/get-env-figma-icon-file-key.ts';
import { getEnvFigmaWebhookEvent } from '../../../../../../../scripts/helpers/figma/env/get-env-figma-webhook-event.ts';
import { getEnvCiPullRequestAuthTokenDesignSystem } from '../../../../../../../scripts/helpers/github/pull-request/env/get-env-ci-pull-request-auth-token-design-system.ts';
import { Logger } from '../../../../../../../scripts/helpers/log/logger.ts';
import { runScript } from '../../../../../../../scripts/helpers/misc/run-script/run-script.ts';
import { importIconsAndIllustrations } from './src/import/import-icons-and-illustrations.ts';
import { createImportSvgPullRequests } from './src/pull-request/create-import-svgs-pull-request.ts';

const ROOT_DIR: string = join(dirname(fileURLToPath(import.meta.url)), '../../..');
const OUTPUT_DIR: string = join(ROOT_DIR, 'dist');
const OUTPUT_ASSETS_DIR: string = join(OUTPUT_DIR, 'assets');
const WORKSPACE_ROOT_DIR: string = join(ROOT_DIR, '../../../..');

await runScript('import-svgs', async (logger: Logger): Promise<void> => {
  await rm(OUTPUT_DIR, { force: true, recursive: true });

  const figmaWebhookEvent: FigmaWebhookV2Event = getEnvFigmaWebhookEvent();

  if (!isFigmaWebhookV2FileVersionUpdateEvent(figmaWebhookEvent)) {
    throw new Error('Invalid Figma webhook event.');
  }

  const version: string = figmaWebhookEvent.label;

  if (!/\d+\.\d+\.\d+/.test(version)) {
    throw new Error(`Figma webhook event version is invalid: ${version}.`);
  }

  const hasNewAssets: boolean = await importIconsAndIllustrations({
    figmaAPIToken: getEnvFigmaApiToken(),
    figmaSourceFileKey: getEnvFigmaIconFileKey(),
    // figmaSourceFileKey: getEnvFigmaIllustrationFileKey(), // TODO
    outputDirectory: OUTPUT_ASSETS_DIR,
    logger,
  });

  if (!hasNewAssets) {
    throw new Error('No new assets have been imported from Figma.');
  }

  await createImportSvgPullRequests({
    outputDirectory: OUTPUT_DIR,
    packageRootDirectory: ROOT_DIR,
    workspaceRootDirectory: WORKSPACE_ROOT_DIR,
    version,
    pullRequestAuthToken: getEnvCiPullRequestAuthTokenDesignSystem(),
    logger,
  });
});
