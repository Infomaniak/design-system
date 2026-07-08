import { join } from 'node:path';
import type { PackageJson } from '../../../../../../../scripts/helpers/file/package-json/package-json.ts';
import { readPackageJsonFile } from '../../../../../../../scripts/helpers/file/package-json/read-package-json-file.ts';
import { INFOMANIAK_GITHUB_ORGANIZATION } from '../../../../../../../scripts/helpers/github/constants/infomaniak-github-organization.constant.ts';
import { IOS_DESIGN_SYSTEM_REPOSITORY_NAME } from '../../../../../../../scripts/helpers/github/constants/ios-design-system-repository-name.constant.ts';
import { createGithubPullRequest } from '../../../../../../../scripts/helpers/github/pull-request/create-github-pull-request.ts';
import { getEnvCiPullRequestAuthTokenMobile } from '../../../../../../../scripts/helpers/github/pull-request/env/get-env-ci-pull-request-auth-token-mobile.ts';
import { Logger } from '../../../../../../../scripts/helpers/log/logger.ts';
import { generatePackageJsonBuildVersion } from '../../../../../../../scripts/helpers/npm/generate-package-json-build-version/generate-package-json-build-version.ts';
import type { PublishConfig } from '../../../../../../../scripts/helpers/publish/publish-config/publish-config.ts';
import { createIosPublishGithubBranch } from './create-ios-publish-github-branch.ts';

export interface PublishIosTokensOptions extends PublishConfig {
  readonly rootDirectory: string;
  readonly outputDirectory: string;
  readonly logger: Logger;
}

export async function publishIosTokens({
  rootDirectory,
  outputDirectory,
  // shared publish options
  mode,
  prerelease,
  logger,
}: PublishIosTokensOptions): Promise<void> {
  return logger.asyncTask('ios', async (logger: Logger): Promise<void> => {
    const { version }: PackageJson = await readPackageJsonFile(join(rootDirectory, 'package.json'));

    const publishVersion: string = generatePackageJsonBuildVersion({
      version,
      mode,
      prerelease,
    });

    const publishBranchName: string = `esds/${publishVersion}`;

    if (
      (
        await createIosPublishGithubBranch({
          logger,
          repositoryName: IOS_DESIGN_SYSTEM_REPOSITORY_NAME,
          packageDirectory: join(outputDirectory, 'ios'),
          version: publishVersion,
          branchName: publishBranchName,
        })
      ).length > 0
    ) {
      if (mode !== 'dev') {
        await createGithubPullRequest({
          owner: INFOMANIAK_GITHUB_ORGANIZATION,
          repository: IOS_DESIGN_SYSTEM_REPOSITORY_NAME,
          authToken: getEnvCiPullRequestAuthTokenMobile(),
          title: `chore: Update to ${publishVersion}`,
          body: `Update to ${publishVersion}`,
          head: publishBranchName,
          base: /*mode === 'rc' ? 'develop' : */ 'main', // TODO add support to `develop` branch when the repo will be ready
        });
      }
    }
  });
}
