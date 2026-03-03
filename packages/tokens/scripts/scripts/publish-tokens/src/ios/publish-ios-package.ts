import { join } from 'node:path';
import process from 'node:process';
import { createGithubPR } from '../../../../../../../scripts/helpers/github/pull-request/create-github-pr.ts';
import { Logger } from '../../../../../../../scripts/helpers/log/logger.ts';
import { createIosGithubBranch } from './create-ios-github-branch.ts';

export interface PublishIosTokensOptions {
  readonly outputDirectory: string;
  readonly tag?: string;
  readonly versionOverride?: string;
  readonly logger: Logger;
}

export async function publishIosPackage({
  outputDirectory,
  tag,
  versionOverride,
  logger,
}: PublishIosTokensOptions): Promise<void> {
  if (!versionOverride) {
    throw new Error(
      'publishIosPackage: versionOverride is required. Make sure NPM_PUBLISH_VERSION is set in CI or pass versionOverride explicitly.'
    );
  }

  const githubOrganisation: string = 'Infomaniak';
  const iosRepoName: string = 'ios-design-system';

  const iosPublishBranchName: string = await createIosGithubBranch({
    logger,
    repoName: iosRepoName,
    packageDirectory: join(outputDirectory, 'ios'),
    version: versionOverride,
  });

  if (tag != 'dev') {
    await createGithubPR({
      owner: githubOrganisation,
      repo: iosRepoName,
      authToken: process.env['CI_PR_AUTH_TOKEN']!,
      title: `chore: Update to ${iosPublishBranchName}`,
      body: `Update to ${iosPublishBranchName}`,
      head: iosPublishBranchName,
      base: tag === 'rc' ? 'develop' : 'main',
    });
  }
}
