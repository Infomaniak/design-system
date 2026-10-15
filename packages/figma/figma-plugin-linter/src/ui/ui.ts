import type { Finding } from '../core/model/finding.ts';
import type { LintSummary } from '../core/report/summarize.ts';
import { DEFAULT_SCAN_SCOPE, type ScanScope } from '../core/scan-scope.ts';

const SCAN_SCOPE_OPTIONS: readonly (readonly [ScanScope, string])[] = [
  ['selection', 'Selection'],
  ['page', 'Page'],
  ['file', 'File'],
];

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
    }
  | {
      readonly kind: 'clean';
      readonly inspectedCount: number;
      readonly refreshed?: boolean;
      readonly scope?: ScanScope;
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
      return buildClean(state.inspectedCount, state.scope);
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

  if (state.cancelled) {
    panel.append(element('p', 'cancelled', 'Cancelled — partial results.'));
  }

  panel.append(buildFindingsList(state.summary, state.expandedRuleIds ?? []));

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

function buildClean(inspectedCount: number, scope?: ScanScope): HTMLElement {
  const panel: HTMLElement = element('div', 'panel');

  panel.append(buildHeader());
  panel.append(buildScopePicker(scope));

  panel.append(
    element('p', 'success', '0 errors, 0 warnings — all checked properties are token-bound.'),
  );
  panel.append(element('p', 'hint', `${inspectedCount} layers inspected.`));

  panel.append(buildActionsRow(buildActionButton('Run again', 'run')));

  return panel;
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

function buildFindingsList(summary: LintSummary, expandedRuleIds: readonly string[]): HTMLElement {
  const list: HTMLElement = element('div', 'findings');

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

      for (const finding of section.findings) {
        body.append(buildFindingRow(finding, index, section.severity));
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
 * Finding rows render as simple buttons: click selects the offending layer on
 * canvas (wiring in `main.ts`).
 */
function buildFindingRow(finding: Finding, index: number, severity: string): HTMLElement {
  const detail: string = `${finding.nodeName} — ${finding.propertyLabel} — ${finding.valueLabel}`;

  const row: HTMLElement = element('button', `finding ${severity}`);
  row.setAttribute('data-finding-index', String(index));
  row.append(element('span', 'finding-detail', detail));
  row.append(element('span', 'finding-message', finding.message));

  return row;
}

function element(tag: string, className: string, text?: string): HTMLElement {
  const node: HTMLElement = document.createElement(tag);
  node.className = className;

  if (text !== undefined) {
    node.textContent = text;
  }

  return node;
}
