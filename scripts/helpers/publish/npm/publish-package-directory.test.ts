import { describe, expect, it } from 'vitest';
import {
  buildNpmPublishArgs,
  resolvePublishVersion,
  rewriteInternalDependencyVersions,
} from './publish-package-directory.ts';

describe('buildNpmPublishArgs', () => {
  it('uses dev tag in dev mode', () => {
    expect(buildNpmPublishArgs({ mode: 'dev' })).toEqual([
      '--//registry.npmjs.org/:_authToken=$NPM_TOKEN',
      'publish',
      '--access',
      'public',
      '--tag',
      'dev',
    ]);
  });

  it('does not set tag in prod mode by default', () => {
    expect(buildNpmPublishArgs({ mode: 'prod' })).toEqual([
      '--//registry.npmjs.org/:_authToken=$NPM_TOKEN',
      'publish',
      '--access',
      'public',
    ]);
  });

  it('sets custom dist-tag in prod mode when provided', () => {
    expect(buildNpmPublishArgs({ mode: 'prod', tag: 'rc' })).toEqual([
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
        mode: 'prod',
        packageVersion: '1.2.3',
        publishTimestamp: 1234,
        versionOverride: '1.2.3-rc.1234',
      }),
    ).toBe('1.2.3-rc.1234');
  });

  it('generates dev prerelease in dev mode without override', () => {
    expect(
      resolvePublishVersion({
        mode: 'dev',
        packageVersion: '1.2.3',
        publishTimestamp: 1234,
      }),
    ).toBe('1.2.3-dev.1234');
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
});
