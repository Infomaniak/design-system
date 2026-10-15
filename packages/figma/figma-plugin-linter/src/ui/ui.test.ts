import { beforeEach, describe, expect, it } from 'vitest';
import type { Finding, FixSuggestion } from '../core/model/finding.ts';
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

    expect(root.querySelector('.title')!.textContent).toBe('ESDS Linter');
    expect(root.querySelector('.hint')!.textContent).toBe('Select at least one layer to lint.');

    const runButton: HTMLElement = root.querySelector('[data-action="run"]')!;
    expect(runButton.textContent).toBe('Run lint');
  });

  it('renders the scope picker with selection as the default scope', () => {
    const root: HTMLElement = render({ kind: 'idle' });

    const picker: HTMLSelectElement = root.querySelector('#scope-picker')!;
    expect(picker.getAttribute('data-action')).toBe('set-scope');
    expect(picker.options).toHaveLength(3);
    expect(picker.value).toBe('selection');
    expect(root.querySelector('.scope-label')!.textContent).toBe('Scope');
  });

  it('renders the picker with the requested scope selected', () => {
    const root: HTMLElement = render({ kind: 'idle', scope: 'file' });

    const picker: HTMLSelectElement = root.querySelector('#scope-picker')!;
    expect(picker.value).toBe('file');
  });

  it('hides the scope picker while running', () => {
    const root: HTMLElement = render({ kind: 'running', completed: 340, total: 1200 });

    expect(root.querySelector('#scope-picker')).toBeNull();
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

  it('renders results with counts, rule sections and a copy button', () => {
    const root: HTMLElement = render({
      kind: 'results',
      summary: {
        sections: [
          {
            ruleId: 'unbound-value',
            title: 'Unbound value',
            severity: 'error',
            findings: [findingFixture('error', 'Card')],
          },
          {
            ruleId: 'primitive-misuse',
            title: 'Primitive misuse',
            severity: 'warning',
            findings: [findingFixture('warning', 'Icon/close')],
          },
        ],
        errorCount: 1,
        warningCount: 1,
      },
      inspectedCount: 42,
      cancelled: false,
    });

    expect(root.querySelector('.counts')!.textContent).toBe(
      '1 errors · 1 warnings — 42 layers inspected',
    );

    const headers: NodeListOf<HTMLElement> = root.querySelectorAll('.section-header');
    expect(headers).toHaveLength(2);
    expect(headers[0]!.getAttribute('data-action')).toBe('toggle-section');
    expect(headers[0]!.getAttribute('data-rule-id')).toBe('unbound-value');
    expect(headers[0]!.querySelector('.section-title')!.textContent).toBe('Unbound value');
    expect(headers[0]!.querySelector('.section-count')!.textContent).toBe('1');
    expect(headers[0]!.querySelector('.section-chevron')!.textContent).toBe('▸');
    expect(headers[1]!.getAttribute('data-rule-id')).toBe('primitive-misuse');

    expect(root.querySelectorAll('.finding')).toHaveLength(0);

    const runAgain: HTMLElement = root.querySelector('[data-action="run"]')!;
    expect(runAgain.textContent).toBe('Run again');

    expect(root.querySelector('[data-action="copy-report"]')!.textContent).toBe('Copy report');
  });

  it('renders expanded sections with rows, messages and selectable indices', () => {
    const root: HTMLElement = render({
      kind: 'results',
      summary: {
        sections: [
          {
            ruleId: 'unbound-value',
            title: 'Unbound value',
            severity: 'error',
            findings: [findingFixture('error', 'Card'), findingFixture('error', 'Banner')],
          },
          {
            ruleId: 'primitive-misuse',
            title: 'Primitive misuse',
            severity: 'warning',
            findings: [findingFixture('warning', 'Icon/close')],
          },
        ],
        errorCount: 2,
        warningCount: 1,
      },
      inspectedCount: 42,
      cancelled: false,
      expandedRuleIds: ['unbound-value'],
    });

    const rows: NodeListOf<HTMLElement> = root.querySelectorAll('.finding');
    expect(rows).toHaveLength(2);
    expect(rows[0]!.className).toBe('finding error');
    expect(rows[0]!.getAttribute('data-finding-index')).toBe('0');
    expect(rows[0]!.querySelector('.finding-detail')!.textContent).toBe('Card — Fill — #4A90D9');
    expect(rows[0]!.querySelector('.finding-message')!.textContent).toBe(
      'Raw color value with no design token bound.',
    );
    expect(rows[1]!.getAttribute('data-finding-index')).toBe('1');

    const expandedHeader: HTMLElement = root.querySelector('[data-rule-id="unbound-value"]')!;
    expect(expandedHeader.querySelector('.section-chevron')!.textContent).toBe('▾');

    const collapsedHeader: HTMLElement = root.querySelector('[data-rule-id="primitive-misuse"]')!;
    expect(collapsedHeader.querySelector('.section-chevron')!.textContent).toBe('▸');
  });

  it('keeps flattened finding indices aligned across collapsed sections', () => {
    const root: HTMLElement = render({
      kind: 'results',
      summary: {
        sections: [
          {
            ruleId: 'unbound-value',
            title: 'Unbound value',
            severity: 'error',
            findings: [findingFixture('error', 'Card'), findingFixture('error', 'Banner')],
          },
          {
            ruleId: 'primitive-misuse',
            title: 'Primitive misuse',
            severity: 'warning',
            findings: [findingFixture('warning', 'Icon/close')],
          },
        ],
        errorCount: 2,
        warningCount: 1,
      },
      inspectedCount: 42,
      cancelled: false,
      expandedRuleIds: ['primitive-misuse'],
    });

    const rows: NodeListOf<HTMLElement> = root.querySelectorAll('.finding');
    expect(rows).toHaveLength(1);
    expect(rows[0]!.className).toBe('finding warning');
    expect(rows[0]!.getAttribute('data-finding-index')).toBe('2');
  });

  it('marks cancelled runs with a partial-results note', () => {
    const root: HTMLElement = render({
      kind: 'results',
      summary: { sections: [], errorCount: 0, warningCount: 1 },
      inspectedCount: 7,
      cancelled: true,
    });

    expect(root.querySelector('.cancelled')!.textContent).toBe('Cancelled — partial results.');
    expect(root.querySelector('.panel')!.classList.contains('refreshed')).toBe(false);
  });

  it('pulses refreshed result panels', () => {
    const root: HTMLElement = render({
      kind: 'results',
      summary: { sections: [], errorCount: 0, warningCount: 0 },
      inspectedCount: 3,
      cancelled: false,
      refreshed: true,
    });

    expect(root.querySelector('.panel')!.classList.contains('refreshed')).toBe(true);
  });

  it('renders copied feedback on the copy button', () => {
    const root: HTMLElement = render({
      kind: 'results',
      summary: { sections: [], errorCount: 0, warningCount: 0 },
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
      summary: { sections: [], errorCount: 0, warningCount: 0 },
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

  describe('fix mode rendering', () => {
    const paintFix: FixSuggestion = {
      label: 'surface-primary',
      kind: 'paint',
      target: 'V:1',
      fields: ['fills'],
      paintIndex: 0,
    };
    const fixableFinding: Finding = {
      ...findingFixture('error', 'Card'),
      suggestedFixes: [paintFix],
    };

    function section(
      fixable: readonly Finding[],
      plain: readonly Finding[] = [],
    ): Extract<LintPanelState, { readonly kind: 'results' }> {
      return {
        kind: 'results',
        summary: {
          sections: [
            {
              ruleId: 'unbound-value',
              title: 'Unbound value',
              severity: 'error',
              findings: [...fixable, ...plain],
            },
          ],
          errorCount: fixable.length + plain.length,
          warningCount: 0,
        },
        inspectedCount: 5,
        cancelled: false,
        expandedRuleIds: ['unbound-value'],
      };
    }

    it('renders a Fix button on fixable rows and keeps plain rows simple', () => {
      const root: HTMLElement = render(
        section([fixableFinding], [findingFixture('error', 'Icon')]),
      );

      const fixButton: HTMLElement = root.querySelector('[data-action="fix-finding"]')!;
      expect(fixButton.textContent).toBe('Fix: surface-primary');
      expect(fixButton.getAttribute('data-finding-index')).toBe('0');

      const fixableRow: HTMLElement = root.querySelector('.finding.fixable')!;
      expect(fixableRow.querySelector('[data-finding-index="0"]')).not.toBeNull();

      const plainRow: HTMLElement = root.querySelector('button.finding:not(.fixable)')!;
      expect(plainRow.getAttribute('data-finding-index')).toBe('1');
      expect(plainRow.querySelector('[data-action="fix-finding"]')).toBeNull();
    });

    it('renders a batch button with the token label when one token covers the section', () => {
      const root: HTMLElement = render(
        section([fixableFinding, { ...fixableFinding, nodeId: 'node:2', nodeName: 'Card 2' }]),
      );

      const batch: HTMLElement = root.querySelector('[data-action="fix-rule"]')!;
      expect(batch.textContent).toBe('Apply surface-primary to 2');
      expect(batch.getAttribute('data-rule-id')).toBe('unbound-value');
    });

    it('uses a generic label when the section mixes tokens', () => {
      const other: Finding = {
        ...fixableFinding,
        nodeId: 'node:2',
        suggestedFixes: [
          {
            ...paintFix,
            label: 'spacing/8',
            kind: 'field',
            fields: ['itemSpacing'],
            paintIndex: undefined,
          },
        ],
      };

      const root: HTMLElement = render(section([fixableFinding, other]));

      expect(root.querySelector('[data-action="fix-rule"]')!.textContent).toBe('Apply 2 fixes');
    });

    it('renders a one-click Fix button for single-candidate rows', () => {
      const root: HTMLElement = render(section([fixableFinding]));

      const fixButton: HTMLElement = root.querySelector('[data-action="fix-finding"]')!;
      expect(fixButton.textContent).toBe('Fix: surface-primary');
      expect(fixButton.getAttribute('data-fix-index')).toBeNull();
      expect(root.querySelector('[data-action="fix-toggle-picker"]')).toBeNull();
    });

    it('renders a toggle and no direct apply when several candidates match', () => {
      const ambiguous: Finding = {
        ...fixableFinding,
        suggestedFixes: [paintFix, { ...paintFix, label: 'infomaniak', target: 'V:2' }],
      };
      const root: HTMLElement = render(section([ambiguous]));

      expect(root.querySelector('[data-action="fix-finding"]')).toBeNull();

      const toggle: HTMLElement = root.querySelector('[data-action="fix-toggle-picker"]')!;
      expect(toggle.textContent).toBe('Fix: surface-primary ▸');
      expect(toggle.getAttribute('data-finding-index')).toBe('0');
    });

    it('opens the picker below the detail row, recommended first, and closes again', () => {
      const ambiguous: Finding = {
        ...fixableFinding,
        suggestedFixes: [paintFix, { ...paintFix, label: 'infomaniak', target: 'V:2' }],
      };
      const open: HTMLElement = render(section([ambiguous], []));
      renderPanel({ ...section([ambiguous]), openFixRow: 0 }, open);

      const picker: HTMLElement = open.querySelector('.fix-picker')!;
      const options: readonly HTMLElement[] = [
        ...picker.querySelectorAll<HTMLElement>('[data-action="fix-finding"]'),
      ];
      expect(options.map((option: HTMLElement): string => option.textContent ?? '')).toEqual([
        'Apply surface-primary ✓',
        'Apply infomaniak',
      ]);
      expect(options[0]!.getAttribute('data-fix-index')).toBe('0');
      expect(options[1]!.getAttribute('data-fix-index')).toBe('1');

      // The toggle morphs into Close in the main row; the detail stays above.
      expect(open.querySelector('[data-action="fix-toggle-picker"]')!.textContent).toBe('Close');
      expect(picker.previousElementSibling!.className).toContain('finding-row');

      const closed: HTMLElement = render(section([ambiguous], []));
      renderPanel({ ...section([ambiguous]), openFixRow: 0 }, closed);
      renderPanel(section([ambiguous]), closed);

      expect(closed.querySelector('.fix-picker')).toBeNull();
      expect(closed.querySelector('[data-action="fix-toggle-picker"]')!.textContent).toBe(
        'Fix: surface-primary ▸',
      );
    });

    it('renders confirm/cancel while a rule awaits batch confirmation', () => {
      const root: HTMLElement = render({
        ...section([fixableFinding]),
        confirmRuleId: 'unbound-value',
      });

      const confirm: HTMLElement = root.querySelector('[data-action="fix-rule-confirm"]')!;
      expect(confirm.textContent).toBe('Apply surface-primary to 1');
      expect(confirm.getAttribute('data-rule-id')).toBe('unbound-value');
      expect(root.querySelector('[data-action="fix-rule-cancel"]')).not.toBeNull();
      expect(root.querySelector('[data-action="fix-rule"]')).toBeNull();
    });

    it('renders no batch row when the section has no fixable findings', () => {
      const root: HTMLElement = render(section([], [findingFixture('error', 'Icon')]));

      expect(root.querySelector('[data-action="fix-rule"]')).toBeNull();
    });

    it('renders the fix feedback line and per-row failed markers', () => {
      const root: HTMLElement = render({
        ...section([fixableFinding]),
        fixFeedback: { appliedCount: 2, failedCount: 1, failedNodeIds: ['node:Card'] },
      });

      expect(root.querySelector('.fix-feedback')!.textContent).toBe('2 applied · 1 failed');
      expect(root.querySelector('.fix-feedback')!.classList.contains('failed')).toBe(true);
      expect(root.querySelector('.fix-failed')!.textContent).toBe('fix failed');
    });

    it('renders a success-only feedback line without failed markers', () => {
      const root: HTMLElement = render({
        kind: 'clean',
        inspectedCount: 5,
        fixFeedback: { appliedCount: 1, failedCount: 0, failedNodeIds: [] },
      });

      expect(root.querySelector('.fix-feedback')!.textContent).toBe('✓ 1 fix applied');
      expect(root.querySelector('.fix-failed')).toBeNull();
    });
  });
});
