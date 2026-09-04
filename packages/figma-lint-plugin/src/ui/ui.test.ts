import { beforeEach, describe, expect, it } from 'vitest';
import type { Finding } from '../core/model/finding.ts';
import { renderPanel, type LintPanelState } from './ui.ts';

function findingFixture(severity: Finding['severity'], nodeName: string): Finding {
  return {
    ruleId: 'unbound-value',
    ruleTitle: 'Unbound value',
    severity,
    nodeId: `node:${nodeName}`,
    nodeName,
    propertyLabel: 'Fill',
    valueLabel: '#4A90D9',
    message: 'Raw color value with no design token bound.',
  };
}

function render(state: LintPanelState): HTMLElement {
  const root: HTMLElement = document.createElement('div');
  renderPanel(state, root);

  return root;
}

describe('renderPanel', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('renders the idle state with a run button and hint', () => {
    const root: HTMLElement = render({ kind: 'idle' });

    expect(root.querySelector('.title')!.textContent).toBe('Infomaniak Design Linter');
    expect(root.querySelector('.hint')!.textContent).toBe('Select at least one layer to lint.');

    const runButton: HTMLElement = root.querySelector('[data-action="run"]')!;
    expect(runButton.textContent).toBe('Run lint');
  });

  it('renders the setup error state with the blocking message', () => {
    const root: HTMLElement = render({
      kind: 'setup-error',
      message: 'No design tokens found in this file.',
    });

    expect(root.querySelector('.error')!.textContent).toBe('No design tokens found in this file.');
    expect(root.querySelector('[data-action="run"]')!.textContent).toBe('Retry');
  });

  it('renders the running state with progress text, bar and cancel', () => {
    const root: HTMLElement = render({ kind: 'running', completed: 340, total: 1200 });

    expect(root.querySelector('.progress-text')!.textContent).toBe('Checking 340/1200 layers…');

    const bar: HTMLElement = root.querySelector('.progress-bar')!;
    expect(bar.style.width).toBe('28%');
    expect(bar.classList.contains('indeterminate')).toBe(false);
    expect(root.querySelector('[data-action="cancel"]')!.textContent).toBe('Cancel');
  });

  it('shows an indeterminate bar before counts arrive', () => {
    const root: HTMLElement = render({ kind: 'running', completed: 0, total: 0 });

    expect(root.querySelector('.progress-text')!.textContent).toBe('Checking layers…');

    const bar: HTMLElement = root.querySelector('.progress-bar')!;
    expect(bar.classList.contains('indeterminate')).toBe(true);
    expect(bar.style.width).toBe('');
  });

  it('renders results with counts, grouped findings and a copy button', () => {
    const root: HTMLElement = render({
      kind: 'results',
      summary: {
        errors: [findingFixture('error', 'Card')],
        warnings: [findingFixture('warning', 'Icon/close')],
        errorCount: 1,
        warningCount: 1,
      },
      inspectedCount: 42,
      cancelled: false,
    });

    expect(root.querySelector('.counts')!.textContent).toBe(
      '1 errors · 1 warnings — 42 layers inspected',
    );

    const rows: NodeListOf<HTMLElement> = root.querySelectorAll('.finding');
    expect(rows).toHaveLength(2);
    expect(rows[0]!.className).toBe('finding error');
    expect(rows[0]!.getAttribute('data-finding-index')).toBe('0');
    expect(rows[0]!.querySelector('.finding-rule')!.textContent).toBe('Unbound value');
    expect(rows[0]!.querySelector('.finding-detail')!.textContent).toBe('Card — Fill — #4A90D9');
    expect(rows[1]!.className).toBe('finding warning');
    expect(rows[1]!.getAttribute('data-finding-index')).toBe('1');

    const runAgain: HTMLElement = root.querySelector('[data-action="run"]')!;
    expect(runAgain.textContent).toBe('Run again');

    expect(root.querySelector('[data-action="copy-report"]')!.textContent).toBe('Copy report');
  });

  it('marks cancelled runs with a partial-results note', () => {
    const root: HTMLElement = render({
      kind: 'results',
      summary: { errors: [], warnings: [], errorCount: 0, warningCount: 1 },
      inspectedCount: 7,
      cancelled: true,
    });

    expect(root.querySelector('.cancelled')!.textContent).toBe('Cancelled — partial results.');
    expect(root.querySelector('.panel')!.classList.contains('refreshed')).toBe(false);
  });

  it('pulses refreshed result panels', () => {
    const root: HTMLElement = render({
      kind: 'results',
      summary: { errors: [], warnings: [], errorCount: 0, warningCount: 0 },
      inspectedCount: 3,
      cancelled: false,
      refreshed: true,
    });

    expect(root.querySelector('.panel')!.classList.contains('refreshed')).toBe(true);
  });

  it('renders copied feedback on the copy button', () => {
    const root: HTMLElement = render({
      kind: 'results',
      summary: { errors: [], warnings: [], errorCount: 0, warningCount: 0 },
      inspectedCount: 3,
      cancelled: false,
      feedback: 'copied',
    });

    expect(root.querySelector('[data-action="copy-report"]')!.textContent).toBe('Copied ✓');
    expect(root.querySelector('.error')).toBeNull();
  });

  it('renders a copy failure error while keeping the copy button', () => {
    const root: HTMLElement = render({
      kind: 'results',
      summary: { errors: [], warnings: [], errorCount: 0, warningCount: 0 },
      inspectedCount: 3,
      cancelled: false,
      feedback: 'copy-failed',
    });

    expect(root.querySelector('.error')!.textContent).toBe(
      'Could not copy the report — try again.',
    );
    expect(root.querySelector('[data-action="copy-report"]')!.textContent).toBe('Copy report');
  });

  it('renders the clean pass state', () => {
    const root: HTMLElement = render({ kind: 'clean', inspectedCount: 340 });

    expect(root.querySelector('.success')!.textContent).toBe(
      '0 errors, 0 warnings — all checked properties are token-bound.',
    );
    expect(root.querySelector('.hint')!.textContent).toBe('340 layers inspected.');
    expect(root.querySelector('[data-action="run"]')!.textContent).toBe('Run again');
    expect(root.querySelector('.panel')!.classList.contains('refreshed')).toBe(false);
  });

  it('pulses refreshed clean panels', () => {
    const root: HTMLElement = render({ kind: 'clean', inspectedCount: 1, refreshed: true });

    expect(root.querySelector('.panel')!.classList.contains('refreshed')).toBe(true);
  });

  it('replaces previous content on re-render', () => {
    const root: HTMLElement = render({ kind: 'idle' });
    renderPanel({ kind: 'clean', inspectedCount: 1 }, root);

    expect(root.querySelectorAll('.panel')).toHaveLength(1);
    expect(root.querySelector('.success')).not.toBeNull();
  });
});
