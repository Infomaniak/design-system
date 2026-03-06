import { join } from 'node:path';
import type { PackageJson } from '../../../../../../../scripts/helpers/file/package-json/package-json.ts';
import { readPackageJsonFile } from '../../../../../../../scripts/helpers/file/package-json/read-package-json-file.ts';
import { createGithubPR } from '../../../../../../../scripts/helpers/github/pull-request/create-github-pr.ts';
import { getEnvCiPrAuthToken } from '../../../../../../../scripts/helpers/github/pull-request/env/get-env-ci-pr-auth-token.ts';
import { Logger } from '../../../../../../../scripts/helpers/log/logger.ts';
import { generatePackageJsonBuildVersion } from '../../../../../../../scripts/helpers/npm/generate-package-json-build-version/generate-package-json-build-version.ts';
import type { PublishConfig } from '../../../../../../../scripts/helpers/publish/publish-config/publish-config.ts';
import { createIosPublishGithubBranch } from './create-ios-publish-github-branch.ts';

const GITHUB_ORGANIZATION = 'Infomaniak';
const IOS_REPOSITORY_NAME = 'ios-design-system';

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
  return logger.asyncTask('ios', async (): Promise<void> => {
    const { version }: PackageJson = await readPackageJsonFile(join(rootDirectory, 'package.json'));

    const publishVersion: string = generatePackageJsonBuildVersion({
      version,
      mode,
      prerelease,
    });

    const iosPublishBranchName: string = await createIosPublishGithubBranch({
      logger,
      repositoryName: IOS_REPOSITORY_NAME,
      packageDirectory: join(outputDirectory, 'ios'),
      version: publishVersion,
    });

    if (mode !== 'dev') {
      await createGithubPR({
        owner: GITHUB_ORGANIZATION,
        repository: IOS_REPOSITORY_NAME,
        authToken: getEnvCiPrAuthToken(),
        title: `chore: Update to ${iosPublishBranchName}`,
        body: `Update to ${iosPublishBranchName}`,
        head: iosPublishBranchName,
        base: mode === 'rc' ? 'develop' : 'main',
      });
    }
  });
}
