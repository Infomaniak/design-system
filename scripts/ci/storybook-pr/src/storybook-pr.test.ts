import { describe, expect, it } from 'vitest';
import {
  createStorybookPrCommentMessage,
  evaluateStorybookPrBuild,
  isStorybookRelevantPath,
  resolveStorybookPrBuildOutcome,
} from './storybook-pr.ts';

describe('isStorybookRelevantPath', () => {
  it('returns true for docs workspace files', () => {
    expect(isStorybookRelevantPath('apps/docs/src/main.tsx')).toBe(true);
  });

  it('returns true for package files', () => {
    expect(isStorybookRelevantPath('packages/tokens/tokens/t1-primitive/color.tokens.json')).toBe(
      true,
    );
  });

  it('returns true for any workspace package path', () => {
    expect(isStorybookRelevantPath('packages/components/src/button.ts')).toBe(true);
  });

  it('returns true for root dependency lockfiles', () => {
    expect(isStorybookRelevantPath('yarn.lock')).toBe(true);
  });

  it('returns false for unrelated files', () => {
    expect(isStorybookRelevantPath('docs/figma/readme.md')).toBe(false);
  });
});

describe('evaluateStorybookPrBuild', () => {
  it('skips when pull request is draft', () => {
    expect(
      evaluateStorybookPrBuild({
        changedFiles: ['apps/docs/src/main.tsx'],
        isDraft: true,
      }),
    ).toEqual({
      changedFilesCount: 1,
      reason: 'draft-pr',
      relevantFiles: ['apps/docs/src/main.tsx'],
      shouldBuild: false,
    });
  });

  it('skips when no relevant files changed', () => {
    expect(
      evaluateStorybookPrBuild({
        changedFiles: ['README.md', 'docs/figma/readme.md'],
        isDraft: false,
      }),
    ).toEqual({
      changedFilesCount: 2,
      reason: 'no-relevant-change',
      relevantFiles: [],
      shouldBuild: false,
    });
  });

  it('builds when relevant files changed and pr is ready', () => {
    expect(
      evaluateStorybookPrBuild({
        changedFiles: ['README.md', 'apps/docs/src/main.tsx'],
        isDraft: false,
      }),
    ).toEqual({
      changedFilesCount: 2,
      reason: 'relevant-change',
      relevantFiles: ['apps/docs/src/main.tsx'],
      shouldBuild: true,
    });
  });
});

describe('resolveStorybookPrBuildOutcome', () => {
  it('returns skipped when build should not run', () => {
    expect(
      resolveStorybookPrBuildOutcome({
        buildStepOutcome: 'skipped',
        shouldBuild: false,
      }),
    ).toBe('skipped');
  });

  it('returns success when build step succeeded', () => {
    expect(
      resolveStorybookPrBuildOutcome({
        buildStepOutcome: 'success',
        shouldBuild: true,
      }),
    ).toBe('success');
  });

  it('returns failure when build step did not succeed', () => {
    expect(
      resolveStorybookPrBuildOutcome({
        buildStepOutcome: 'failure',
        shouldBuild: true,
      }),
    ).toBe('failure');
  });
});

describe('createStorybookPrCommentMessage', () => {
  it('builds success message with artifact', () => {
    const message = createStorybookPrCommentMessage({
      artifactName: 'storybook-pr-42',
      changedFilesCount: 7,
      outcome: 'success',
      reason: 'relevant-change',
      relevantFiles: ['apps/docs/src/main.tsx'],
      runUrl: 'https://github.com/owner/repo/actions/runs/1234',
    });

    expect(message).toContain('✅ Storybook build successful');
    expect(message).toContain('storybook-pr-42');
    expect(message).toContain('https://github.com/owner/repo/actions/runs/1234');
  });

  it('builds skipped message for draft pull request', () => {
    const message = createStorybookPrCommentMessage({
      changedFilesCount: 3,
      outcome: 'skipped',
      reason: 'draft-pr',
      relevantFiles: ['apps/docs/src/main.tsx'],
      runUrl: 'https://github.com/owner/repo/actions/runs/1234',
    });

    expect(message).toContain('⏭️ Storybook build skipped');
    expect(message).toContain('pull request is still in draft');
  });

  it('builds failure message', () => {
    const message = createStorybookPrCommentMessage({
      changedFilesCount: 5,
      outcome: 'failure',
      reason: 'relevant-change',
      relevantFiles: ['apps/docs/src/main.tsx'],
      runUrl: 'https://github.com/owner/repo/actions/runs/1234',
    });

    expect(message).toContain('❌ Storybook build failed');
    expect(message).toContain('check the workflow logs');
  });
});
