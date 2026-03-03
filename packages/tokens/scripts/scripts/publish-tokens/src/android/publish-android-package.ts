import { join } from 'node:path';
import process from 'node:process';
import { createGithubPR } from '../../../../../../../scripts/helpers/github/pull-request/create-github-pr.ts';
import { Logger } from '../../../../../../../scripts/helpers/log/logger.ts';
import { createAndroidGithubBranch } from './create-android-github-branch.ts';

export interface PublishAndroidTokensOptions {
  readonly outputDirectory: string;
  readonly tag?: string;
  readonly versionOverride?: string;
  readonly logger: Logger;
}

export async function publishAndroidPackage({
  outputDirectory,
  tag,
  versionOverride,
  logger,
}: PublishAndroidTokensOptions): Promise<void> {
  if (!versionOverride) {
    throw new Error(
      'publishAndroidPackage: versionOverride is required. Make sure NPM_PUBLISH_VERSION is set in CI or pass versionOverride explicitly.'
    );
  }

  const githubOrganisation: string = 'Infomaniak';
  const androidRepoName: string = 'android-design-system';

  const androidPublishBranchName: string = await createAndroidGithubBranch({
    logger,
    repoName: androidRepoName,
    packageDirectory: join(outputDirectory, 'android'),
    version: versionOverride,
  });

  if (tag != 'dev') {
    await createGithubPR({
      owner: githubOrganisation,
      repo: androidRepoName,
      authToken: process.env['CI_PR_AUTH_TOKEN']!,
      title: `chore: Update to ${androidPublishBranchName}`,
      body: `Update to ${androidPublishBranchName}`,
      head: androidPublishBranchName,
      base: tag === 'rc' ? 'develop' : 'main',
    });
  }
}
