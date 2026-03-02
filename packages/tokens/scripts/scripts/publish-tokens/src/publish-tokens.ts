import { join } from 'node:path';
import { rm } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { Logger } from '../../../../../../scripts/helpers/log/logger.ts';
import {
  publishNpmPackageDirectory,
  type PublishNpmPackageDirectoryResult,
} from '../../../../../../scripts/helpers/npm/publish-package-directory.ts';
import { execCommandInherit } from '../../../../../../scripts/helpers/misc/exec-command.ts';

export {
  buildNpmPublishArgs,
  resolvePublishVersion,
  rewriteInternalDependencyVersions,
} from '../../../../../../scripts/helpers/npm/publish-package-directory.ts';

export interface PublishTokensOptions {
  readonly outputDirectory: string;
  readonly tag?: string;
  readonly publishTimestamp?: number;
  readonly versionOverride?: string;
  readonly internalDependencyVersionOverrides?: Readonly<Record<string, string>>;
  readonly logger: Logger;
}

export interface PublishTokensResult {
  readonly npm: {
    readonly version: string;
  };
}

export interface PublishTokensNpmResult {
  readonly version: string;
}

export function publishTokens({
  outputDirectory,
  tag,
  publishTimestamp = Date.now(),
  versionOverride,
  internalDependencyVersionOverrides = {},
  logger,
}: PublishTokensOptions): Promise<PublishTokensResult> {
  const publishTag: string = tag === undefined || tag === '' ? 'latest' : tag;

  return logger.asyncTask(
    `publish-tokens (${publishTag})`,
    async (logger: Logger): Promise<PublishTokensResult> => {
      const npmResult: PublishNpmPackageDirectoryResult = await publishNpmPackageDirectory({
        packageDirectory: join(outputDirectory, 'web'),
        tag,
        publishTimestamp,
        versionOverride,
        internalDependencyVersionOverrides,

      await openIosPr({
        logger,
        packageDirectory: join(outputDirectory, 'ios'),
        version: versionOverride!,
      });

      return {
        npm: {
          version: npmResult.version,
        },
      };
    },
  );
}

export interface PublishIosOptions {
  readonly logger: Logger;
  readonly packageDirectory: string;
  readonly version: string;
}

async function openIosPr({ logger, packageDirectory, version }: PublishIosOptions): Promise<void> {
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
}
