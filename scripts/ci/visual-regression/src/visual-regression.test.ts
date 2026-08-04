import { describe, expect, it } from 'vitest';
import {
  createVisualRegressionCommentMessage,
  mergeMetadata,
  parsePlaywrightJsonReport,
  VR_COMMENT_MARKER,
  type VisualRegressionResult,
  type VrMetadata,
} from './visual-regression.ts';

function makeResult(overrides: Partial<VisualRegressionResult> = {}): VisualRegressionResult {
  return {
    status: 'passed',
    passed: 3,
    failed: 0,
    skippedNew: 0,
    skippedMissing: 0,
    errored: 0,
    total: 3,
    failedStoryIds: [],
    skippedNewStoryIds: [],
    skippedMissingStoryIds: [],
    errorStoryIds: [],
    ...overrides,
  };
}

function makeMetadata(overrides: Partial<VrMetadata> = {}): VrMetadata {
  return {
    newStoryIds: [],
    missingStoryIds: [],
    ...overrides,
  };
}

function spec(
  title: string,
  ok: boolean,
  testStatuses: readonly string[] = ['expected'],
): { title: string; ok: boolean; tests: { status: string }[] } {
  return {
    title,
    ok,
    tests: testStatuses.map((status: string): { status: string } => ({ status })),
  };
}

function report(...specs: readonly { title: string; ok: boolean; tests: { status: string }[] }[]): {
  suites: { specs: typeof specs }[];
} {
  return { suites: [{ specs }] };
}

function nestedReport(
  ...suiteSpecs: {
    title: string;
    specs: { title: string; ok: boolean; tests: { status: string }[] }[];
  }[]
): {
  suites: { title: string; specs: { title: string; ok: boolean; tests: { status: string }[] }[] }[];
} {
  return { suites: suiteSpecs };
}

describe('VR_COMMENT_MARKER', () => {
  it('is a hidden HTML comment', () => {
    expect(VR_COMMENT_MARKER).toBe('<!-- visual-regression-report -->');
    expect(VR_COMMENT_MARKER.startsWith('<!--')).toBe(true);
    expect(VR_COMMENT_MARKER.endsWith('-->')).toBe(true);
  });
});

describe('createVisualRegressionCommentMessage', () => {
  it('includes the hidden marker on every variant', () => {
    const passed: string = createVisualRegressionCommentMessage({
      result: makeResult(),
      runUrl: 'https://github.com/test/repo/actions/runs/1',
    });

    const failed: string = createVisualRegressionCommentMessage({
      result: makeResult({
        status: 'failed',
        failed: 1,
        failedStoryIds: ['components-icon--default'],
      }),
      runUrl: 'https://github.com/test/repo/actions/runs/1',
    });

    const noStories: string = createVisualRegressionCommentMessage({
      result: makeResult({ status: 'no-stories', total: 0, passed: 0 }),
      runUrl: 'https://github.com/test/repo/actions/runs/1',
    });

    expect(passed.startsWith(VR_COMMENT_MARKER)).toBe(true);
    expect(failed.startsWith(VR_COMMENT_MARKER)).toBe(true);
    expect(noStories.startsWith(VR_COMMENT_MARKER)).toBe(true);
  });

  it('renders a passed report with counts and run URL', () => {
    const message: string = createVisualRegressionCommentMessage({
      result: makeResult({ passed: 5, total: 5 }),
      runUrl: 'https://github.com/test/repo/actions/runs/42',
    });

    expect(message).toContain('## ✅ Visual Regression Report');
    expect(message).toContain('✅ 5 passed');
    expect(message).toContain('[View details](https://github.com/test/repo/actions/runs/42)');
    expect(message).toContain('**Total stories**: 5');
    expect(message).toContain('not uploaded');
  });

  it('renders a failed report with changed story IDs table', () => {
    const message: string = createVisualRegressionCommentMessage({
      result: makeResult({
        status: 'failed',
        passed: 2,
        failed: 1,
        total: 3,
        failedStoryIds: ['components-icon--default'],
      }),
      runUrl: 'https://example.com/run',
    });

    expect(message).toContain('## ⚠️ Visual Regression Report');
    expect(message).toContain('visual changes detected');
    expect(message).toContain('### Changed stories');
    expect(message).toContain('| `components-icon--default` |');
  });

  it('renders an errored report with error story IDs table', () => {
    const message: string = createVisualRegressionCommentMessage({
      result: makeResult({
        status: 'errored',
        passed: 1,
        errored: 1,
        total: 2,
        errorStoryIds: ['components-icon--preprod'],
      }),
      runUrl: 'https://example.com/run',
    });

    expect(message).toContain('## 💥 Visual Regression Report');
    expect(message).toContain('errors occurred');
    expect(message).toContain('### Errored stories');
    expect(message).toContain('| `components-icon--preprod` |');
  });

  it('renders a no-stories report', () => {
    const message: string = createVisualRegressionCommentMessage({
      result: makeResult({ status: 'no-stories', total: 0, passed: 0 }),
      runUrl: 'https://example.com/run',
    });

    expect(message).toContain('No stories tagged `vr-test` were found.');
    expect(message).not.toContain('Total stories');
  });

  it('includes artifact info when provided', () => {
    const message: string = createVisualRegressionCommentMessage({
      result: makeResult(),
      runUrl: 'https://example.com/run',
      artifactName: 'visual-regression-report-42',
      artifactRetentionDays: 7,
    });

    expect(message).toContain(
      '**Report artifact**: `visual-regression-report-42` (retention: 7 days)',
    );
  });

  it('includes error message when provided', () => {
    const message: string = createVisualRegressionCommentMessage({
      result: makeResult({ status: 'errored', errorMessage: 'Browser launch failed' }),
      runUrl: 'https://example.com/run',
    });

    expect(message).toContain('> ⚠️ Browser launch failed');
  });

  it('renders skipped-new stories table when present', () => {
    const message: string = createVisualRegressionCommentMessage({
      result: makeResult({
        skippedNew: 1,
        total: 4,
        skippedNewStoryIds: ['components-button--default'],
      }),
      runUrl: 'https://example.com/run',
    });

    expect(message).toContain('### Skipped stories (new — not on develop)');
    expect(message).toContain('| `components-button--default` |');
  });

  it('renders skipped-missing stories table when present', () => {
    const message: string = createVisualRegressionCommentMessage({
      result: makeResult({
        skippedMissing: 1,
        total: 4,
        skippedMissingStoryIds: ['components-old--default'],
      }),
      runUrl: 'https://example.com/run',
    });

    expect(message).toContain('### Skipped stories (missing — not on PR)');
    expect(message).toContain('| `components-old--default` |');
  });

  it('does not render empty story tables', () => {
    const message: string = createVisualRegressionCommentMessage({
      result: makeResult(),
      runUrl: 'https://example.com/run',
    });

    expect(message).not.toContain('### Changed stories');
    expect(message).not.toContain('### Errored stories');
    expect(message).not.toContain('### Skipped stories');
  });

  it('uses default retention of 3 days when not specified', () => {
    const message: string = createVisualRegressionCommentMessage({
      result: makeResult(),
      runUrl: 'https://example.com/run',
      artifactName: 'report-1',
    });

    expect(message).toContain('retention: 3 days');
  });
});

