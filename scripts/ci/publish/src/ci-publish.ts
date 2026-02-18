import { readdir } from 'node:fs/promises';
import { Dirent } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';
import { readJsonFile } from '../../../helpers/file/read-json-file.ts';
import { type Logger } from '../../../helpers/log/logger.ts';
import { execCommandInherit } from '../../../helpers/misc/exec-command.ts';
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
  readonly branchName: string;
  readonly strictVersionPolicy: boolean;
  readonly dryRun: boolean;
  readonly logger: Logger;
}

export type IsNpmVersionPublished = (name: string, version: string) => Promise<boolean>;

export type PublishWorkspacePackage = (workspaceName: string, tag: PublishContext['tag']) => Promise<void>;

export interface CiPublishDependencies {
  readonly discoverPublishablePackages?: (rootDirectory: string) => Promise<readonly PublishablePackage[]>;
  readonly isNpmVersionPublished?: IsNpmVersionPublished;
  readonly publishWorkspacePackage?: PublishWorkspacePackage;
}

export interface CiPublishDecision {
  readonly packageName: string;
  readonly version: string;
  readonly tag: PublishContext['tag'];
  readonly action: 'skip' | 'publish' | 'publish-dry-run';
}

interface PackageJson {
  readonly name?: unknown;
  readonly version?: unknown;
  readonly scripts?: unknown;
  readonly dependencies?: unknown;
}

export async function discoverPublishablePackages(
  rootDirectory: string,
): Promise<readonly PublishablePackage[]> {
  const packagesDirectory: string = join(rootDirectory, 'packages');
  const entries: readonly Dirent[] = await readdir(packagesDirectory, {
    withFileTypes: true,
  });

  const publishablePackages: PublishablePackage[] = [];

  for (const entry of Array.from(entries).sort((a, b) => a.name.localeCompare(b.name))) {
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

function createWorkspacePublisher({
  logger,
  rootDirectory,
}: {
  readonly logger: Logger;
  readonly rootDirectory: string;
}): PublishWorkspacePackage {
  return async (workspaceName: string, tag: PublishContext['tag']): Promise<void> => {
    await execCommandInherit(logger, 'yarn', ['workspace', workspaceName, 'run', 'publish:ci'], {
      shell: true,
      cwd: rootDirectory,
      env: {
        ...process.env,
        NPM_DIST_TAG: tag,
      },
    });
  };
}

export async function ciPublish(
  { rootDirectory, branchName, strictVersionPolicy, dryRun, logger }: CiPublishOptions,
  {
    discoverPublishablePackages: discover = discoverPublishablePackages,
    isNpmVersionPublished = defaultIsNpmVersionPublished,
    publishWorkspacePackage = createWorkspacePublisher({
      logger,
      rootDirectory,
    }),
  }: CiPublishDependencies = {},
): Promise<readonly CiPublishDecision[]> {
  const discoveredPackages: readonly PublishablePackage[] = await discover(rootDirectory);
  const packages: readonly PublishablePackage[] = topologicalSortPackages(discoveredPackages);

  if (packages.length === 0) {
    logger.warn('No publishable package found (missing script "publish:ci").');
    return [];
  }

  const decisions: CiPublishDecision[] = [];

  for (const pkg of packages) {
    const { tag }: PublishContext = getPublishContext({
      branchName,
      version: pkg.version,
      strict: strictVersionPolicy,
    });

    const isPublished: boolean = await isNpmVersionPublished(pkg.name, pkg.version);

    if (isPublished) {
      logger.info(`[skip] ${pkg.name}@${pkg.version} already exists on npm.`);
      decisions.push({
        packageName: pkg.name,
        version: pkg.version,
        tag,
        action: 'skip',
      });
      continue;
    }

    if (dryRun) {
      logger.info(`[dry-run] Would publish ${pkg.name}@${pkg.version} with tag "${tag}".`);
      decisions.push({
        packageName: pkg.name,
        version: pkg.version,
        tag,
        action: 'publish-dry-run',
      });
      continue;
    }

    logger.info(`[publish] ${pkg.name}@${pkg.version} with tag "${tag}".`);
    await publishWorkspacePackage(pkg.name, tag);

    decisions.push({
      packageName: pkg.name,
      version: pkg.version,
      tag,
      action: 'publish',
    });
  }

  return decisions;
}
