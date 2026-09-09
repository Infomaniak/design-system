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
import { getEnvPublishConfig } from '../../../../../../scripts/helpers/publish/publish-config/env/get-env-publish-config.ts';
import type { PublishConfig } from '../../../../../../scripts/helpers/publish/publish-config/publish-config.ts';

const ROOT_DIR: string = join(dirname(fileURLToPath(import.meta.url)), '../../..');

const OUTPUT_DIR: string = join(ROOT_DIR, 'dist');

const OUTPUT_WEB_DIR: string = join(OUTPUT_DIR, 'web');

await runScript('publish-fonts', async (logger: Logger): Promise<void> => {
  const publishConfig: PublishConfig = getEnvPublishConfig();

  const { name, version } = await readPackageJsonFile(join(OUTPUT_WEB_DIR, 'package.json'));

  const releaseName: string = `${name}@${version}`;

  await logger.asyncTask('create-github-release', (logger: Logger): Promise<GithubRelease> => {
    return createGithubRelease({
      owner: INFOMANIAK_GITHUB_ORGANIZATION,
      repository: DESIGN_SYSTEM_REPOSITORY_NAME,
      authToken: getEnvCiDsUpdateAndPrAuthToken(),
      tagName: releaseName,
      name: releaseName,
      assetsDirectory: OUTPUT_WEB_DIR,
      logger,
      prerelease: publishConfig.mode !== 'prod',
      zip: true,
    });
  });
});
