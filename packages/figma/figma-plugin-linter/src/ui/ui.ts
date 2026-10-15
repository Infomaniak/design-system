import type { Finding, FixSuggestion } from '../core/model/finding.ts';
import type { LintSummary } from '../core/report/summarize.ts';
import { DEFAULT_SCAN_SCOPE, type ScanScope } from '../core/scan-scope.ts';

const SCAN_SCOPE_OPTIONS: readonly (readonly [ScanScope, string])[] = [
  ['selection', 'Selection'],
  ['page', 'Page'],
  ['file', 'File'],
];

/** Post-apply feedback carried on the refreshed results, until the next run. */
export interface FixFeedback {
  readonly appliedCount: number;
  readonly failedCount: number;
  readonly failedNodeIds: readonly string[];
}

export type LintPanelState =
  | { readonly kind: 'idle'; readonly scope?: ScanScope }
  | { readonly kind: 'setup-error'; readonly message: string; readonly scope?: ScanScope }
  | { readonly kind: 'running'; readonly completed: number; readonly total: number }
  | {
      readonly kind: 'results';
      readonly summary: LintSummary;
      readonly inspectedCount: number;
      readonly cancelled: boolean;
      readonly expandedRuleIds?: readonly string[];
      readonly feedback?: 'copied' | 'copy-failed';
      readonly refreshed?: boolean;
      readonly scope?: ScanScope;
      /** Rule awaiting batch-fix confirmation. */
      readonly confirmRuleId?: string;
      /** Finding row whose fix-choice picker is open. */
      readonly openFixRow?: number;
      /** Feedback from the last applied batch, until the next lint run. */
      readonly fixFeedback?: FixFeedback;
    }
  | {
      readonly kind: 'clean';
      readonly inspectedCount: number;
      readonly refreshed?: boolean;
      readonly scope?: ScanScope;
      readonly fixFeedback?: FixFeedback;
    };

/**
 * Pure state → DOM renderer for the plugin panel. Event wiring lives in
 * `main.ts` via `data-action` / `data-finding-index` attributes. Finding rows
 * are indexed by their position in the sections' flattened findings; rule
 * sections render collapsed unless their rule id is in `expandedRuleIds`.
 */
export function renderPanel(state: LintPanelState, root: HTMLElement): void {
  root.replaceChildren(buildPanel(state));
}

function buildPanel(state: LintPanelState): HTMLElement {
  const panel: HTMLElement = buildPanelContent(state);

  if ('refreshed' in state && state.refreshed === true) {
    panel.classList.add('refreshed');
  }

  return panel;
}

function buildPanelContent(state: LintPanelState): HTMLElement {
  switch (state.kind) {
    case 'idle':
      return buildIdle(state.scope);
    case 'setup-error':
      return buildSetupError(state.message, state.scope);
    case 'running':
      return buildRunning(state.completed, state.total);
    case 'results':
      return buildResults(state);
    case 'clean':
      return buildClean(state.inspectedCount, state.scope, state.fixFeedback);
  }
}

function buildScopePicker(scope: ScanScope | undefined): HTMLElement {
  const picker: HTMLElement = element('div', 'scope-row');
  const label: HTMLElement = element('label', 'scope-label', 'Scope');
  label.setAttribute('for', 'scope-picker');

  const select: HTMLSelectElement = document.createElement('select');
  select.className = 'scope-picker';
  select.id = 'scope-picker';
  select.setAttribute('data-action', 'set-scope');

  const selected: ScanScope = scope ?? DEFAULT_SCAN_SCOPE;

  for (const [value, text] of SCAN_SCOPE_OPTIONS) {
    const option: HTMLOptionElement = document.createElement('option');
    option.value = value;
    option.textContent = text;
    select.append(option);
  }

  select.value = selected;

  picker.append(label, select);

  return picker;
}

function buildIdle(scope?: ScanScope): HTMLElement {
  const panel: HTMLElement = element('div', 'panel');

  panel.append(buildHeader());
  panel.append(buildScopePicker(scope));
  panel.append(element('p', 'hint', 'Select at least one layer to lint.'));

  panel.append(buildActionButton('Run lint', 'run', 'primary'));

  return panel;
}

function buildSetupError(message: string, scope?: ScanScope): HTMLElement {
  const panel: HTMLElement = element('div', 'panel');

  panel.append(buildHeader());
  panel.append(buildScopePicker(scope));
  panel.append(element('p', 'error', message));

  panel.append(buildActionButton('Retry', 'run', 'primary'));

  return panel;
}

