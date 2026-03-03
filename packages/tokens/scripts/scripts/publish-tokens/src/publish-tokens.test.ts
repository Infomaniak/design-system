import { describe, expect, it } from 'vitest';
import {
  buildNpmPublishArgs,
  resolvePublishVersion,
  rewriteInternalDependencyVersions,
} from './publish-tokens.ts';

describe('buildNpmPublishArgs', () => {
  it('does not set tag when publishing to latest', () => {
    expect(buildNpmPublishArgs({ tag: 'latest' })).toEqual([
      '--//registry.npmjs.org/:_authToken=$NPM_TOKEN',
      'publish',
      '--access',
      'public',
    ]);
  });

  it('sets dist-tag when publishing to a prerelease channel', () => {
    expect(buildNpmPublishArgs({ tag: 'rc' })).toEqual([
      '--//registry.npmjs.org/:_authToken=$NPM_TOKEN',
      'publish',
      '--access',
      'public',
      '--tag',
      'rc',
    ]);
  });
});

describe('resolvePublishVersion', () => {
  it('uses explicit ci override when provided', () => {
    expect(
      resolvePublishVersion({
        tag: 'latest',
        packageVersion: '1.2.3',
        publishTimestamp: 1234,
        versionOverride: '1.2.3-rc.1234',
      }),
    ).toBe('1.2.3-rc.1234');
  });

  it('generates dev prerelease from dev tag without override', () => {
    expect(
      resolvePublishVersion({
        tag: 'dev',
        packageVersion: '1.2.3',
        publishTimestamp: 1234,
      }),
    ).toBe('1.2.3-dev.1234');
  });

  it('returns package version when publishing to latest without override', () => {
    expect(
      resolvePublishVersion({
        tag: 'latest',
        packageVersion: '1.2.3',
        publishTimestamp: 1234,
      }),
    ).toBe('1.2.3');
  });

  it('generates rc prerelease from rc tag without override', () => {
    expect(
      resolvePublishVersion({
        tag: 'rc',
        packageVersion: '1.2.3',
        publishTimestamp: 1234,
      }),
    ).toBe('1.2.3-rc.1234');
  });
});

describe('rewriteInternalDependencyVersions', () => {
  it('rewrites internal versions in dependency fields', () => {
    expect(
      rewriteInternalDependencyVersions({
        packageJsonContent: {
          name: '@scope/b',
          version: '1.2.3',
          dependencies: {
            '@scope/a': '1.2.3',
            react: '^19.0.0',
          },
          peerDependencies: {
            '@scope/c': '2.0.0',
          },
        },
        overrides: {
          '@scope/a': '1.2.3-rc.1234',
          '@scope/c': '2.0.0-rc.1234',
        },
      }),
    ).toEqual({
      name: '@scope/b',
      version: '1.2.3',
      dependencies: {
        '@scope/a': '1.2.3-rc.1234',
        react: '^19.0.0',
      },
      peerDependencies: {
        '@scope/c': '2.0.0-rc.1234',
      },
    });
  });

  it('returns input as-is when no overrides are provided', () => {
    const packageJsonContent = {
      name: '@scope/b',
      version: '1.2.3',
      dependencies: {
        '@scope/a': '1.2.3',
      },
    };

    expect(
      rewriteInternalDependencyVersions({
        packageJsonContent,
        overrides: {},
      }),
    ).toBe(packageJsonContent);
  });
});
