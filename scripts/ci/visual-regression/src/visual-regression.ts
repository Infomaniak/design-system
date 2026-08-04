export const VR_COMMENT_MARKER: string = '<!-- visual-regression-report -->';

export type VisualRegressionStatus = 'passed' | 'failed' | 'errored' | 'no-stories';

export interface VisualRegressionResult {
  readonly status: VisualRegressionStatus;
  readonly passed: number;
  readonly failed: number;
  readonly skippedNew: number;
  readonly skippedMissing: number;
  readonly errored: number;
  readonly total: number;
  readonly failedStoryIds: readonly string[];
  readonly skippedNewStoryIds: readonly string[];
  readonly skippedMissingStoryIds: readonly string[];
  readonly errorStoryIds: readonly string[];
  readonly errorMessage?: string;
}

export interface VrMetadata {
  readonly newStoryIds: readonly string[];
  readonly missingStoryIds: readonly string[];
}

export interface CreateVisualRegressionCommentInput {
  readonly result: VisualRegressionResult;
  readonly runUrl: string;
  readonly artifactName?: string;
  readonly artifactRetentionDays?: number;
}

function renderStoryTable(title: string, storyIds: readonly string[]): string | null {
  if (storyIds.length === 0) {
    return null;
  }

  const rows: string = storyIds.map((id: string): string => `| \`${id}\` |`).join('\n');

  return [`### ${title}`, '', '| Story ID |', '|----------|', rows].join('\n');
}

export function createVisualRegressionCommentMessage({
  result,
  runUrl,
  artifactName,
  artifactRetentionDays = 3,
}: CreateVisualRegressionCommentInput): string {
  const lines: string[] = [VR_COMMENT_MARKER];

  if (result.status === 'no-stories') {
    lines.push('## 🎨 Visual Regression Report', '');
    lines.push('No stories tagged `vr-test` were found. Nothing to test.', '');
    lines.push(`- **Workflow run**: [View details](${runUrl})`);
    return lines.join('\n');
  }

  const statusIcon: string =
    result.status === 'passed' ? '✅' : result.status === 'errored' ? '💥' : '⚠️';
  const statusLabel: string =
    result.status === 'passed'
      ? 'all stories passed'
      : result.status === 'errored'
        ? 'errors occurred'
        : 'visual changes detected';

  lines.push(`## ${statusIcon} Visual Regression Report`, '');
  lines.push(
    `**${statusLabel}** — ✅ ${result.passed} passed | ⚠️ ${result.failed} changed | ⏭️ ${result.skippedNew + result.skippedMissing} skipped | 💥 ${result.errored} errored`,
  );
  lines.push('');
  lines.push(`- **Total stories**: ${result.total}`);
  lines.push(`- **Workflow run**: [View details](${runUrl})`);

  const artifactLine: string =
    artifactName !== undefined && artifactName.trim() !== ''
      ? `- **Report artifact**: \`${artifactName}\` (retention: ${artifactRetentionDays} days)`
      : '- **Report artifact**: not uploaded';

  lines.push(artifactLine);

  if (result.errorMessage !== undefined && result.errorMessage !== '') {
    lines.push('', `> ⚠️ ${result.errorMessage}`);
  }

  const failedTable: string | null = renderStoryTable('Changed stories', result.failedStoryIds);
  if (failedTable !== null) {
    lines.push('', failedTable);
  }

  const errorTable: string | null = renderStoryTable('Errored stories', result.errorStoryIds);
  if (errorTable !== null) {
    lines.push('', errorTable);
  }

  const newTable: string | null = renderStoryTable(
    'Skipped stories (new — not on develop)',
    result.skippedNewStoryIds,
  );
  if (newTable !== null) {
    lines.push('', newTable);
  }

  const missingTable: string | null = renderStoryTable(
    'Skipped stories (missing — not on PR)',
    result.skippedMissingStoryIds,
  );
  if (missingTable !== null) {
    lines.push('', missingTable);
  }

  return lines.join('\n');
}

interface PlaywrightJsonReportSpec {
  readonly title: string;
  readonly ok: boolean;
  readonly tests: readonly { readonly status: string }[];
}

interface PlaywrightJsonReportSuite {
  readonly title: string;
  readonly specs?: readonly PlaywrightJsonReportSpec[];
  readonly suites?: readonly PlaywrightJsonReportSuite[];
}

