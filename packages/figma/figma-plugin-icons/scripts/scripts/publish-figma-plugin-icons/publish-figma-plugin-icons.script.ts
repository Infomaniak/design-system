import { cp, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { readPackageJsonFile } from '../../../../../../scripts/helpers/file/package-json/read-package-json-file.ts';
import type { GithubRelease } from '../../../../../../scripts/helpers/github/api/types.ts';
import { DESIGN_SYSTEM_REPOSITORY_NAME } from '../../../../../../scripts/helpers/github/constants/design-system-repository-name.constant.ts';
import { INFOMANIAK_GITHUB_ORGANIZATION } from '../../../../../../scripts/helpers/github/constants/infomaniak-github-organization.constant.ts';
import { getEnvCiDsUpdateAndPrAuthToken } from '../../../../../../scripts/helpers/github/env/get-env-ci-ds-update-and-pr-auth-token.ts';
import { createGithubRelease } from '../../../../../../scripts/helpers/github/release/create-github-release.ts';
import type { Logger } from '../../../../../../scripts/helpers/log/logger.ts';
import { runScript } from '../../../../../../scripts/helpers/misc/run-script/run-script.ts';
import { generatePackageJsonBuildVersion } from '../../../../../../scripts/helpers/npm/generate-package-json-build-version/generate-package-json-build-version.ts';
import { getEnvPublishConfig } from '../../../../../../scripts/helpers/publish/publish-config/env/get-env-publish-config.ts';
import type { PublishConfig } from '../../../../../../scripts/helpers/publish/publish-config/publish-config.ts';

const ROOT_DIR: string = join(dirname(fileURLToPath(import.meta.url)), '../../..');

const OUTPUT_DIR: string = join(ROOT_DIR, 'dist');

await runScript('publish-figma-plugin-icons', async (logger: Logger): Promise<void> => {
  const publishConfig: PublishConfig = getEnvPublishConfig();

  const { name, version } = await readPackageJsonFile(join(ROOT_DIR, 'package.json'));

  const releaseName: string = `${name}@${generatePackageJsonBuildVersion({
    version,
    mode: publishConfig.mode,
    prerelease: publishConfig.prerelease,
  })}`;

  await logger.asyncTask(
    'create-github-release',
    async (logger: Logger): Promise<GithubRelease> => {
      const stagingDirectory: string = await stageReleaseAssets(logger);

      try {
        return await createGithubRelease({
          owner: INFOMANIAK_GITHUB_ORGANIZATION,
          repository: DESIGN_SYSTEM_REPOSITORY_NAME,
          authToken: getEnvCiDsUpdateAndPrAuthToken(),
          tagName: releaseName,
          name: releaseName,
          assetsDirectory: stagingDirectory,
          zip: true,
          zipFileName: 'esds-icons.zip',
          prerelease: publishConfig.mode !== 'prod',
          skipIfExists: true,
          logger,
        });
      } finally {
        await rm(stagingDirectory, { recursive: true, force: true });
      }
    },
  );
});

/*---*/

/**
 * Stages the plugin files to upload as release assets in a temporary directory:
 * `manifest.json` at the root and the built plugin (`code.js`, `ui.html`) under
 * `dist/`, so the relative paths referenced by the manifest keep resolving
 * after unzip. The archive is created from this directory's content only,
 * excluding sources and dependencies.
 */
async function stageReleaseAssets(logger: Logger): Promise<string> {
  const stagingDirectory: string = await mkdtemp(join(tmpdir(), 'figma-plugin-release-'));

  await cp(join(ROOT_DIR, 'manifest.json'), join(stagingDirectory, 'manifest.json'));
  await cp(OUTPUT_DIR, join(stagingDirectory, 'dist'), { recursive: true });

  logger.debug(`Staged release assets in ${stagingDirectory}`);

  return stagingDirectory;
}
