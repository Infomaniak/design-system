import { describe, expect, it } from 'vitest';
import { buildNpmPublishArgs } from './publish-tokens.ts';

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
