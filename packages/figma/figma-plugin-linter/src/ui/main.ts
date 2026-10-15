import type { FixRequestItem } from '../core/fix-request.ts';
import type { Finding, FixSuggestion } from '../core/model/finding.ts';
import { findingsToMarkdown } from '../core/report/markdown.ts';
import { summarizeFindings } from '../core/report/summarize.ts';
import { parseScanScope, type ScanScope } from '../core/scan-scope.ts';
import type { SandboxToUiMessage, UiToSandboxMessage } from '../messages.ts';
import { copyTextToClipboard } from './clipboard.ts';
import type { FixFeedback } from './ui.ts';
import { renderPanel, type LintPanelState } from './ui.ts';

/**
 * Iframe entry point (glue — not unit tested). Wires DOM events and sandbox
 * messages to the pure panel renderer.
 */
const rootElement: HTMLElement | null = document.querySelector<HTMLElement>('#app');

if (rootElement === null) {
  throw new Error('Missing #app root element.');
}

const root: HTMLElement = rootElement;

const MIN_RUNNING_MS: number = 350;

let latestFindings: readonly Finding[] = [];
let latestState: LintPanelState = { kind: 'idle' };
let expandedRuleIds: readonly string[] = [];
let selectedScope: ScanScope = 'selection';
let runStartedAt: number = 0;
/** Fix feedback waiting to ride on the next lint-result (auto re-lint). */
let pendingFixFeedback: FixFeedback | undefined;

function update(state: LintPanelState): void {
  latestState = state;
  renderPanel(state, root);
}

function post(message: UiToSandboxMessage): void {
  window.parent.postMessage({ pluginMessage: message }, '*');
}

root.addEventListener('click', (event: MouseEvent): void => {
  const target: HTMLElement | null =
    (event.target as HTMLElement | null)?.closest<HTMLElement>(
      '[data-action], [data-finding-index]',
    ) ?? null;

  if (target === null) {
    return;
  }

  switch (target.dataset['action']) {
    case 'run':
      update({ kind: 'running', completed: 0, total: 0 });
      runStartedAt = Date.now();
      post({ type: 'lint-request', scope: selectedScope });
      return;
    case 'cancel':
      post({ type: 'lint-cancel' });
      return;
    case 'toggle-section':
      toggleSection(target.dataset['ruleId']);
      return;
    case 'copy-report':
      void copyReport();
      return;
    case 'fix-finding':
      requestSingleFix(target);
      return;
    case 'fix-toggle-picker':
      toggleFixPicker(target);
      return;
    case 'fix-rule':
      setConfirmRule(target.dataset['ruleId']);
      return;
    case 'fix-rule-confirm':
      requestBatchFix(target.dataset['ruleId']);
      return;
    case 'fix-rule-cancel':
      setConfirmRule(undefined);
      return;
  }

  const findingIndex: string | undefined = target.dataset['findingIndex'];

  if (findingIndex !== undefined) {
    const finding: Finding | undefined = latestFindings[Number(findingIndex)];

    if (finding !== undefined) {
      post({ type: 'select-finding', nodeId: finding.nodeId });
    }
  }
});

root.addEventListener('change', (event: Event): void => {
  const target: HTMLElement | null =
    (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-action="set-scope"]') ?? null;

  if (target === null || !(target instanceof HTMLSelectElement)) {
    return;
  }

  selectedScope = parseScanScope(target.value);
  rerenderWithSelectedScope();
});

/** Re-renders the current non-running state so the picker reflects `selectedScope`. */
function rerenderWithSelectedScope(): void {
  switch (latestState.kind) {
    case 'results':
      update({ ...latestState, scope: selectedScope, refreshed: false });
      break;
    case 'clean':
      update({ ...latestState, scope: selectedScope, refreshed: false });
      break;
    case 'idle':
      update({ kind: 'idle', scope: selectedScope });
      break;
    case 'setup-error':
      update({ kind: 'setup-error', message: latestState.message, scope: selectedScope });
      break;
    case 'running':
      break;
  }
}

function toggleSection(ruleId: string | undefined): void {
  if (ruleId === undefined || latestState.kind !== 'results') {
    return;
  }

  expandedRuleIds = expandedRuleIds.includes(ruleId)
    ? expandedRuleIds.filter((id: string): boolean => id !== ruleId)
    : [...expandedRuleIds, ruleId];

  update({ ...latestState, expandedRuleIds, refreshed: false });
}

function setConfirmRule(ruleId: string | undefined): void {
  if (latestState.kind !== 'results') {
    return;
  }

  update({ ...latestState, confirmRuleId: ruleId, refreshed: false });
}

