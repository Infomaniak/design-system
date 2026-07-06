import { rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { compare } from 'semver';
import { getLastFigmaFileVersion } from '../../../../../../../scripts/helpers/figma/api/version-history/helpers/get-last-figma-file-version.ts';
import type { FigmaFileVersion } from '../../../../../../../scripts/helpers/figma/api/version-history/types/figma-file-version.ts';
import { isFigmaWebhookV2FileVersionUpdateEvent } from '../../../../../../../scripts/helpers/figma/api/webhooks/types/event/built-in/file-version-update/figma-webhook-v2-file-version-update-event.ts';
import type { FigmaWebhookV2Event } from '../../../../../../../scripts/helpers/figma/api/webhooks/types/event/figma-webhook-v2-event.ts';
import { getEnvFigmaApiToken } from '../../../../../../../scripts/helpers/figma/env/get-env-figma-api-token.ts';
import { getEnvFigmaIconFileKey } from '../../../../../../../scripts/helpers/figma/env/get-env-figma-icon-file-key.ts';
import { getEnvFigmaWebhookEvent } from '../../../../../../../scripts/helpers/figma/env/get-env-figma-webhook-event.ts';
import type { PackageJson } from '../../../../../../../scripts/helpers/file/package-json/package-json.ts';
import { readPackageJsonFile } from '../../../../../../../scripts/helpers/file/package-json/read-package-json-file.ts';
import { writeJsonFileSafe } from '../../../../../../../scripts/helpers/file/write-json-file-safe.ts';
import { doesGitBranchExistOnRemote } from '../../../../../../../scripts/helpers/git/does-git-branch-exist-on-remote.ts';
import { getEnvCiDsUpdateAndPrAuthToken } from '../../../../../../../scripts/helpers/github/env/get-env-ci-ds-update-and-pr-auth-token.ts';
import { Logger } from '../../../../../../../scripts/helpers/log/logger.ts';
import { execCommandInherit } from '../../../../../../../scripts/helpers/misc/exec-command.ts';
import { runScript } from '../../../../../../../scripts/helpers/misc/run-script/run-script.ts';
import { importIconsAndIllustrations } from './src/import/import-icons-and-illustrations.ts';
import { createImportSvgPullRequests } from './src/pull-request/create-import-svgs-pull-request.ts';

const ROOT_DIR: string = join(dirname(fileURLToPath(import.meta.url)), '../../..');
const OUTPUT_DIR: string = join(ROOT_DIR, 'dist');
const OUTPUT_ASSETS_DIR: string = join(OUTPUT_DIR, 'assets');
const WORKSPACE_ROOT_DIR: string = join(ROOT_DIR, '../../../..');

await runScript('import-svgs', async (logger: Logger): Promise<void> => {
  await rm(OUTPUT_DIR, { force: true, recursive: true });

  const figmaApiToken: string = getEnvFigmaApiToken();
  const figmaIconFileKey: string = getEnvFigmaIconFileKey();
  const figmaWebhookEvent: FigmaWebhookV2Event = getEnvFigmaWebhookEvent();
  const updateRepositoryAndCreatePullRequestAuthToken: string = getEnvCiDsUpdateAndPrAuthToken();

  if (!isFigmaWebhookV2FileVersionUpdateEvent(figmaWebhookEvent)) {
    throw new Error('Invalid Figma webhook event.');
  }

  const importVersion: string = figmaWebhookEvent.label;
  const branchName: string = `feat/import-icons--${importVersion}`;

  const packageJson: PackageJson = await readPackageJsonFile(join(ROOT_DIR, 'package.json'));

  const skip: boolean = await logger.asyncTask(
    'check-import-validity',
    async (): Promise<boolean> => {
      return false; // TODO
      const { version: currentVersion } = packageJson;

      const compareResult: number = compare(currentVersion, importVersion);

      if (compareResult === 0) {
        logger.info(
          `Skipping import of new assets from Figma because the import version "${importVersion}" is equal to the current version.`,
        );
        return true;
      }

      if (compareResult === 1) {
        throw new Error(
          `The import version "${importVersion}" must be greater than the current version "${currentVersion}".`,
        );
      }

      if (await doesGitBranchExistOnRemote({ branchName })) {
        logger.info(
          `Skipping import of new assets from Figma because the branch ${JSON.stringify(branchName)} with the import version "${importVersion}" already exists on the remote.`,
        );
        return true;
      }

      const lastVersion: FigmaFileVersion | undefined = await getLastFigmaFileVersion({
        figmaApiToken,
        figmaFileKey: figmaIconFileKey,
      });

      if (lastVersion === undefined) {
        throw new Error('No version found.');
      }

      if (compare(lastVersion.label!, importVersion) !== 0) {
        throw new Error(
          `Last file version "${lastVersion.label!}" differ from the received import version "${importVersion}".`,
        );
      }

      logger.info(`Importing new assets from Figma with version "${importVersion}".`);

      return false;
    },
  );

  if (skip) {
    return;
  }

  console.log(getEnvFigmaApiToken(), figmaIconFileKey);
  const hasNewAssets: boolean = await importIconsAndIllustrations({
    figmaAPIToken: getEnvFigmaApiToken(),
    figmaSourceFileKey: figmaIconFileKey,
    // figmaSourceFileKey: getEnvFigmaIllustrationFileKey(), // TODO
    outputDirectory: OUTPUT_ASSETS_DIR,
    version: importVersion,
    logger,
  });

  return; // TODO

  if (!hasNewAssets) {
    throw new Error('No new assets have been imported from Figma.');
  }

  // update package.json version
  await writeJsonFileSafe(join(OUTPUT_DIR, 'package.json'), {
    ...packageJson,
    version: importVersion,
  });

  // ensure package.json is properly formatted
  await execCommandInherit(logger, 'yarn', ['install'], {
    cwd: WORKSPACE_ROOT_DIR,
  });

  await createImportSvgPullRequests({
    outputDirectory: OUTPUT_DIR,
    packageRootDirectory: ROOT_DIR,
    workspaceRootDirectory: WORKSPACE_ROOT_DIR,
    version: importVersion,
    branchName,
    updateRepositoryAndCreatePullRequestAuthToken,
    logger,
  });
});
