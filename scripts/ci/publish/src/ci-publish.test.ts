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
    dryRun: false,
    strictVersionPolicy: true,
    rootDirectory: '/repo',
    logger,
    ...overrides,
  };
}

describe('ciPublish', () => {
  it('publishes only missing versions in topological order', async () => {
    const packages: readonly PublishablePackage[] = [
      {
        directory: '/repo/packages/b',
        name: '@scope/b',
        version: '1.0.0-rc.1',
        dependencies: ['@scope/a'],
      },
      {
        directory: '/repo/packages/a',
        name: '@scope/a',
        version: '1.0.0-rc.1',
        dependencies: [],
      },
    ];

    const publishWorkspacePackage: PublishWorkspacePackage = vi.fn(async () => {});
    const isPublished = vi
      .fn<(name: string, version: string) => Promise<boolean>>()
      .mockImplementation(async (name: string) => name === '@scope/b');

    const decisions = await ciPublish(createOptions(), {
      discoverPublishablePackages: async () => packages,
      isNpmVersionPublished: isPublished,
      publishWorkspacePackage,
    });

    expect(isPublished).toHaveBeenNthCalledWith(1, '@scope/a', '1.0.0-rc.1');
    expect(isPublished).toHaveBeenNthCalledWith(2, '@scope/b', '1.0.0-rc.1');
    expect(publishWorkspacePackage).toHaveBeenCalledTimes(1);
    expect(publishWorkspacePackage).toHaveBeenCalledWith('@scope/a', 'rc');
    expect(decisions).toEqual([
      { packageName: '@scope/a', version: '1.0.0-rc.1', tag: 'rc', action: 'publish' },
      { packageName: '@scope/b', version: '1.0.0-rc.1', tag: 'rc', action: 'skip' },
    ]);
  });

  it('does not publish in dry-run mode', async () => {
    const publishWorkspacePackage: PublishWorkspacePackage = vi.fn(async () => {});

    const decisions = await ciPublish(createOptions({ dryRun: true }), {
      discoverPublishablePackages: async () => [
        {
          directory: '/repo/packages/a',
          name: '@scope/a',
          version: '1.0.0-rc.1',
          dependencies: [],
        },
      ],
      isNpmVersionPublished: async () => false,
      publishWorkspacePackage,
    });

    expect(publishWorkspacePackage).not.toHaveBeenCalled();
    expect(decisions).toEqual([
      { packageName: '@scope/a', version: '1.0.0-rc.1', tag: 'rc', action: 'publish-dry-run' },
    ]);
  });

  it('fails when strict branch policy does not match package version', async () => {
    await expect(
      ciPublish(createOptions(), {
        discoverPublishablePackages: async () => [
          {
            directory: '/repo/packages/a',
            name: '@scope/a',
            version: '1.0.0',
            dependencies: [],
          },
        ],
        isNpmVersionPublished: async () => false,
        publishWorkspacePackage: async () => {},
      }),
    ).rejects.toThrow('must be an rc version');
  });
});