interface PlaywrightJsonReport {
  readonly suites?: readonly PlaywrightJsonReportSuite[];
  readonly stats?: {
    readonly expected?: number;
    readonly unexpected?: number;
    readonly flaky?: number;
    readonly skipped?: number;
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isSpec(value: unknown): value is PlaywrightJsonReportSpec {
  if (!isRecord(value)) {
    return false;
  }

  return typeof value['title'] === 'string' && typeof value['ok'] === 'boolean';
}

function collectSpecs(
  suites: readonly PlaywrightJsonReportSuite[],
): readonly PlaywrightJsonReportSpec[] {
  const result: PlaywrightJsonReportSpec[] = [];

  for (const suite of suites) {
    if (Array.isArray(suite.specs)) {
      for (const spec of suite.specs) {
        if (isSpec(spec)) {
          result.push(spec);
        }
      }
    }

    if (Array.isArray(suite.suites)) {
      result.push(...collectSpecs(suite.suites));
    }
  }

  return result;
}

function deriveSpecStatus(
  spec: PlaywrightJsonReportSpec,
): 'passed' | 'failed' | 'errored' | 'skipped' {
  const testStatuses: readonly string[] = spec.tests.map(
    (test: { readonly status: string }): string => test.status,
  );

  if (testStatuses.includes('skipped')) {
    return 'skipped';
  }

  if (spec.ok) {
    return 'passed';
  }

  if (testStatuses.includes('unexpected') || testStatuses.includes('flaky')) {
    return 'failed';
  }

  return 'errored';
}

export function parsePlaywrightJsonReport(reportJson: unknown): VisualRegressionResult {
  if (!isRecord(reportJson)) {
    return {
      status: 'errored',
      passed: 0,
      failed: 0,
      skippedNew: 0,
      skippedMissing: 0,
      errored: 0,
      total: 0,
      failedStoryIds: [],
      skippedNewStoryIds: [],
      skippedMissingStoryIds: [],
      errorStoryIds: [],
      errorMessage: 'Invalid Playwright report format.',
    };
  }

  const report: PlaywrightJsonReport = reportJson as PlaywrightJsonReport;
  const suites: readonly PlaywrightJsonReportSuite[] = Array.isArray(report.suites)
    ? report.suites
    : [];
  const specs: readonly PlaywrightJsonReportSpec[] = collectSpecs(suites);

  const failedStoryIds: string[] = [];
  const errorStoryIds: string[] = [];
  const skippedStoryIds: string[] = [];
  let passed: number = 0;

  for (const spec of specs) {
    const status: 'passed' | 'failed' | 'errored' | 'skipped' = deriveSpecStatus(spec);

    if (status === 'skipped') {
      skippedStoryIds.push(spec.title);
      continue;
    }

    if (status === 'passed') {
      passed++;
      continue;
    }

    if (status === 'failed') {
      failedStoryIds.push(spec.title);
    } else {
      errorStoryIds.push(spec.title);
    }
  }

  const failed: number = failedStoryIds.length;
  const errored: number = errorStoryIds.length;
  const skipped: number = skippedStoryIds.length;
  const total: number = passed + failed + errored + skipped;

  let status: VisualRegressionStatus;

  if (total === 0) {
    status = 'no-stories';
  } else if (errored > 0) {
    status = 'errored';
  } else if (failed > 0) {
    status = 'failed';
  } else {
    status = 'passed';
  }

  return {
    status,
    passed,
    failed,
    skippedNew: 0,
    skippedMissing: 0,
    errored,
    total,
    failedStoryIds,
    skippedNewStoryIds: [],
    skippedMissingStoryIds: [],
    errorStoryIds,
  };
}

export function mergeMetadata(
  result: VisualRegressionResult,
  metadata: VrMetadata,
): VisualRegressionResult {
  const newStoryIds: readonly string[] = metadata.newStoryIds;
  const missingStoryIds: readonly string[] = metadata.missingStoryIds;

  const skippedNew: number = newStoryIds.length;
  const skippedMissing: number = missingStoryIds.length;

  const previousSkipped: number = result.total - result.passed - result.failed - result.errored;
  const remainingSkipped: number = Math.max(0, previousSkipped - skippedNew - skippedMissing);

  return {
    ...result,
    skippedNew,
    skippedMissing,
    skippedNewStoryIds: newStoryIds,
    skippedMissingStoryIds: missingStoryIds,
    total:
      result.passed +
      result.failed +
      result.errored +
      remainingSkipped +
      skippedNew +
      skippedMissing,
  };
}
