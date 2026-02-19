import { describe, expect, it } from 'vitest';
import {
  createCleanupCommitMessage,
  isStorybookPrCleanupTargetDirectory,
} from './cleanup-storybook-pr.ts';

describe('isStorybookPrCleanupTargetDirectory', () => {
  it('returns true for storybook mr preview directory', () => {
    expect(isStorybookPrCleanupTargetDirectory('storybook/mr/42')).toBe(true);
  });

  it('returns false for non-pr storybook directories', () => {
    expect(isStorybookPrCleanupTargetDirectory('storybook/main')).toBe(false);
    expect(isStorybookPrCleanupTargetDirectory('storybook/develop')).toBe(false);
    expect(isStorybookPrCleanupTargetDirectory('storybook/tags/v1.0.0')).toBe(false);
  });

  it('returns false for malformed or unsafe values', () => {
    expect(isStorybookPrCleanupTargetDirectory('')).toBe(false);
    expect(isStorybookPrCleanupTargetDirectory('/storybook/mr/42')).toBe(false);
    expect(isStorybookPrCleanupTargetDirectory('storybook/mr/../../main')).toBe(false);
    expect(isStorybookPrCleanupTargetDirectory('../storybook/mr/42')).toBe(false);
  });
});

describe('createCleanupCommitMessage', () => {
  it('builds deterministic commit message', () => {
    expect(createCleanupCommitMessage('42')).toBe('chore(ci): remove storybook preview for pr #42');
  });
});
