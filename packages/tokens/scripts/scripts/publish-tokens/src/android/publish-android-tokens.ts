import { join } from 'node:path';
import type { PackageJson } from '../../../../../../../scripts/helpers/file/package-json/package-json.ts';
import { readPackageJsonFile } from '../../../../../../../scripts/helpers/file/package-json/read-package-json-file.ts';
import { ANDROID_DESIGN_SYSTEM_REPOSITORY_NAME } from '../../../../../../../scripts/helpers/github/constants/android-design-system-repository-name.constant.ts';
import { INFOMANIAK_GITHUB_ORGANIZATION } from '../../../../../../../scripts/helpers/github/constants/infomaniak-github-organization.constant.ts';
import { createGithubPullRequest } from '../../../../../../../scripts/helpers/github/pull-request/create-github-pull-request.ts';
import { getEnvCiPullRequestAuthTokenMobile } from '../../../../../../../scripts/helpers/github/pull-request/env/get-env-ci-pull-request-auth-token-mobile.ts';
import { Logger } from '../../../../../../../scripts/helpers/log/logger.ts';
import { generatePackageJsonBuildVersion } from '../../../../../../../scripts/helpers/npm/generate-package-json-build-version/generate-package-json-build-version.ts';
import type { PublishConfig } from '../../../../../../../scripts/helpers/publish/publish-config/publish-config.ts';
import { createAndroidPublishGithubBranch } from './create-android-publish-github-branch.ts';

export interface PublishAndroidTokensOptions extends PublishConfig {
  readonly rootDirectory: string;
  readonly outputDirectory: string;
  readonly logger: Logger;
}

export async function publishAndroidTokens({
  rootDirectory,
  outputDirectory,
  // shared publish options
  mode,
  prerelease,
  logger,
}: PublishAndroidTokensOptions): Promise<void> {
  return logger.asyncTask('android', async (logger: Logger): Promise<void> => {
    const { version }: PackageJson = await readPackageJsonFile(join(rootDirectory, 'package.json'));

    const publishVersion: string = generatePackageJsonBuildVersion({
      version,
      mode,
      prerelease,
    });

    const publishBranchName: string = `esds/${publishVersion}`;

    if (
      (
        await createAndroidPublishGithubBranch({
          logger,
          repositoryName: ANDROID_DESIGN_SYSTEM_REPOSITORY_NAME,
          packageDirectory: join(outputDirectory, 'kotlin'),
          version: publishVersion,
          branchName: publishBranchName,
        })
      ).length > 0
    ) {
      await createGithubPullRequest({
        owner: INFOMANIAK_GITHUB_ORGANIZATION,
        repository: ANDROID_DESIGN_SYSTEM_REPOSITORY_NAME,
        authToken: getEnvCiPullRequestAuthTokenMobile(),
        title: `chore: Update to ${publishVersion}`,
        body: `Update to ${publishVersion}`,
        head: publishBranchName,
        base: 'main',
      });
    } else {
      logger.info('SKIP (non-blocking): No changes to publish');
    }
  });
}
