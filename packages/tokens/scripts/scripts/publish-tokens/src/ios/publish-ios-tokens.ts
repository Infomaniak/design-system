import { join } from 'node:path';
import type { PackageJson } from '../../../../../../../scripts/helpers/file/package-json/package-json.ts';
import { readPackageJsonFile } from '../../../../../../../scripts/helpers/file/package-json/read-package-json-file.ts';
import { createGithubPR } from '../../../../../../../scripts/helpers/github/pull-request/create-github-pr.ts';
import { getEnvCiPrAuthToken } from '../../../../../../../scripts/helpers/github/pull-request/env/get-env-ci-pr-auth-token.ts';
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
  return logger.asyncTask('ios', async (): Promise<void> => {
    const { version }: PackageJson = await readPackageJsonFile(join(rootDirectory, 'package.json'));

    const publishVersion: string = generatePackageJsonBuildVersion({
      version,
      mode,
      prerelease,
    });

    const githubOrganisation: string = 'Infomaniak';
    const iosRepoName: string = 'ios-design-system';

    const iosPublishBranchName: string = await createIosPublishGithubBranch({
      logger,
      repositoryName: iosRepoName,
      packageDirectory: join(outputDirectory, 'ios'),
      version: publishVersion,
    });

    if (mode !== 'dev') {
      await createGithubPR({
        owner: githubOrganisation,
        repository: iosRepoName,
        authToken: getEnvCiPrAuthToken(),
        title: `chore: Update to ${iosPublishBranchName}`,
        body: `Update to ${iosPublishBranchName}`,
        head: iosPublishBranchName,
        base: mode === 'rc' ? 'develop' : 'main',
      });
    }
  });
}
