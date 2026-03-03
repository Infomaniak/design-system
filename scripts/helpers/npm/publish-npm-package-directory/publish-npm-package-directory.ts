import { join, resolve } from 'node:path';
import process from 'node:process';
import type { PackageJsonDependencies } from '../../file/package-json/package-json-dependencies/package-json-dependencies.ts';
import type { PackageJson } from '../../file/package-json/package-json.ts';
import { readPackageJsonFile } from '../../file/package-json/read-package-json-file.ts';
import { writeJsonFileSafe } from '../../file/write-json-file-safe.ts';
import { Logger } from '../../log/logger.ts';
import { execCommandInherit } from '../../misc/exec-command.ts';
import type { Writable } from '../../types/writable.ts';

export interface PublishNpmPackageDirectoryOptions {
  readonly packageDirectory: string;
  readonly tag?: string;

  /**
   * @deprecated
   */
  readonly publishTimestamp?: number;
  /**
   * @deprecated
   */
  readonly versionOverride?: string;
  /**
   * @deprecated
   */
  readonly internalDependencyVersionOverrides?: PackageJsonDependencies;
  readonly logger: Logger;
}

export interface ResolvePublishVersionOptions {
  readonly tag?: string;
  readonly packageVersion: string;
  readonly publishTimestamp: number;
  readonly versionOverride?: string;
}

const DEPENDENCY_FIELD_NAMES = [
  'dependencies',
  'peerDependencies',
  'optionalDependencies',
  'devDependencies',
] as const;

function isStableTag(tag?: string): tag is undefined | '' | 'latest' {
  return tag === undefined || tag === '' || tag === 'latest';
}

export function resolvePublishVersion({
  tag,
  packageVersion,
  publishTimestamp,
  versionOverride,
}: ResolvePublishVersionOptions): string {
  if (versionOverride !== undefined && versionOverride !== '') {
    return versionOverride;
  }

  if (isStableTag(tag)) {
    return packageVersion;
  }

  if (packageVersion.includes('-')) {
    throw new Error(`Invalid version: ${packageVersion}.`);
  }

  return `${packageVersion}-${tag}.${publishTimestamp}`;
}

/**
 * @deprecated
 */
export interface RewriteInternalDependencyVersionsOptions {
  readonly packageJsonContent: PackageJson;
  readonly overrides: PackageJsonDependencies;
}

/**
 * @deprecated
 */
export function rewriteInternalDependencyVersions({
  packageJsonContent,
  overrides,
}: RewriteInternalDependencyVersionsOptions): PackageJson {
  if (Object.keys(overrides).length === 0) {
    return packageJsonContent;
  }

  let nextPackageJsonContent: Writable<PackageJson> = packageJsonContent;
  let hasChanges: boolean = false;

  for (const fieldName of DEPENDENCY_FIELD_NAMES) {
    const fieldValue: unknown = packageJsonContent[fieldName];

    if (typeof fieldValue !== 'object' || fieldValue === null || fieldValue === undefined) {
      continue;
    }

    const dependencyMap: PackageJsonDependencies = fieldValue as PackageJsonDependencies;
    let nextDependencyMap: PackageJsonDependencies | undefined;

    for (const [dependencyName, overrideVersion] of Object.entries(overrides)) {
      if (typeof dependencyMap[dependencyName] !== 'string') {
        continue;
      }

      if (dependencyMap[dependencyName] === overrideVersion) {
        continue;
      }

      nextDependencyMap ??= {
        ...dependencyMap,
      };
      nextDependencyMap[dependencyName] = overrideVersion as string;
    }

    if (nextDependencyMap === undefined) {
      continue;
    }

    if (!hasChanges) {
      nextPackageJsonContent = {
        ...packageJsonContent,
      };
      hasChanges = true;
    }

    nextPackageJsonContent[fieldName] = nextDependencyMap;
  }

  return nextPackageJsonContent;
}

export async function publishNpmPackageDirectory({
  packageDirectory,
  tag,
  publishTimestamp = Date.now(),
  versionOverride,
  internalDependencyVersionOverrides = {},
  logger,
}: PublishNpmPackageDirectoryOptions): Promise<void> {
  await using stack: AsyncDisposableStack = new AsyncDisposableStack();

  const packageJsonFilePath: string = join(packageDirectory, 'package.json');
  const packageJsonContent: PackageJson = await readPackageJsonFile(packageJsonFilePath);
  const packageVersion: string = packageJsonContent.version;

  const args: string[] = [
    '--//registry.npmjs.org/:_authToken=$NPM_AUTH_TOKEN',
    'publish',
    '--access',
    'public',
  ];

  if (tag !== undefined) {
    args.push('--tag', tag);
  }

  const version: string = resolvePublishVersion({
    tag,
    packageVersion,
    publishTimestamp,
    versionOverride,
  });

  const packageJsonWithDependencyOverrides: PackageJson = rewriteInternalDependencyVersions({
    packageJsonContent,
    overrides: internalDependencyVersionOverrides,
  });
  const packageJsonToPublish: PackageJson =
    version === packageVersion
      ? packageJsonWithDependencyOverrides
      : {
          ...packageJsonWithDependencyOverrides,
          version,
        };
  const shouldRewritePackageJson: boolean = packageJsonToPublish !== packageJsonContent;

  if (shouldRewritePackageJson) {
    await writeJsonFileSafe(packageJsonFilePath, packageJsonToPublish);

    stack.defer(async (): Promise<void> => {
      await writeJsonFileSafe(packageJsonFilePath, packageJsonContent);
    });
  }

  await execCommandInherit(logger, 'npm', args, {
    shell: true,
    env: process.env,
    cwd: resolve(packageDirectory),
  });
}