function buildRunning(completed: number, total: number): HTMLElement {
  const panel: HTMLElement = element('div', 'panel');

  panel.append(buildHeader());

  if (total === 0) {
    panel.append(element('p', 'progress-text', 'Checking layers…'));
  } else {
    panel.append(element('p', 'progress-text', `Checking ${completed}/${total} layers…`));
  }

  const progressTrack: HTMLElement = element('div', 'progress-track');
  const progressBar: HTMLElement = element('div', 'progress-bar');

  if (total === 0) {
    progressBar.classList.add('indeterminate');
  } else {
    progressBar.style.width = `${Math.round((completed / total) * 100)}%`;
  }

  progressTrack.append(progressBar);
  panel.append(progressTrack);

  panel.append(buildActionButton('Cancel', 'cancel'));

  return panel;
}

function buildResults(state: Extract<LintPanelState, { readonly kind: 'results' }>): HTMLElement {
  const panel: HTMLElement = element('div', 'panel');

  panel.append(buildHeader());
  panel.append(buildScopePicker(state.scope));
  panel.append(
    element(
      'p',
      'counts',
      `${state.summary.errorCount} errors · ${state.summary.warningCount} warnings — ${state.inspectedCount} layers inspected`,
    ),
  );

  if (state.fixFeedback !== undefined) {
    panel.append(buildFixFeedback(state.fixFeedback));
  }

  if (state.cancelled) {
    panel.append(element('p', 'cancelled', 'Cancelled — partial results.'));
  }

  panel.append(
    buildFindingsList(
      state.summary,
      state.expandedRuleIds ?? [],
      state.confirmRuleId,
      state.fixFeedback,
      state.openFixRow,
    ),
  );

  panel.append(
    buildActionsRow(
      buildActionButton('Run again', 'run'),
      buildActionButton(
        state.feedback === 'copied' ? 'Copied ✓' : 'Copy report',
        'copy-report',
        'primary',
      ),
    ),
  );

  if (state.feedback === 'copy-failed') {
    panel.append(element('p', 'error', 'Could not copy the report — try again.'));
  }

  return panel;
}

function buildClean(
  inspectedCount: number,
  scope?: ScanScope,
  fixFeedback?: FixFeedback,
): HTMLElement {
  const panel: HTMLElement = element('div', 'panel');

  panel.append(buildHeader());
  panel.append(buildScopePicker(scope));

  if (fixFeedback !== undefined) {
    panel.append(buildFixFeedback(fixFeedback));
  }

  panel.append(
    element('p', 'success', '0 errors, 0 warnings — all checked properties are token-bound.'),
  );
  panel.append(element('p', 'hint', `${inspectedCount} layers inspected.`));

  panel.append(buildActionsRow(buildActionButton('Run again', 'run')));

  return panel;
}

function buildFixFeedback(feedback: FixFeedback): HTMLElement {
  const text: string =
    feedback.failedCount === 0
      ? `✓ ${feedback.appliedCount} fix${feedback.appliedCount === 1 ? '' : 'es'} applied`
      : `${feedback.appliedCount} applied · ${feedback.failedCount} failed`;

  return element('p', feedback.failedCount === 0 ? 'fix-feedback' : 'fix-feedback failed', text);
}

function buildActionsRow(...buttons: readonly HTMLElement[]): HTMLElement {
  const row: HTMLElement = element('div', 'actions');
  row.append(...buttons);

  return row;
}

function buildHeader(): HTMLElement {
  return element('h1', 'title', 'Infomaniak Design Linter');
}

function buildActionButton(label: string, action: string, modifier?: string): HTMLElement {
  const button: HTMLElement = element(
    'button',
    modifier === undefined ? 'button' : `button ${modifier}`,
    label,
  );
  button.setAttribute('data-action', action);

  return button;
}

function buildFindingsList(
  summary: LintSummary,
  expandedRuleIds: readonly string[],
  confirmRuleId?: string,
  fixFeedback?: FixFeedback,
  openFixRow?: number,
): HTMLElement {
  const list: HTMLElement = element('div', 'findings');
  const failedNodeIds: ReadonlySet<string> = new Set(fixFeedback?.failedNodeIds ?? []);

  let index: number = 0;

  for (const section of summary.sections) {
    const expanded: boolean = expandedRuleIds.includes(section.ruleId);

    const header: HTMLElement = element('button', `section-header ${section.severity}`);
    header.setAttribute('data-action', 'toggle-section');
    header.setAttribute('data-rule-id', section.ruleId);
    header.append(element('span', 'section-chevron', expanded ? '▾' : '▸'));
    header.append(element('span', 'section-title', section.title));
    header.append(element('span', 'section-count', String(section.findings.length)));
    list.append(header);

    if (expanded) {
      const body: HTMLElement = element('div', 'section-body');
      const fixable: readonly Finding[] = section.findings.filter(
        (finding: Finding): boolean => (finding.suggestedFixes?.length ?? 0) > 0,
      );

      if (fixable.length > 0) {
        body.append(buildBatchFixRow(section.ruleId, fixable, fixable.length, confirmRuleId));
      }

      for (const finding of section.findings) {
        body.append(buildFindingRow(finding, index, section.severity, failedNodeIds, openFixRow));
        index += 1;
      }

      list.append(body);
    } else {
      index += section.findings.length;
    }
  }

  return list;
}

