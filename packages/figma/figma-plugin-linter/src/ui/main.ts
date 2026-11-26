import type { FixRequestItem } from '../core/fix-request.ts';
import type { Finding, FixSuggestion } from '../core/model/finding.ts';
import { findingsToMarkdown } from '../core/report/markdown.ts';
import { summarizeFindings } from '../core/report/summarize.ts';
import { DEFAULT_RULE_SELECTION } from '../core/rules/selection.ts';
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
/** Enabled rule ids; hydrated from the sandbox (clientStorage) on load. */
let selectedRuleIds: ReadonlySet<string> = new Set(DEFAULT_RULE_SELECTION);
/** State the settings view returns to — captured when the settings open. */
let stateBeforeSettings: LintPanelState | undefined;
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
    case 'run': {
      if (selectedRuleIds.size === 0) {
        return;
      }

      update({ kind: 'running', completed: 0, total: 0 });
      runStartedAt = Date.now();
      post({ type: 'lint-request', scope: selectedScope, enabledRuleIds: [...selectedRuleIds] });
      return;
    }
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
    case 'open-settings': {
      if (latestState.kind === 'running') {
        return;
      }

      stateBeforeSettings = latestState;
      update({ kind: 'settings', scope: selectedScope, enabledRuleIds: [...selectedRuleIds] });
      return;
    }
    case 'close-settings':
      returnFromSettings();
      return;
    case 'reset-rules':
      void resetRules();
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
    (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-action]') ?? null;

  if (target === null) {
    return;
  }

  switch (target.dataset['action']) {
    case 'set-scope': {
      if (!(target instanceof HTMLSelectElement)) {
        return;
      }

      selectedScope = parseScanScope(target.value);
      rerenderWithSelectedScope();
      return;
    }
    case 'toggle-rule': {
      if (!(target instanceof HTMLInputElement)) {
        return;
      }

      toggleRule(target.dataset['ruleId'], target.checked);
      return;
    }
  }
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
      update(withRuleSelection({ kind: 'idle', scope: selectedScope }));
      break;
    case 'setup-error':
      update(
        withRuleSelection({
          kind: 'setup-error',
          message: latestState.message,
          scope: selectedScope,
        }),
      );
      break;
    case 'running':
      break;
    case 'settings':
      break;
  }
}

/** Applies the selection to any non-running state so counts stay current. */
function withRuleSelection(state: LintPanelState): LintPanelState {
  return state.kind === 'running' ? state : { ...state, enabledRuleIds: [...selectedRuleIds] };
}

function toggleRule(ruleId: string | undefined, checked: boolean): void {
  if (ruleId === undefined) {
    return;
  }

  const next: Set<string> = new Set(selectedRuleIds);

  if (checked) {
    next.add(ruleId);
  } else {
    next.delete(ruleId);
  }

  selectedRuleIds = next;
  post({ type: 'save-rule-selection', enabledRuleIds: [...next] });

  if (latestState.kind === 'settings') {
    update({ ...latestState, enabledRuleIds: [...next] });
  }
}

/** Closes the settings view, refreshing the underlying state's rule count. */
function returnFromSettings(): void {
  const base: LintPanelState = stateBeforeSettings ?? { kind: 'idle', scope: selectedScope };
  stateBeforeSettings = undefined;

  update(withRuleSelection(base));
}

/** Restores every rule enabled, persists it and re-renders the settings view. */
async function resetRules(): Promise<void> {
  selectedRuleIds = new Set(DEFAULT_RULE_SELECTION);

  if (latestState.kind === 'settings') {
    update({ ...latestState, enabledRuleIds: [...selectedRuleIds] });
  }

  post({ type: 'reset-rule-selection' });
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
          update(
            withRuleSelection({
              kind: 'clean',
              inspectedCount: message.inspectedCount,
              refreshed: true,
              scope: selectedScope,
              ...(fixFeedback === undefined ? {} : { fixFeedback }),
            }),
          );
        } else {
          update(
            withRuleSelection({
              kind: 'results',
              summary,
              inspectedCount: message.inspectedCount,
              cancelled: message.cancelled,
              expandedRuleIds,
              refreshed: true,
              scope: selectedScope,
              ...(fixFeedback === undefined ? {} : { fixFeedback }),
            }),
          );
        }
      });
      break;
    case 'lint-setup-error':
      applyRunResult((): void => {
        pendingFixFeedback = undefined;
        update({
          kind: 'setup-error',
          message: message.message,
          scope: selectedScope,
          enabledRuleIds: [...selectedRuleIds],
        });
      });
      break;
    case 'fix-result':
      applyFixResult(message.applied, message.failed);
      break;
    case 'rule-selection':
      selectedRuleIds = new Set(message.enabledRuleIds);

      if (latestState.kind !== 'running') {
        update(withRuleSelection(latestState));
      }
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
  post({ type: 'lint-request', scope: selectedScope, enabledRuleIds: [...selectedRuleIds] });
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

update(withRuleSelection({ kind: 'idle', scope: selectedScope }));
post({ type: 'get-rule-selection' });
