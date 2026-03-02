import { join } from 'node:path';
import process from 'process';
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
  const iosPublishBranchName: string = await createIosGithubBranch({
    logger,
    packageDirectory: join(outputDirectory, 'ios'),
    version: versionOverride!,
  });

  if (tag != 'dev') {
    await createGithubPR({
      owner: 'Infomaniak',
      repo: 'ios-design-system',
      authToken: process.env['CI_PR_AUTH_TOKEN']!,
      title: `chore: Update to ${iosPublishBranchName}`,
      description: `Update to ${iosPublishBranchName}`,
      head: iosPublishBranchName,
      base: tag === 'rc' ? 'develop' : 'main',
    });
  }
}
