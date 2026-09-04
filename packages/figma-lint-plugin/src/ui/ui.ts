import type { Finding } from '../core/model/finding.ts';
import type { LintSummary } from '../core/report/summarize.ts';

export type LintPanelState =
  | { readonly kind: 'idle' }
  | { readonly kind: 'setup-error'; readonly message: string }
  | { readonly kind: 'running'; readonly completed: number; readonly total: number }
  | {
      readonly kind: 'results';
      readonly summary: LintSummary;
      readonly inspectedCount: number;
      readonly cancelled: boolean;
      readonly feedback?: 'copied' | 'copy-failed';
      readonly refreshed?: boolean;
    }
  | { readonly kind: 'clean'; readonly inspectedCount: number; readonly refreshed?: boolean };

/**
 * Pure state → DOM renderer for the plugin panel. Event wiring lives in
 * `main.ts` via `data-action` / `data-finding-index` attributes. Finding rows
 * are indexed by their position in `[...errors, ...warnings]`.
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
      return buildIdle();
    case 'setup-error':
      return buildSetupError(state.message);
    case 'running':
      return buildRunning(state.completed, state.total);
    case 'results':
      return buildResults(state.summary, state.inspectedCount, state.cancelled, state.feedback);
    case 'clean':
      return buildClean(state.inspectedCount);
  }
}

function buildIdle(): HTMLElement {
  const panel: HTMLElement = element('div', 'panel');

  panel.append(buildHeader());
  panel.append(element('p', 'hint', 'Select at least one layer to lint.'));

  panel.append(buildActionButton('Run lint', 'run', 'primary'));

  return panel;
}

function buildSetupError(message: string): HTMLElement {
  const panel: HTMLElement = element('div', 'panel');

  panel.append(buildHeader());
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

function buildResults(
  summary: LintSummary,
  inspectedCount: number,
  cancelled: boolean,
  feedback?: 'copied' | 'copy-failed',
): HTMLElement {
  const panel: HTMLElement = element('div', 'panel');

  panel.append(buildHeader());
  panel.append(
    element(
      'p',
      'counts',
      `${summary.errorCount} errors · ${summary.warningCount} warnings — ${inspectedCount} layers inspected`,
    ),
  );

  if (cancelled) {
    panel.append(element('p', 'cancelled', 'Cancelled — partial results.'));
  }

  panel.append(buildFindingsList(summary.errors, summary.warnings));

  panel.append(
    buildActionsRow(
      buildActionButton('Run again', 'run'),
      buildActionButton(
        feedback === 'copied' ? 'Copied ✓' : 'Copy report',
        'copy-report',
        'primary',
      ),
    ),
  );

  if (feedback === 'copy-failed') {
    panel.append(element('p', 'error', 'Could not copy the report — try again.'));
  }

  return panel;
}

function buildClean(inspectedCount: number): HTMLElement {
  const panel: HTMLElement = element('div', 'panel');

  panel.append(buildHeader());
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

function buildFindingsList(errors: readonly Finding[], warnings: readonly Finding[]): HTMLElement {
  const list: HTMLElement = element('div', 'findings');

  const grouped: readonly (readonly [string, readonly Finding[]])[] = [
    ['error', errors],
    ['warning', warnings],
  ];

  let index: number = 0;

  for (const [severity, findings] of grouped) {
    for (const finding of findings) {
      const row: HTMLElement = element('button', `finding ${severity}`);
      row.setAttribute('data-finding-index', String(index));
      row.append(element('span', 'finding-rule', finding.ruleTitle));
      row.append(
        element(
          'span',
          'finding-detail',
          `${finding.nodeName} — ${finding.propertyLabel} — ${finding.valueLabel}`,
        ),
      );
      list.append(row);
      index += 1;
    }
  }

  return list;
}

function element(tag: string, className: string, text?: string): HTMLElement {
  const node: HTMLElement = document.createElement(tag);
  node.className = className;

  if (text !== undefined) {
    node.textContent = text;
  }

  return node;
}