describe('parsePlaywrightJsonReport', () => {
  it('parses a fully-passing report', () => {
    const result: VisualRegressionResult = parsePlaywrightJsonReport(
      report(
        spec('components-icon--default', true),
        spec('components-icon--preprod', true),
        spec('components-button--default', true),
      ),
    );

    expect(result.status).toBe('passed');
    expect(result.passed).toBe(3);
    expect(result.failed).toBe(0);
    expect(result.errored).toBe(0);
    expect(result.total).toBe(3);
    expect(result.failedStoryIds).toEqual([]);
    expect(result.errorStoryIds).toEqual([]);
  });

  it('parses a report with failures (unexpected status)', () => {
    const result: VisualRegressionResult = parsePlaywrightJsonReport(
      report(
        spec('components-icon--default', true),
        spec('components-icon--preprod', false, ['unexpected']),
      ),
    );

    expect(result.status).toBe('failed');
    expect(result.passed).toBe(1);
    expect(result.failed).toBe(1);
    expect(result.failedStoryIds).toEqual(['components-icon--preprod']);
  });

  it('parses a report with flaky tests as failures', () => {
    const result: VisualRegressionResult = parsePlaywrightJsonReport(
      report(spec('flaky-story', false, ['flaky'])),
    );

    expect(result.status).toBe('failed');
    expect(result.failed).toBe(1);
    expect(result.failedStoryIds).toEqual(['flaky-story']);
  });

  it('parses a report with errors (ok=false but status not unexpected/flaky)', () => {
    const result: VisualRegressionResult = parsePlaywrightJsonReport(
      report(spec('broken-story', false, ['expected'])),
    );

    expect(result.status).toBe('errored');
    expect(result.errored).toBe(1);
    expect(result.errorStoryIds).toEqual(['broken-story']);
  });

  it('parses a report with skipped specs', () => {
    const result: VisualRegressionResult = parsePlaywrightJsonReport(
      report(spec('skipped-story', false, ['skipped']), spec('passed-story', true)),
    );

    expect(result.passed).toBe(1);
    expect(result.total).toBe(2);
  });

  it('returns no-stories when suites is empty', () => {
    const result: VisualRegressionResult = parsePlaywrightJsonReport({ suites: [] });

    expect(result.status).toBe('no-stories');
    expect(result.total).toBe(0);
  });

  it('returns errored on invalid (non-object) report', () => {
    const result: VisualRegressionResult = parsePlaywrightJsonReport('invalid');

    expect(result.status).toBe('errored');
    expect(result.errorMessage).toBe('Invalid Playwright report format.');
  });

  it('returns errored on null report', () => {
    const result: VisualRegressionResult = parsePlaywrightJsonReport(null);

    expect(result.status).toBe('errored');
  });

  it('handles missing suites array gracefully', () => {
    const result: VisualRegressionResult = parsePlaywrightJsonReport({ stats: { total: 0 } });

    expect(result.status).toBe('no-stories');
  });

  it('skips non-spec entries in specs array', () => {
    const result: VisualRegressionResult = parsePlaywrightJsonReport({
      suites: [
        {
          specs: [
            spec('valid-story', true),
            'invalid-entry' as unknown as {
              title: string;
              ok: boolean;
              tests: { status: string }[];
            },
            42 as unknown as { title: string; ok: boolean; tests: { status: string }[] },
            null as unknown as { title: string; ok: boolean; tests: { status: string }[] },
          ],
        },
      ],
    });

    expect(result.passed).toBe(1);
    expect(result.total).toBe(1);
  });

  it('handles missing suites array as no-stories', () => {
    const result: VisualRegressionResult = parsePlaywrightJsonReport({});

    expect(result.status).toBe('no-stories');
    expect(result.total).toBe(0);
  });

  it('returns errored status when both failures and errors present', () => {
    const result: VisualRegressionResult = parsePlaywrightJsonReport(
      report(spec('fail-story', false, ['unexpected']), spec('error-story', false, ['expected'])),
    );

    expect(result.status).toBe('errored');
    expect(result.failed).toBe(1);
    expect(result.errored).toBe(1);
  });

  it('flattens nested suites recursively', () => {
    const result: VisualRegressionResult = parsePlaywrightJsonReport(
      nestedReport(
        {
          title: 'outer',
          specs: [spec('outer-story', true)],
        },
        {
          title: 'inner',
          specs: [spec('inner-story', false, ['unexpected'])],
        },
      ),
    );

    expect(result.passed).toBe(1);
    expect(result.failed).toBe(1);
    expect(result.failedStoryIds).toEqual(['inner-story']);
  });

  it('treats spec with mixed skipped and failed tests as skipped', () => {
    const result: VisualRegressionResult = parsePlaywrightJsonReport(
      report(spec('mixed-story', false, ['skipped', 'unexpected'])),
    );

    expect(result.total).toBe(1);
    expect(result.passed).toBe(0);
    expect(result.failed).toBe(0);
  });

  it('treats ok=false with no unexpected/flaky as errored', () => {
    const result: VisualRegressionResult = parsePlaywrightJsonReport(
      report(spec('broken-story', false, ['expected'])),
    );

    expect(result.errored).toBe(1);
    expect(result.errorStoryIds).toEqual(['broken-story']);
  });
});

