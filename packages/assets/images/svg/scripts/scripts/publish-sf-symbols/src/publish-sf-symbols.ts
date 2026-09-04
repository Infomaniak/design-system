import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import type { PackageJson } from '../../../../../../../../scripts/helpers/file/package-json/package-json.ts';
import { readPackageJsonFile } from '../../../../../../../../scripts/helpers/file/package-json/read-package-json-file.ts';
import type { GitChanges } from '../../../../../../../../scripts/helpers/git/git-changes.ts';
import { INFOMANIAK_GITHUB_ORGANIZATION } from '../../../../../../../../scripts/helpers/github/constants/infomaniak-github-organization.constant.ts';
import { IOS_DESIGN_SYSTEM_REPOSITORY_NAME } from '../../../../../../../../scripts/helpers/github/constants/ios-design-system-repository-name.constant.ts';
import { createGithubPullRequest } from '../../../../../../../../scripts/helpers/github/pull-request/create-github-pull-request.ts';
import { getEnvCiPullRequestAuthTokenMobile } from '../../../../../../../../scripts/helpers/github/pull-request/env/get-env-ci-pull-request-auth-token-mobile.ts';
import type { Logger } from '../../../../../../../../scripts/helpers/log/logger.ts';
import { generatePackageJsonBuildVersion } from '../../../../../../../../scripts/helpers/npm/generate-package-json-build-version/generate-package-json-build-version.ts';
import type { PublishConfig } from '../../../../../../../../scripts/helpers/publish/publish-config/publish-config.ts';
import { OUTLINE_FILE_SUFFIX } from '../../../shared/sf-symbols/read-symbol-icons.ts';
import { SYMBOLS_XCASSETS_DIRECTORY_NAME } from '../../../shared/sf-symbols/sf-symbols-config.ts';
import { createIosSymbolsPublishGithubBranch } from './create-ios-symbols-publish-github-branch.ts';

export interface PublishSfSymbolsOptions extends PublishConfig {
  readonly logger: Logger;
  /** Root directory of the `@infomaniak-design-system/svg-assets` package. */
  readonly packageRootDirectory: string;
  /** Directory wiped and filled with the generated `ESDSSymbols.xcassets`. */
  readonly outputDirectory: string;
  readonly outlinesDirectory: string;
}

/**
 * Publishes the generated SF Symbols to the iOS design system repository:
 * generates the asset catalog, pushes it on a dedicated branch and opens a pull request.
 */
export async function publishSfSymbols({
  logger,
  packageRootDirectory,
  outputDirectory,
  outlinesDirectory,
  // shared publish options
  mode,
  prerelease,
}: PublishSfSymbolsOptions): Promise<void> {
  return logger.asyncTask('sf-symbols', async (logger: Logger): Promise<void> => {
    if (!(await hasSymbolOutlineFiles(outlinesDirectory))) {
      logger.info(
        'SKIP (non-blocking): No SF Symbol outlines yet. Run the Figma icons import first: the import pull request commits the outline files.',
      );
      return;
    }

    const { version }: PackageJson = await readPackageJsonFile(
      join(packageRootDirectory, 'package.json'),
    );

    const publishVersion: string = generatePackageJsonBuildVersion({
      version,
      mode,
      prerelease,
    });

    const publishBranchName: string = `esds-symbols/${publishVersion}`;
    const pullRequestTitle: string = `chore: Update symbols to ${publishVersion}`;

    const branchChanges: GitChanges = await createIosSymbolsPublishGithubBranch({
      logger,
      xcassetsDirectory: join(outputDirectory, SYMBOLS_XCASSETS_DIRECTORY_NAME),
      version: publishVersion,
      branchName: publishBranchName,
    });

    if (branchChanges.length > 0) {
      await createGithubPullRequest({
        owner: INFOMANIAK_GITHUB_ORGANIZATION,
        repository: IOS_DESIGN_SYSTEM_REPOSITORY_NAME,
        authToken: getEnvCiPullRequestAuthTokenMobile(),
        title: pullRequestTitle,
        body: pullRequestTitle,
        head: publishBranchName,
        base: 'main',
      });
    } else {
      logger.info('SKIP (non-blocking): No changes to publish');
    }
  });
}

async function hasSymbolOutlineFiles(outlinesDirectory: string): Promise<boolean> {
  let directoryFileNames: readonly string[];

  try {
    directoryFileNames = await readdir(outlinesDirectory);
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return false;
    }

    throw error;
  }

  return directoryFileNames.some((fileName: string): boolean => {
    return fileName.endsWith(OUTLINE_FILE_SUFFIX);
  });
}
