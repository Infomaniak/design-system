import { describe, expect, it, vi } from 'vitest';
import { Logger } from '../../../helpers/log/logger.ts';
import {
  ciPublish,
  type CiPublishOptions,
  type PublishablePackage,
  type PublishWorkspacePackage,
} from './ci-publish.ts';

const logger = Logger.root();

function createOptions(overrides: Partial<CiPublishOptions> = {}): CiPublishOptions {
  return {
    branchName: 'develop',
    eventName: 'push',
    dryRun: false,
    gitBaseSha: 'base-sha',
    gitHeadSha: 'head-sha',
    publishTimestamp: 1_700_000_000_000,
    pullRequestLabels: [],
    strictVersionPolicy: true,
    rootDirectory: '/repo',
    logger,
    ...overrides,
  };
}

describe('ciPublish', () => {
  it('publishes only impacted prerelease versions in topological order and propagates to dependants', async () => {
    const packages: readonly PublishablePackage[] = [
      {
        directory: '/repo/packages/c',
        name: '@scope/c',
        version: '1.0.0',
        dependencies: [],
      },
      {
        directory: '/repo/packages/a',
        name: '@scope/a',
        version: '1.0.0',
        dependencies: [],
      },
      {
        directory: '/repo/packages/b',
        name: '@scope/b',
        version: '1.0.0',
        dependencies: ['@scope/a'],
      },
    ];

    const publishWorkspacePackage: PublishWorkspacePackage = vi.fn(async () => {});
    const listChangedFiles = vi
      .fn<(rootDirectory: string, baseSha: string, headSha: string) => Promise<readonly string[]>>()
      .mockResolvedValue(['packages/a/src/index.ts']);
    const isPublished = vi
      .fn<(name: string, version: string) => Promise<boolean>>()
      .mockImplementation(async (name: string) => name === '@scope/b');

    const decisions = await ciPublish(
      createOptions({
        eventName: 'pull_request',
        branchName: 'develop',
        pullRequestLabels: ['dev'],
      }),
      {
        discoverPublishablePackages: async () => packages,
        isNpmVersionPublished: isPublished,
        listChangedFiles,
        publishWorkspacePackage,
      },
    );

    expect(listChangedFiles).toHaveBeenCalledWith('/repo', 'base-sha', 'head-sha');
    expect(isPublished).toHaveBeenNthCalledWith(1, '@scope/a', '1.0.0-dev.1700000000000');
    expect(isPublished).toHaveBeenNthCalledWith(2, '@scope/b', '1.0.0-dev.1700000000000');
    expect(isPublished).toHaveBeenCalledTimes(2);
    expect(publishWorkspacePackage).toHaveBeenCalledTimes(1);
    expect(publishWorkspacePackage).toHaveBeenCalledWith('@scope/a', {
      internalDependencyVersionOverrides: {
        '@scope/a': '1.0.0-dev.1700000000000',
        '@scope/b': '1.0.0-dev.1700000000000',
      },
      tag: 'dev',
      version: '1.0.0-dev.1700000000000',
    });
    expect(decisions).toEqual([
      {
        action: 'publish',
        baseVersion: '1.0.0',
        packageName: '@scope/a',
        publishVersion: '1.0.0-dev.1700000000000',
        tag: 'dev',
      },
      {
        action: 'skip',
        baseVersion: '1.0.0',
        packageName: '@scope/b',
        publishVersion: '1.0.0-dev.1700000000000',
        tag: 'dev',
      },
    ]);
  });

  it('does not publish on pull requests without dev label', async () => {
    const publishWorkspacePackage: PublishWorkspacePackage = vi.fn(async () => {});
    const listChangedFiles = vi.fn(async () => ['packages/a/src/index.ts']);

    const decisions = await ciPublish(
      createOptions({
        eventName: 'pull_request',
        branchName: 'main',
        pullRequestLabels: ['qa'],
      }),
      {
        discoverPublishablePackages: async () => [
          {
            directory: '/repo/packages/a',
            name: '@scope/a',
            version: '1.0.0',
            dependencies: [],
          },
        ],
        isNpmVersionPublished: async () => false,
        listChangedFiles,
        publishWorkspacePackage,
      },
    );

    expect(listChangedFiles).not.toHaveBeenCalled();
    expect(publishWorkspacePackage).not.toHaveBeenCalled();
    expect(decisions).toEqual([]);
  });

  it('does not publish in dry-run mode', async () => {
    const publishWorkspacePackage: PublishWorkspacePackage = vi.fn(async () => {});

    const decisions = await ciPublish(
      createOptions({ dryRun: true, eventName: 'push', branchName: 'develop' }),
      {
        discoverPublishablePackages: async () => [
          {
            directory: '/repo/packages/a',
            name: '@scope/a',
            version: '1.0.0',
            dependencies: [],
          },
        ],
        isNpmVersionPublished: async () => false,
        listChangedFiles: async () => ['packages/a/src/index.ts'],
        publishWorkspacePackage,
      },
    );

    expect(publishWorkspacePackage).not.toHaveBeenCalled();
    expect(decisions).toEqual([
      {
        action: 'publish-dry-run',
        baseVersion: '1.0.0',
        packageName: '@scope/a',
        publishVersion: '1.0.0-rc.1700000000000',
        tag: 'rc',
      },
    ]);
  });

  it('publishes stable versions on main without change detection', async () => {
    const publishWorkspacePackage: PublishWorkspacePackage = vi.fn(async () => {});
    const listChangedFiles = vi.fn(async () => ['packages/a/src/index.ts']);

    const decisions = await ciPublish(
      createOptions({
        branchName: 'main',
        eventName: 'push',
      }),
      {
        discoverPublishablePackages: async () => [
          {
            directory: '/repo/packages/a',
            name: '@scope/a',
            version: '2.0.0',
            dependencies: [],
          },
        ],
        isNpmVersionPublished: async () => false,
        listChangedFiles,
        publishWorkspacePackage,
      },
    );

    expect(listChangedFiles).not.toHaveBeenCalled();
    expect(publishWorkspacePackage).toHaveBeenCalledWith('@scope/a', {
      tag: 'latest',
      version: '2.0.0',
    });
    expect(decisions[0]).toEqual({
      action: 'publish',
      baseVersion: '2.0.0',
      packageName: '@scope/a',
      publishVersion: '2.0.0',
      tag: 'latest',
    });
  });

  it('fails when strict version policy sees a prerelease in package.json', async () => {
    await expect(
      ciPublish(createOptions({ eventName: 'push', branchName: 'develop' }), {
        discoverPublishablePackages: async () => [
          {
            directory: '/repo/packages/a',
            name: '@scope/a',
            version: '1.0.0-rc.1',
            dependencies: [],
          },
        ],
        isNpmVersionPublished: async () => false,
        listChangedFiles: async () => ['packages/a/src/index.ts'],
        publishWorkspacePackage: async () => {},
      }),
    ).rejects.toThrow('must be a stable version');
  });
});
