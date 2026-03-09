import process from 'node:process';
import type { Logger } from '../../log/logger.ts';
import { execCommandInherit } from '../../misc/exec-command.ts';

export interface PublishNpmPackageDirectoryOptions {
  readonly packageDirectory: string;
  readonly tag?: string;
  readonly logger: Logger;
}

export async function publishNpmPackageDirectory({
  packageDirectory,
  tag,
  logger,
}: PublishNpmPackageDirectoryOptions): Promise<void> {
  const args: string[] = [
    '--//registry.npmjs.org/:_authToken=$NPM_AUTH_TOKEN',
    'publish',
    '--access',
    'public',
  ];

  if (tag !== undefined) {
    args.push('--tag', tag);
  }

  await execCommandInherit(logger, 'npm', args, {
    shell: true,
    env: process.env,
    cwd: packageDirectory,
  });
}
