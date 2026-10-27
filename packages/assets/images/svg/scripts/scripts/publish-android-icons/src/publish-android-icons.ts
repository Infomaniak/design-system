import { join } from 'node:path';
import type { PackageJson } from '../../../../../../../../scripts/helpers/file/package-json/package-json.ts';
import { readPackageJsonFile } from '../../../../../../../../scripts/helpers/file/package-json/read-package-json-file.ts';
import type { GitChanges } from '../../../../../../../../scripts/helpers/git/git-changes.ts';
import { deleteGithubObsoletePublishBranches } from '../../../../../../../../scripts/helpers/github/branch/delete-github-obsolete-publish-branches.ts';
import { ANDROID_DESIGN_SYSTEM_REPOSITORY_NAME } from '../../../../../../../../scripts/helpers/github/constants/android-design-system-repository-name.constant.ts';
import { INFOMANIAK_GITHUB_ORGANIZATION } from '../../../../../../../../scripts/helpers/github/constants/infomaniak-github-organization.constant.ts';
import { createGithubPullRequest } from '../../../../../../../../scripts/helpers/github/pull-request/create-github-pull-request.ts';
import { getEnvCiPullRequestAuthTokenMobile } from '../../../../../../../../scripts/helpers/github/pull-request/env/get-env-ci-pull-request-auth-token-mobile.ts';
import type { Logger } from '../../../../../../../../scripts/helpers/log/logger.ts';
import { generatePackageJsonBuildVersion } from '../../../../../../../../scripts/helpers/npm/generate-package-json-build-version/generate-package-json-build-version.ts';
import type { PublishConfig } from '../../../../../../../../scripts/helpers/publish/publish-config/publish-config.ts';
import { createAndroidIconsPublishGithubBranch } from './create-android-icons-publish-github-branch.ts';

export interface PublishAndroidIconsOptions extends PublishConfig {
  readonly logger: Logger;
  /** Root directory of the `@infomaniak-design-system/svg-assets` package. */
  readonly packageRootDirectory: string;
  /** Directory containing the generated `<IconName>.kt` ImageVector files. */
  readonly imageVectorsDirectory: string;
  /** Directory containing the generated `<IconName>.kt` Symbol files. */
  readonly symbolsDirectory: string;
}

/**
 * Publishes the generated Compose ImageVectors and Symbols to the Android design system repository:
 * pushes them on a dedicated branch and opens a pull request.
 */
export async function publishAndroidIcons({
  logger,
  packageRootDirectory,
  imageVectorsDirectory,
  symbolsDirectory,
  // shared publish options
  mode,
  prerelease,
}: PublishAndroidIconsOptions): Promise<void> {
  return logger.asyncTask('android-icons', async (logger: Logger): Promise<void> => {
    const { name, version }: PackageJson = await readPackageJsonFile(
      join(packageRootDirectory, 'package.json'),
    );

    const publishVersion: string = generatePackageJsonBuildVersion({
      version,
      mode,
      prerelease,
    });

    const publishBranchPrefix: string = 'esds/icons/';
    const publishBranchName: string = `${publishBranchPrefix}${publishVersion}`;

    const changes: GitChanges = await createAndroidIconsPublishGithubBranch({
      logger,
      imageVectorsDirectory,
      symbolsDirectory,
      packageName: name,
      version: publishVersion,
      branchName: publishBranchName,
    });

    if (changes.length > 0) {
      const authToken: string = getEnvCiPullRequestAuthTokenMobile();

      await createGithubPullRequest({
        owner: INFOMANIAK_GITHUB_ORGANIZATION,
        repository: ANDROID_DESIGN_SYSTEM_REPOSITORY_NAME,
        authToken,
        title: `chore: ${name}@${publishVersion}`,
        body: `${name}@${publishVersion}`,
        head: publishBranchName,
        base: 'main',
      });

      await deleteGithubObsoletePublishBranches({
        owner: INFOMANIAK_GITHUB_ORGANIZATION,
        repository: ANDROID_DESIGN_SYSTEM_REPOSITORY_NAME,
        authToken,
        branchPrefix: publishBranchPrefix,
        currentBranchName: publishBranchName,
        logger,
      });
    } else {
      logger.info('SKIP (non-blocking): No changes to publish');
    }
  });
}
