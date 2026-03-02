import { Dirent } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { join, normalize, resolve, sep } from 'node:path';
import process from 'node:process';
import { readJsonFile } from '../../../helpers/file/read-json-file.ts';
import { type Logger } from '../../../helpers/log/logger.ts';
import { execCommand, execCommandInherit } from '../../../helpers/misc/exec-command.ts';
import { getPublishContext, type PublishContext } from './branch-policy.ts';
import { isNpmVersionPublished as defaultIsNpmVersionPublished } from './npm-package-version.ts';
import {
  topologicalSortPackages,
  type TopologicalPackageNode,
} from './topological-sort-packages.ts';

export interface PublishablePackage extends TopologicalPackageNode {
  readonly directory: string;
  readonly version: string;
}

export interface CiPublishOptions {
  readonly rootDirectory: string;
  readonly eventName: string;
  readonly branchName: string;
  readonly pullRequestLabels?: readonly string[];
  readonly gitBaseSha?: string;
  readonly gitHeadSha?: string;
  readonly publishTimestamp?: number;
  readonly strictVersionPolicy: boolean;
  readonly dryRun: boolean;
  readonly logger: Logger;
}

export type IsNpmVersionPublished = (name: string, version: string) => Promise<boolean>;

export interface PublishWorkspacePackageOptions {
  readonly tag: PublishContext['tag'];
  readonly version: string;
  readonly internalDependencyVersionOverrides?: Readonly<Record<string, string>>;
}

export type PublishWorkspacePackage = (
  workspaceName: string,
  options: PublishWorkspacePackageOptions,
) => Promise<void>;

export type ListChangedFiles = (
  rootDirectory: string,
  baseSha: string,
  headSha: string,
) => Promise<readonly string[]>;

export interface CiPublishDependencies {
  readonly discoverPublishablePackages?: (
    rootDirectory: string,
  ) => Promise<readonly PublishablePackage[]>;
  readonly isNpmVersionPublished?: IsNpmVersionPublished;
  readonly listChangedFiles?: ListChangedFiles;
  readonly publishWorkspacePackage?: PublishWorkspacePackage;
}

export interface CiPublishDecision {
  readonly packageName: string;
  readonly baseVersion: string;
  readonly publishVersion: string;
  readonly tag: PublishContext['tag'];
  readonly action: 'skip' | 'publish' | 'publish-dry-run';
}

interface PackageJson {
  readonly name?: unknown;
  readonly version?: unknown;
  readonly scripts?: unknown;
  readonly dependencies?: unknown;
}

const STABLE_VERSION_REGEXP: RegExp = /^\d+\.\d+\.\d+$/;

export async function discoverPublishablePackages(
  rootDirectory: string,
): Promise<readonly PublishablePackage[]> {
  const packagesDirectory: string = join(rootDirectory, 'packages');
  const entries: readonly Dirent[] = await readdir(packagesDirectory, {
    withFileTypes: true,
  });

  const publishablePackages: PublishablePackage[] = [];
  const sortedEntries = Array.from(entries).sort((a, b) => a.name.localeCompare(b.name));
  for (const entry of sortedEntries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const packageDirectory: string = join(packagesDirectory, entry.name);
    const packageJsonPath: string = join(packageDirectory, 'package.json');

    let packageJson: PackageJson;

    try {
      packageJson = (await readJsonFile(packageJsonPath)) as PackageJson;
    } catch (error: unknown) {
      if (
        Error.isError(error) &&
        'code' in error &&
        typeof (error as { code?: unknown }).code === 'string' &&
        (error as { code?: string }).code === 'ENOENT'
      ) {
        continue;
      }

      throw error;
    }

    const publishScript: unknown =
      typeof packageJson.scripts === 'object' && packageJson.scripts !== null
        ? (packageJson.scripts as Record<string, unknown>)['publish:ci']
        : undefined;

    if (typeof publishScript !== 'string') {
      continue;
    }

    if (typeof packageJson.name !== 'string' || packageJson.name === '') {
      throw new Error(`Missing "name" in ${packageJsonPath}.`);
    }

    if (typeof packageJson.version !== 'string' || packageJson.version === '') {
      throw new Error(`Missing "version" in ${packageJsonPath}.`);
    }

    const dependencies: readonly string[] =
      typeof packageJson.dependencies === 'object' && packageJson.dependencies !== null
        ? Object.keys(packageJson.dependencies as Record<string, unknown>)
        : [];

    publishablePackages.push({
      directory: packageDirectory,
      name: packageJson.name,
      version: packageJson.version,
      dependencies,
    });
  }

  return publishablePackages;
}