function requestSingleFix(target: HTMLElement): void {
  const index: string | undefined = target.dataset['findingIndex'];
  const finding: Finding | undefined =
    index === undefined ? undefined : latestFindings[Number(index)];

  if (finding === undefined || (finding.suggestedFixes?.length ?? 0) === 0) {
    return;
  }

  const fix: FixSuggestion | undefined =
    finding.suggestedFixes![Number(target.dataset['fixIndex'] ?? '0')] ??
    finding.suggestedFixes![0]!;

  post({ type: 'fix-request', items: [{ nodeId: finding.nodeId, fix }] });
}

/** Opens or closes the fix-choice picker of one finding row. */
function toggleFixPicker(target: HTMLElement): void {
  if (latestState.kind !== 'results') {
    return;
  }

  const index: number = Number(target.dataset['findingIndex'] ?? '-1');

  if (index < 0) {
    return;
  }

  update({
    ...latestState,
    openFixRow: latestState.openFixRow === index ? undefined : index,
    refreshed: false,
  });
}

function requestBatchFix(ruleId: string | undefined): void {
  if (ruleId === undefined || latestState.kind !== 'results') {
    return;
  }

  const items: readonly FixRequestItem[] = latestFindings.flatMap(
    (finding: Finding): FixRequestItem[] =>
      finding.ruleId === ruleId && (finding.suggestedFixes?.length ?? 0) > 0
        ? [{ nodeId: finding.nodeId, fix: finding.suggestedFixes![0]! }]
        : [],
  );

  if (items.length === 0) {
    return;
  }

  setConfirmRule(undefined);
  post({ type: 'fix-request', items });
}

async function copyReport(): Promise<void> {
  const state: LintPanelState = latestState;

  if (state.kind !== 'results') {
    return;
  }

  try {
    await copyTextToClipboard(
      findingsToMarkdown(latestFindings, {
        inspectedCount: state.inspectedCount,
        cancelled: state.cancelled,
      }),
    );
    update({ ...state, feedback: 'copied', refreshed: false });
  } catch {
    update({ ...state, feedback: 'copy-failed', refreshed: false });
  }
}

window.onmessage = (event: MessageEvent): void => {
  const message: SandboxToUiMessage | undefined = (
    event.data as { pluginMessage?: SandboxToUiMessage } | undefined
  )?.pluginMessage;

  if (message === undefined) {
    return;
  }

  switch (message.type) {
    case 'lint-progress':
      update({ kind: 'running', completed: message.completed, total: message.total });
      break;
    case 'lint-result':
      applyRunResult((): void => {
        const summary = summarizeFindings(message.findings);
        latestFindings = summary.sections.flatMap(
          (section): readonly Finding[] => section.findings,
        );
        expandedRuleIds = [];
        const fixFeedback: FixFeedback | undefined = pendingFixFeedback;

        pendingFixFeedback = undefined;

        if (summary.errorCount === 0 && summary.warningCount === 0 && !message.cancelled) {
          update({
            kind: 'clean',
            inspectedCount: message.inspectedCount,
            refreshed: true,
            scope: selectedScope,
            ...(fixFeedback === undefined ? {} : { fixFeedback }),
          });
        } else {
          update({
            kind: 'results',
            summary,
            inspectedCount: message.inspectedCount,
            cancelled: message.cancelled,
            expandedRuleIds,
            refreshed: true,
            scope: selectedScope,
            ...(fixFeedback === undefined ? {} : { fixFeedback }),
          });
        }
      });
      break;
    case 'lint-setup-error':
      applyRunResult((): void => {
        pendingFixFeedback = undefined;
        update({ kind: 'setup-error', message: message.message, scope: selectedScope });
      });
      break;
    case 'fix-result':
      applyFixResult(message.applied, message.failed);
      break;
  }
};

/**
 * Fix feedback + auto re-lint: the panel switches to a running state and the
 * same scope is re-linted; the feedback rides on the refreshed results so the
 * user sees «N applied · M failed» next to the updated findings.
 */
function applyFixResult(
  applied: readonly string[],
  failed: readonly { readonly nodeId: string; readonly reason: string }[],
): void {
  pendingFixFeedback = {
    appliedCount: applied.length,
    failedCount: failed.length,
    failedNodeIds: failed.map((failure: { readonly nodeId: string }): string => failure.nodeId),
  };

  update({ kind: 'running', completed: 0, total: 0 });
  runStartedAt = Date.now();
  post({ type: 'lint-request', scope: selectedScope });
}

function applyRunResult(apply: () => void): void {
  const remainingMs: number = MIN_RUNNING_MS - (Date.now() - runStartedAt);

  if (remainingMs <= 0 || latestState.kind !== 'running') {
    apply();
    return;
  }

  setTimeout((): void => {
    if (latestState.kind === 'running') {
      apply();
    }
  }, remainingMs);
}

update({ kind: 'idle', scope: selectedScope });
