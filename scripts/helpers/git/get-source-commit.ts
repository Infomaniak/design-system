import { getEnvVariable } from '../env/get-env-variable.ts';
import type { Logger } from '../log/logger.ts';
import { execCommand } from '../misc/exec-command.ts';
import { isFullGitCommitHash } from './is-full-git-commit-hash.ts';

export async function getSourceCommit(logger: Logger, cwd: string): Promise<string> {
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