function getImpactedPackageNames({
  packages,
  rootDirectory,
  changedFiles,
}: {
  readonly packages: readonly PublishablePackage[];
  readonly rootDirectory: string;
  readonly changedFiles: readonly string[];
}): ReadonlySet<string> {
  const directImpactedNames: Set<string> = new Set<string>();
  const packagesByName: Map<string, PublishablePackage> = new Map(
    packages.map((pkg): readonly [string, PublishablePackage] => [pkg.name, pkg]),
  );
  const dependantsByName: Map<string, string[]> = new Map(
    packages.map((pkg): readonly [string, string[]] => [pkg.name, []]),
  );

  for (const pkg of packages) {
    for (const dependencyName of pkg.dependencies) {
      if (!packagesByName.has(dependencyName)) {
        continue;
      }

      dependantsByName.get(dependencyName)!.push(pkg.name);
    }
  }

  for (const changedFile of changedFiles) {
    const absoluteChangedFilePath: string = normalize(resolve(rootDirectory, changedFile));

    for (const pkg of packages) {
      const packageDirectoryPath: string = normalize(resolve(pkg.directory));

      if (
        absoluteChangedFilePath === packageDirectoryPath ||
        absoluteChangedFilePath.startsWith(`${packageDirectoryPath}${sep}`)
      ) {
        directImpactedNames.add(pkg.name);
      }
    }
  }

  const impactedNames: Set<string> = new Set<string>(directImpactedNames);
  const queue: string[] = Array.from(directImpactedNames);

  while (queue.length > 0) {
    const packageName: string = queue.shift()!;

    for (const dependantName of dependantsByName.get(packageName) ?? []) {
      if (impactedNames.has(dependantName)) {
        continue;
      }

      impactedNames.add(dependantName);
      queue.push(dependantName);
    }
  }

  return impactedNames;
}

function computePublishVersion({
  baseVersion,
  tag,
  strict,
  publishTimestamp,
}: {
  readonly baseVersion: string;
  readonly tag: PublishContext['tag'];
  readonly strict: boolean;
  readonly publishTimestamp: number;
}): string {
  if (!STABLE_VERSION_REGEXP.test(baseVersion)) {
    if (strict) {
      throw new Error(
        `Version "${baseVersion}" must be a stable version (x.y.z) in package.json. CI computes dev/rc suffixes.`,
      );
    }

    return baseVersion;
  }

  if (tag === 'latest') {
    return baseVersion;
  }

  return `${baseVersion}-${tag}.${publishTimestamp}`;
}

async function listChangedFilesFromGit(
  logger: Logger,
  rootDirectory: string,
  baseSha: string,
  headSha: string,
): Promise<readonly string[]> {
  const output: string = await execCommand(
    logger,
    'git',
    ['diff', '--name-only', baseSha, headSha],
    {
      cwd: rootDirectory,
      shell: true,
    },
  );

  return output
    .split(/\r?\n/)
    .map((line: string): string => line.trim())
    .filter((line: string): boolean => line !== '');
}

export function createWorkspacePublisher({
  logger,
  rootDirectory,
}: {
  readonly logger: Logger;
  readonly rootDirectory: string;
}): PublishWorkspacePackage {
  return async (
    workspaceName: string,
    { tag, version, internalDependencyVersionOverrides }: PublishWorkspacePackageOptions,
  ): Promise<void> => {
    await execCommandInherit(logger, 'yarn', ['workspace', workspaceName, 'run', 'publish:ci'], {
      shell: true,
      cwd: rootDirectory,
      env: {
        ...process.env,
        NPM_DIST_TAG: tag,
        NPM_PUBLISH_VERSION: version,
        ...(internalDependencyVersionOverrides !== undefined &&
        Object.keys(internalDependencyVersionOverrides).length > 0
          ? {
              NPM_INTERNAL_DEP_OVERRIDES_JSON: JSON.stringify(internalDependencyVersionOverrides),
            }
          : {}),
      },
    });
  };
}

