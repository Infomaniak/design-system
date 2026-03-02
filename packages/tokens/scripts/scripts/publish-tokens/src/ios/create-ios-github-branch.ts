import { rm } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import type { Logger } from '../../../../../../../scripts/helpers/log/logger.ts';
import { execCommandInherit } from '../../../../../../../scripts/helpers/misc/exec-command.ts';

export interface CreateIosGithubBranchOptions {
  readonly logger: Logger;
  readonly packageDirectory: string;
  readonly version: string;
}

export async function createIosGithubBranch({
  logger,
  packageDirectory,
  version,
}: CreateIosGithubBranchOptions): Promise<string> {
  packageDirectory = resolve(packageDirectory);

  await rm(join(packageDirectory, 'ios-design-system'), {
    recursive: true,
    force: true,
  });

  await execCommandInherit(
    logger,
    'git',
    ['clone', 'git@github.com:Infomaniak/ios-design-system.git'],
    {
      cwd: packageDirectory,
      shell: true,
    },
  );

  await execCommandInherit(logger, 'git', ['checkout', '-b', version], {
    cwd: join(packageDirectory, 'ios-design-system'),
    shell: true,
  });

  await execCommandInherit(
    logger,
    'cp',
    [
      join(packageDirectory, 'EsdsColorRawTokens.swift'),
      `"${join(packageDirectory, 'ios-design-system/CatalogApp/DesignSystem Catalog/')}"`,
    ],
    {
      cwd: packageDirectory,
      shell: true,
    },
  );

  await execCommandInherit(logger, 'git', ['add', '.'], {
    cwd: join(packageDirectory, 'ios-design-system'),
    shell: true,
  });

  await execCommandInherit(logger, 'git', ['config', 'user.name', '"github-actions"'], {
    cwd: join(packageDirectory, 'ios-design-system'),
    shell: true,
  });

  await execCommandInherit(logger, 'git', ['config', 'user.email', '"github-actions@github.com"'], {
    cwd: join(packageDirectory, 'ios-design-system'),
    shell: true,
  });

  await execCommandInherit(logger, 'git', ['commit', '-m', `"chore: Update to ${version}"`], {
    cwd: join(packageDirectory, 'ios-design-system'),
    shell: true,
  });

  await execCommandInherit(logger, 'git', ['push', '--set-upstream', 'origin', version], {
    cwd: join(packageDirectory, 'ios-design-system'),
    shell: true,
  });

  return version;
}
