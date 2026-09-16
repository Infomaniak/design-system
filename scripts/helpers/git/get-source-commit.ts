import { getEnvVariable } from '../env/get-env-variable.ts';
import { getJsonEnvVariable } from '../env/types/get-json-env-variable.ts';
import type { Logger } from '../log/logger.ts';
import { execCommand } from '../misc/exec-command.ts';
import { isFullGitCommitHash } from './is-full-git-commit-hash.ts';

interface SourceGithubCiConfig {
  readonly event_name?: string;
  readonly event?: {
    readonly pull_request?: {
      readonly head?: {
        readonly sha?: string;
      };
    };
  };
}

export async function getSourceCommit(logger: Logger, cwd: string): Promise<string> {
  const githubCiConfig: SourceGithubCiConfig = getJsonEnvVariable<SourceGithubCiConfig>(
    'GITHUB_CI_CONFIG',
    { defaultValue: {} },
  );
  const pullRequestCommit: string | undefined =
    githubCiConfig.event_name === 'pull_request'
      ? githubCiConfig.event?.pull_request?.head?.sha?.trim()
      : undefined;

  if (githubCiConfig.event_name === 'pull_request') {
    if (!isFullGitCommitHash(pullRequestCommit)) {
      throw new Error('Pull request head SHA must be a full Git commit hash.');
    }

    return pullRequestCommit.toLowerCase();
  }

  const githubCommit: string = getEnvVariable('GITHUB_SHA', '').trim();

  if (githubCommit !== '') {
    if (!isFullGitCommitHash(githubCommit)) {
      throw new Error('GITHUB_SHA must be a full Git commit hash.');
    }

    return githubCommit.toLowerCase();
  }

  const sourceCommit: string = (await execCommand(logger, 'git', ['rev-parse', 'HEAD'], { cwd }))
    .trim()
    .toLowerCase();

  if (!isFullGitCommitHash(sourceCommit)) {
    throw new Error(`Unable to resolve the full Git commit in ${cwd}.`);
  }

  return sourceCommit;
}
