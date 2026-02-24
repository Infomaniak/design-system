const STORYBOOK_RELEVANT_PREFIXES: readonly string[] = [
  'apps/docs/',
  'packages/',
  'scripts/ci/storybook-pr/',
];

const STORYBOOK_RELEVANT_FILES: ReadonlySet<string> = new Set<string>([
  'package.json',
  'yarn.lock',
  '.yarnrc.yml',
  'tsconfig.json',
  'vitest.config.ts',
  '.github/workflows/build-storybook.yml',
  '.github/workflows/build-on-pr.yml',
  '.github/workflows/cleanup-storybook-pr.yml',
  '.github/workflows/pr-ready-for-review.yml',
]);

export const STORYBOOK_PR_COMMENT_MARKER: string = '<!-- storybook-build-status -->';

export type StorybookPrBuildReason = 'draft-pr' | 'no-relevant-change' | 'relevant-change';

export interface EvaluateStorybookPrBuildInput {
  readonly isDraft: boolean;
  readonly changedFiles: readonly string[];
}

export interface StorybookPrBuildDecision {
  readonly shouldBuild: boolean;
  readonly reason: StorybookPrBuildReason;
  readonly changedFilesCount: number;
  readonly relevantFiles: readonly string[];
}

export type StorybookPrBuildOutcome = 'success' | 'failure' | 'skipped';

export interface ResolveStorybookPrBuildOutcomeInput {
  readonly shouldBuild: boolean;
  readonly buildStepOutcome: string;
  readonly deployStepOutcome?: string;
}

export interface CreateStorybookPrCommentMessageInput {
  readonly outcome: StorybookPrBuildOutcome;
  readonly reason: StorybookPrBuildReason;
  readonly changedFilesCount: number;
  readonly relevantFiles: readonly string[];
  readonly runUrl: string;
  readonly artifactName?: string;
  readonly artifactRetentionDays?: number;
  readonly deploymentUrl?: string;
}

function normalizePath(filePath: string): string {
  return filePath.trim().replaceAll('\\', '/');
}

export function isStorybookRelevantPath(filePath: string): boolean {
  const normalizedPath: string = normalizePath(filePath);

  if (STORYBOOK_RELEVANT_FILES.has(normalizedPath)) {
    return true;
  }

  return STORYBOOK_RELEVANT_PREFIXES.some((prefix: string): boolean => {
    return normalizedPath.startsWith(prefix);
  });
}

export function evaluateStorybookPrBuild({
  changedFiles,
  isDraft,
}: EvaluateStorybookPrBuildInput): StorybookPrBuildDecision {
  const relevantFiles: readonly string[] = changedFiles.filter(isStorybookRelevantPath);

  if (isDraft) {
    return {
      shouldBuild: false,
      reason: 'draft-pr',
      changedFilesCount: changedFiles.length,
      relevantFiles,
    };
  }

  if (relevantFiles.length === 0) {
    return {
      shouldBuild: false,
      reason: 'no-relevant-change',
      changedFilesCount: changedFiles.length,
      relevantFiles,
    };
  }

  return {
    shouldBuild: true,
    reason: 'relevant-change',
    changedFilesCount: changedFiles.length,
    relevantFiles,
  };
}

export function resolveStorybookPrBuildOutcome({
  shouldBuild,
  buildStepOutcome,
  deployStepOutcome,
}: ResolveStorybookPrBuildOutcomeInput): StorybookPrBuildOutcome {
  if (!shouldBuild) {
    return 'skipped';
  }

  if (buildStepOutcome !== 'success') {
    return 'failure';
  }

  if (deployStepOutcome !== undefined && deployStepOutcome !== 'success') {
    return 'failure';
  }

  return 'success';
}

function getReasonLabel(reason: StorybookPrBuildReason): string {
  if (reason === 'draft-pr') {
    return 'pull request is still in draft';
  }

  if (reason === 'no-relevant-change') {
    return 'no Storybook-related file changed';
  }

  return 'relevant files changed';
}

function renderRelevantFiles(relevantFiles: readonly string[]): string {
  if (relevantFiles.length === 0) {
    return '_none_';
  }

  const preview: readonly string[] = relevantFiles.slice(0, 5);
  const previewLines: string = preview.map((filePath: string) => `- \`${filePath}\``).join('\n');

  if (relevantFiles.length <= preview.length) {
    return previewLines;
  }

  return `${previewLines}\n- _...and ${relevantFiles.length - preview.length} more_`;
}

export function createStorybookPrCommentMessage({
  artifactName,
  artifactRetentionDays,
  changedFilesCount,
  deploymentUrl,
  outcome,
  reason,
  relevantFiles,
  runUrl,
}: CreateStorybookPrCommentMessageInput): string {
  const reasonLabel: string = getReasonLabel(reason);
  const relevantFilesMarkdown: string = renderRelevantFiles(relevantFiles);
  const deploymentLine: string =
    deploymentUrl === undefined || deploymentUrl === ''
      ? '- **Deployment**: not available'
      : `- **Deployment**: [Open Storybook](${deploymentUrl})`;
  const hasArtifact: boolean = artifactName !== undefined && artifactName.trim() !== '';
  const artifactLine: string = hasArtifact
    ? `- **Artifact**: \`${artifactName}\` (retention: ${artifactRetentionDays ?? 3} days)`
    : '- **Artifact**: not uploaded (deploy succeeded)';

  if (outcome === 'success') {
    return [
      STORYBOOK_PR_COMMENT_MARKER,
      '## ✅ Storybook build successful',
      '',
      `- **Decision**: ${reasonLabel}`,
      `- **Changed files inspected**: ${changedFilesCount}`,
      `- **Workflow run**: [View details](${runUrl})`,
      artifactLine,
      deploymentLine,
      '',
      '### Relevant files',
      relevantFilesMarkdown,
    ].join('\n');
  }

  if (outcome === 'failure') {
    return [
      STORYBOOK_PR_COMMENT_MARKER,
      '## ❌ Storybook build failed',
      '',
      `- **Decision**: ${reasonLabel}`,
      `- **Changed files inspected**: ${changedFilesCount}`,
      `- **Workflow run**: [View logs](${runUrl})`,
      '',
      'Please check the workflow logs and fix the build before merge.',
      '',
      '### Relevant files',
      relevantFilesMarkdown,
    ].join('\n');
  }

  return [
    STORYBOOK_PR_COMMENT_MARKER,
    '## ⏭️ Storybook build skipped',
    '',
    `- **Reason**: ${reasonLabel}`,
    `- **Changed files inspected**: ${changedFilesCount}`,
    `- **Workflow run**: [View details](${runUrl})`,
    '',
    'Storybook build was intentionally skipped for this PR event.',
    '',
    '### Relevant files',
    relevantFilesMarkdown,
  ].join('\n');
}
