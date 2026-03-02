import { afterEach, describe, expect, it, vi } from 'vitest';
import { Logger } from '../../../helpers/log/logger.ts';
import type {
  CiPublishOptions,
  PublishablePackage,
  PublishWorkspacePackage,
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

describe('ciPublish path normalization', () => {
  afterEach(() => {
    vi.doUnmock('node:path');
    vi.resetModules();
  });

  it('uses node:path.normalize when matching changed files to packages', async () => {
    const pathModule = await vi.importActual<typeof import('node:path')>('node:path');
    const normalizeSpy = vi.fn(pathModule.win32.normalize);

    vi.doMock('node:path', () => ({
      ...pathModule,
      join: pathModule.win32.join,
      normalize: normalizeSpy,
      resolve: pathModule.win32.resolve,
      sep: pathModule.win32.sep,
    }));

    const { ciPublish } = await import('./ci-publish.ts');

    const packages: readonly PublishablePackage[] = [
      {
        directory: 'C:\\repo\\packages\\a',
        name: '@scope/a',
        version: '1.0.0',
        dependencies: [],
      },
    ];

    const publishWorkspacePackage: PublishWorkspacePackage = vi.fn(async () => {});
    const listChangedFiles = vi
      .fn<(rootDirectory: string, baseSha: string, headSha: string) => Promise<readonly string[]>>()
      .mockResolvedValue(['packages\\a\\src\\index.ts']);

    await ciPublish(
      createOptions({
        eventName: 'pull_request',
        branchName: 'develop',
        pullRequestLabels: ['dev'],
        rootDirectory: 'C:\\repo',
      }),
      {
        discoverPublishablePackages: async () => packages,
        isNpmVersionPublished: async () => false,
        listChangedFiles,
        publishWorkspacePackage,
      },
    );

    expect(normalizeSpy).toHaveBeenCalled();
    expect(publishWorkspacePackage).toHaveBeenCalledWith('@scope/a', {
      internalDependencyVersionOverrides: {
        '@scope/a': '1.0.0-dev.1700000000000',
      },
      tag: 'dev',
      version: '1.0.0-dev.1700000000000',
    });
  });
});