describe('mergeMetadata', () => {
  it('populates skippedNew and skippedMissing from metadata', () => {
    const result: VisualRegressionResult = makeResult({
      passed: 2,
      total: 4,
    });

    const merged: VisualRegressionResult = mergeMetadata(
      result,
      makeMetadata({
        newStoryIds: ['new-1'],
        missingStoryIds: ['old-1'],
      }),
    );

    expect(merged.skippedNew).toBe(1);
    expect(merged.skippedMissing).toBe(1);
    expect(merged.skippedNewStoryIds).toEqual(['new-1']);
    expect(merged.skippedMissingStoryIds).toEqual(['old-1']);
  });

  it('does not double-count skipped when re-categorizing', () => {
    const result: VisualRegressionResult = makeResult({
      passed: 2,
      total: 5,
    });

    const merged: VisualRegressionResult = mergeMetadata(
      result,
      makeMetadata({
        newStoryIds: ['new-1', 'new-2'],
        missingStoryIds: ['old-1'],
      }),
    );

    expect(merged.skippedNew).toBe(2);
    expect(merged.skippedMissing).toBe(1);
    expect(merged.total).toBe(5);
  });

  it('handles empty metadata gracefully', () => {
    const result: VisualRegressionResult = makeResult({ passed: 3, total: 3 });

    const merged: VisualRegressionResult = mergeMetadata(result, makeMetadata());

    expect(merged.skippedNew).toBe(0);
    expect(merged.skippedMissing).toBe(0);
    expect(merged.skippedNewStoryIds).toEqual([]);
    expect(merged.skippedMissingStoryIds).toEqual([]);
    expect(merged.total).toBe(3);
  });

  it('preserves failed and errored from base result', () => {
    const result: VisualRegressionResult = makeResult({
      status: 'failed',
      passed: 1,
      failed: 1,
      total: 3,
      failedStoryIds: ['fail-1'],
    });

    const merged: VisualRegressionResult = mergeMetadata(
      result,
      makeMetadata({
        newStoryIds: ['new-1'],
      }),
    );

    expect(merged.failed).toBe(1);
    expect(merged.failedStoryIds).toEqual(['fail-1']);
    expect(merged.passed).toBe(1);
  });

  it('clamps remaining skipped to zero when metadata exceeds', () => {
    const result: VisualRegressionResult = makeResult({
      passed: 1,
      total: 2,
    });

    const merged: VisualRegressionResult = mergeMetadata(
      result,
      makeMetadata({
        newStoryIds: ['a', 'b', 'c'],
      }),
    );

    expect(merged.skippedNew).toBe(3);
    expect(merged.total).toBe(1 + 0 + 0 + 0 + 3 + 0);
  });
});
