import { rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { compare } from 'semver';
import { isFigmaWebhookV2FileVersionUpdateEvent } from '../../../../../../../scripts/helpers/figma/api/webhooks/types/event/built-in/file-version-update/figma-webhook-v2-file-version-update-event.ts';
import type { FigmaWebhookV2Event } from '../../../../../../../scripts/helpers/figma/api/webhooks/types/event/figma-webhook-v2-event.ts';
import { getEnvFigmaApiToken } from '../../../../../../../scripts/helpers/figma/env/get-env-figma-api-token.ts';
import { getEnvFigmaIconFileKey } from '../../../../../../../scripts/helpers/figma/env/get-env-figma-icon-file-key.ts';
import { getEnvFigmaWebhookEvent } from '../../../../../../../scripts/helpers/figma/env/get-env-figma-webhook-event.ts';
import type { PackageJson } from '../../../../../../../scripts/helpers/file/package-json/package-json.ts';
import { readPackageJsonFile } from '../../../../../../../scripts/helpers/file/package-json/read-package-json-file.ts';
import { doesGitBranchExistOnRemote } from '../../../../../../../scripts/helpers/git/does-git-branch-exist-on-remote.ts';
import { getEnvCiUpdateDesignSystemRepoAndCreatePullRequestAuthToken } from '../../../../../../../scripts/helpers/github/env/get-env-ci-update-design-system-repo-and-create-pull-request-auth-token.ts';
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

  const importVersion: string = figmaWebhookEvent.label;
  const branchName: string = `feat/import-icons--${importVersion}`;

  const skip: boolean = await logger.asyncTask(
    'check-import-validity',
    async (): Promise<boolean> => {
      const { version: currentVersion }: PackageJson = await readPackageJsonFile(
        join(ROOT_DIR, 'package.json'),
      );

      const compareResult: number = compare(currentVersion, importVersion);

      if (compareResult === 0) {
        logger.info(
          `Skipping import of new assets from Figma because the import version "${importVersion}" is equal to the current version.`,
        );
        return true;
      } else if (compareResult === 1) {
        throw new Error(
          `The import version "${importVersion}" must be greater than the current version "${currentVersion}".`,
        );
      } else if (await doesGitBranchExistOnRemote({ branchName })) {
        logger.info(
          `Skipping import of new assets from Figma because the branch ${JSON.stringify(branchName)} with the import version "${importVersion}" already exists on the remote.`,
        );
        return true;
      } else {
        logger.info(`Importing new assets from Figma with version "${importVersion}".`);
        return false;
      }
    },
  );

  if (skip) {
    return;
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
    version: importVersion,
    branchName,
    updateRepositoryAndCreatePullRequestAuthToken:
      getEnvCiUpdateDesignSystemRepoAndCreatePullRequestAuthToken(),
    logger,
  });
});