/**
 * Per-rule batch fix row: «Apply <token> to N» — or, while confirming, an
 * Apply/Cancel pair. Only rendered when the section has fixable findings.
 * Batching always applies each finding's recommended (first) suggestion.
 */
function buildBatchFixRow(
  ruleId: string,
  fixable: readonly Finding[],
  fixableCount: number,
  confirmRuleId: string | undefined,
): HTMLElement {
  const row: HTMLElement = element('div', 'batch-row');

  if (confirmRuleId === ruleId) {
    const confirm: HTMLElement = buildActionButton(
      buildBatchLabel(fixable, fixableCount),
      'fix-rule-confirm',
      'primary',
    );
    confirm.setAttribute('data-rule-id', ruleId);

    row.append(confirm, buildActionButton('Cancel', 'fix-rule-cancel'));
    return row;
  }

  const batch: HTMLElement = buildActionButton(buildBatchLabel(fixable, fixableCount), 'fix-rule');
  batch.setAttribute('data-rule-id', ruleId);

  row.append(batch);

  return row;
}

function buildBatchLabel(fixable: readonly Finding[], fixableCount: number): string {
  const labels: ReadonlySet<string> = new Set(
    fixable.map((finding: Finding): string => finding.suggestedFixes?.[0]?.label ?? ''),
  );

  return labels.size === 1
    ? `Apply ${[...labels][0]} to ${fixableCount}`
    : `Apply ${fixableCount} fixes`;
}

/**
 * Finding rows with suggestions render as a row div holding the select button
 * plus a Fix control: one candidate → a one-click `Fix: <token>` button;
 * several → a toggle that opens an inline picker (recommended first).
 * Plain rows stay simple buttons (no nesting).
 */
function buildFindingRow(
  finding: Finding,
  index: number,
  severity: string,
  failedNodeIds: ReadonlySet<string>,
  openFixRow?: number,
): HTMLElement {
  const detail: string = `${finding.nodeName} — ${finding.propertyLabel} — ${finding.valueLabel}`;
  const suggestions: readonly FixSuggestion[] = finding.suggestedFixes ?? [];

  if (suggestions.length === 0) {
    const row: HTMLElement = element('button', `finding ${severity}`);
    row.setAttribute('data-finding-index', String(index));
    row.append(element('span', 'finding-detail', detail));
    row.append(element('span', 'finding-message', finding.message));

    if (failedNodeIds.has(finding.nodeId)) {
      row.append(element('span', 'fix-failed', 'fix failed'));
    }

    return row;
  }

  const row: HTMLElement = element('div', `finding ${severity} fixable`);
  const inner: HTMLElement = element('div', 'finding-row');

  const main: HTMLElement = element('button', 'finding-main');
  main.setAttribute('data-finding-index', String(index));
  main.append(element('span', 'finding-detail', detail));
  main.append(element('span', 'finding-message', finding.message));

  if (failedNodeIds.has(finding.nodeId)) {
    main.append(element('span', 'fix-failed', 'fix failed'));
  }

  inner.append(main);

  if (openFixRow === index) {
    const close: HTMLElement = buildActionButton('Close', 'fix-toggle-picker');
    close.setAttribute('data-finding-index', String(index));

    inner.append(close);

    const picker: HTMLElement = element('div', 'fix-picker');

    for (const [suggestionIndex, suggestion] of suggestions.entries()) {
      const option: HTMLElement = buildActionButton(
        suggestionIndex === 0 ? `Apply ${suggestion.label} ✓` : `Apply ${suggestion.label}`,
        'fix-finding',
      );
      option.setAttribute('data-finding-index', String(index));
      option.setAttribute('data-fix-index', String(suggestionIndex));

      picker.append(option);
    }

    row.append(inner, picker);
  } else if (suggestions.length === 1) {
    inner.append(buildFixButton(`Fix: ${suggestions[0]!.label}`, index));
    row.append(inner);
  } else {
    const toggle: HTMLElement = buildActionButton(
      `Fix: ${suggestions[0]!.label} ▸`,
      'fix-toggle-picker',
    );
    toggle.setAttribute('data-finding-index', String(index));

    inner.append(toggle);
    row.append(inner);
  }

  return row;
}

function buildFixButton(label: string, index: number): HTMLElement {
  const button: HTMLElement = buildActionButton(label, 'fix-finding');
  button.setAttribute('data-finding-index', String(index));

  return button;
}

function element(tag: string, className: string, text?: string): HTMLElement {
  const node: HTMLElement = document.createElement(tag);
  node.className = className;

  if (text !== undefined) {
    node.textContent = text;
  }

  return node;
}
