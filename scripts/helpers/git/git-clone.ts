import type { SpawnOptions } from 'node:child_process';
import type { Logger } from '../log/logger.ts';
import { execCommandInherit } from '../misc/exec-command.ts';
import {
  ENV_ACCESS_TOKEN,
  injectAccessTokenIntoRepositoryUrl,
} from './access-token/inject-access-token-into-repository-url.ts';

export interface GitCloneOptions extends SpawnOptions {
  readonly repository: string;
  readonly accessToken?: string;
  readonly depth?: number;
  readonly branchName?: string;
  readonly destinationDirectory?: string;
  readonly logger: Logger;
}

/**
 * Clones a git repository.
 */
export async function gitClone({
  repository,
  accessToken,
  depth,
  branchName,
  destinationDirectory,
  logger,
  ...spawnOptions
}: GitCloneOptions): Promise<void> {
  const args: string[] = ['clone'];

  if (depth !== undefined) {
    args.push('--depth', String(depth));
  }

  if (branchName !== undefined) {
    args.push('--single-branch', '--branch', branchName);
  }

  if (accessToken === undefined) {
    args.push(repository);
  } else {
    args.push(injectAccessTokenIntoRepositoryUrl(repository));
  }

  if (destinationDirectory !== undefined) {
    args.push(destinationDirectory);
  }

  await execCommandInherit(logger, 'git', args, {
    ...spawnOptions,
    shell: true,
    env: {
      ...spawnOptions.env,
      [ENV_ACCESS_TOKEN]: accessToken,
    },
  });
}