export async function ciPublish(
  {
    rootDirectory,
    eventName,
    branchName,
    pullRequestLabels = [],
    gitBaseSha,
    gitHeadSha,
    publishTimestamp = Date.now(),
    strictVersionPolicy,
    dryRun,
    logger,
  }: CiPublishOptions,
  {
    discoverPublishablePackages: discover = discoverPublishablePackages,
    isNpmVersionPublished = defaultIsNpmVersionPublished,
    listChangedFiles = async (
      listRootDirectory: string,
      baseSha: string,
      headSha: string,
    ): Promise<readonly string[]> =>
      listChangedFilesFromGit(logger, listRootDirectory, baseSha, headSha),
    publishWorkspacePackage = createWorkspacePublisher({
      logger,
      rootDirectory,
    }),
  }: CiPublishDependencies = {},
): Promise<readonly CiPublishDecision[]> {
  const publishContext: PublishContext = getPublishContext({
    eventName,
    branchName,
    pullRequestLabels,
  });
  const { tag } = publishContext;

  if (!publishContext.shouldPublish) {
    logger.info(
      `[skip] CI publish disabled for ${eventName}:${branchName} (missing required PR label "dev").`,
    );
    return [];
  }

  const discoveredPackages: readonly PublishablePackage[] = await discover(rootDirectory);
  const packages: readonly PublishablePackage[] = topologicalSortPackages(discoveredPackages);

  if (packages.length === 0) {
    logger.warn('No publishable package found (missing script "publish:ci").');
    return [];
  }

  const decisions: CiPublishDecision[] = [];
  let candidatePackages: readonly PublishablePackage[] = packages;

  if (tag !== 'latest') {
    if (
      gitBaseSha === undefined ||
      gitBaseSha === '' ||
      gitHeadSha === undefined ||
      gitHeadSha === ''
    ) {
      logger.warn(
        'Missing CI_PUBLISH_GIT_BASE_SHA/CI_PUBLISH_GIT_HEAD_SHA. Falling back to all publishable packages.',
      );
    } else {
      const changedFiles: readonly string[] = await listChangedFiles(
        rootDirectory,
        gitBaseSha,
        gitHeadSha,
      );
      const impactedPackageNames: ReadonlySet<string> = getImpactedPackageNames({
        packages,
        rootDirectory,
        changedFiles,
      });

      if (impactedPackageNames.size === 0) {
        logger.info('[skip] No impacted publishable package detected.');
        return [];
      }

      candidatePackages = packages.filter((pkg: PublishablePackage): boolean =>
        impactedPackageNames.has(pkg.name),
      );
    }
  }

  const publishVersionByPackageName: ReadonlyMap<string, string> = new Map(
    candidatePackages.map((pkg: PublishablePackage): readonly [string, string] => [
      pkg.name,
      computePublishVersion({
        baseVersion: pkg.version,
        tag,
        strict: strictVersionPolicy,
        publishTimestamp,
      }),
    ]),
  );

  const internalDependencyVersionOverrides: Readonly<Record<string, string>> =
    tag === 'latest'
      ? {}
      : Object.fromEntries(
          Array.from(publishVersionByPackageName.entries()).filter(
            ([, version]: readonly [string, string]): boolean => version.includes('-'),
          ),
        );

  for (const pkg of candidatePackages) {
    const publishVersion: string = publishVersionByPackageName.get(pkg.name)!;
    const isPublished: boolean = await isNpmVersionPublished(pkg.name, publishVersion);

    if (isPublished) {
      logger.info(`[skip] ${pkg.name}@${publishVersion} already exists on npm.`);
      decisions.push({
        packageName: pkg.name,
        baseVersion: pkg.version,
        publishVersion,
        tag,
        action: 'skip',
      });
      continue;
    }

    if (dryRun) {
      logger.info(`[dry-run] Would publish ${pkg.name}@${publishVersion} with tag "${tag}".`);
      decisions.push({
        packageName: pkg.name,
        baseVersion: pkg.version,
        publishVersion,
        tag,
        action: 'publish-dry-run',
      });
      continue;
    }

    logger.info(`[publish] ${pkg.name}@${publishVersion} with tag "${tag}".`);
    await publishWorkspacePackage(pkg.name, {
      ...(Object.keys(internalDependencyVersionOverrides).length > 0
        ? {
            internalDependencyVersionOverrides,
          }
        : {}),
      tag,
      version: publishVersion,
    });

    decisions.push({
      packageName: pkg.name,
      baseVersion: pkg.version,
      publishVersion,
      tag,
      action: 'publish',
    });
  }

  return decisions;
}
