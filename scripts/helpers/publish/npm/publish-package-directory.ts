import { resolve } from 'node:path';
import process from 'node:process';
import { readJsonFile } from '../../file/read-json-file.ts';
import { writeJsonFileSafe } from '../../file/write-json-file-safe.ts';
import { Logger } from '../../log/logger.ts';
import { execCommandInherit } from '../../misc/exec-command.ts';
import type { PublishMode } from '../publish-mode.ts';

export interface PublishNpmPackageDirectoryOptions {
  readonly packageDirectory: string;
  readonly mode: PublishMode;
  readonly publishTimestamp?: number;
  readonly versionOverride?: string;
  readonly internalDependencyVersionOverrides?: Readonly<Record<string, string>>;
  readonly logger: Logger;
}

export interface PublishNpmPackageDirectoryResult {
  readonly version: string;
}

export interface BuildNpmPublishArgsOptions {
  readonly mode: 'prod' | 'dev';
  readonly tag?: string;
}

export interface ResolvePublishVersionOptions {
  readonly mode: 'prod' | 'dev';
  readonly packageVersion: string;
  readonly publishTimestamp: number;
  readonly versionOverride?: string;
}

export interface RewriteInternalDependencyVersionsOptions {
  readonly packageJsonContent: Record<string, unknown>;
  readonly overrides: Readonly<Record<string, string>>;
}

const DEPENDENCY_FIELD_NAMES = [
  'dependencies',
  'peerDependencies',
  'optionalDependencies',
  'devDependencies',
] as const;

export function buildNpmPublishArgs({ mode, tag }: BuildNpmPublishArgsOptions): string[] {
  const args: string[] = [
    '--//registry.npmjs.org/:_authToken=$NPM_TOKEN',
    'publish',
    '--access',
    'public',
  ];

  if (mode === 'dev') {
    args.push('--tag', 'dev');
    return args;
  }

  if (tag !== undefined && tag !== '') {
    args.push('--tag', tag);
  }

  return args;
}

export function resolvePublishVersion({
  mode,
  packageVersion,
  publishTimestamp,
  versionOverride,
}: ResolvePublishVersionOptions): string {
  if (versionOverride !== undefined && versionOverride !== '') {
    return versionOverride;
  }

  if (mode === 'dev') {
    if (packageVersion.includes('-')) {
      throw new Error(`Invalid version: ${packageVersion}.`);
    }

    return `${packageVersion}-dev.${publishTimestamp}`;
  }

  return packageVersion;
}

export function rewriteInternalDependencyVersions({
  packageJsonContent,
  overrides,
}: RewriteInternalDependencyVersionsOptions): Record<string, unknown> {
  if (Object.keys(overrides).length === 0) {
    return packageJsonContent;
  }

  let nextPackageJsonContent: Record<string, unknown> = packageJsonContent;
  let hasChanges: boolean = false;

  for (const fieldName of DEPENDENCY_FIELD_NAMES) {
    const fieldValue: unknown = packageJsonContent[fieldName];

    if (typeof fieldValue !== 'object' || fieldValue === null) {
      continue;
    }

    const dependencyMap: Record<string, unknown> = fieldValue as Record<string, unknown>;
    let nextDependencyMap: Record<string, unknown> | undefined;

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
      nextDependencyMap[dependencyName] = overrideVersion;
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
  mode,
  tag,
  publishTimestamp = Date.now(),
  versionOverride,
  internalDependencyVersionOverrides = {},
  logger,
}: PublishNpmPackageDirectoryOptions): Promise<PublishNpmPackageDirectoryResult> {
  return await logger.asyncTask(
    'npm',
    async (taskLogger: Logger): Promise<PublishNpmPackageDirectoryResult> => {
      const packageJsonFilePath: string = resolve(packageDirectory, 'package.json');
      const packageJsonContent: Record<string, unknown> = (await readJsonFile(
        packageJsonFilePath,
      )) as Record<string, unknown>;
      const packageVersion: unknown = packageJsonContent['version'];

      if (typeof packageVersion !== 'string' || packageVersion === '') {
        throw new Error(`Missing "version" in ${packageJsonFilePath}.`);
      }

      const args: string[] = buildNpmPublishArgs({ mode, tag });
      const version: string = resolvePublishVersion({
        mode,
        packageVersion,
        publishTimestamp,
        versionOverride,
      });
      const packageJsonWithDependencyOverrides: Record<string, unknown> =
        rewriteInternalDependencyVersions({
          packageJsonContent,
          overrides: internalDependencyVersionOverrides,
        });
      const packageJsonToPublish: Record<string, unknown> =
        version === packageVersion
          ? packageJsonWithDependencyOverrides
          : {
              ...packageJsonWithDependencyOverrides,
              version,
            };
      const shouldRewritePackageJson: boolean = packageJsonToPublish !== packageJsonContent;

      if (shouldRewritePackageJson) {
        await writeJsonFileSafe(packageJsonFilePath, packageJsonToPublish);
      }

      try {
        await execCommandInherit(taskLogger, 'npm', args, {
          shell: true,
          env: process.env,
          cwd: resolve(packageDirectory),
        });

        return {
          version,
        };
      } finally {
        if (shouldRewritePackageJson) {
          await writeJsonFileSafe(packageJsonFilePath, packageJsonContent);
        }
      }
    },
  );
}
