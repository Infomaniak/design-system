import { describe, expect, it } from 'vitest';
import type { Finding } from '../model/finding.ts';
import { findingsToMarkdown } from './markdown.ts';

const RULE_TITLES: Readonly<Record<string, string>> = {
  'unbound-value': 'Unbound value',
  'wrong-token': 'Wrong token',
  'primitive-misuse': 'Primitive misuse',
};

function errorFinding(nodeName: string, ruleId: string = 'unbound-value'): Finding {
  return {
    ruleId,
    ruleTitle: RULE_TITLES[ruleId]!,
    severity: 'error',
    nodeId: `node:${nodeName}`,
    nodeName,
    propertyLabel: 'Fill',
    valueLabel: '#4A90D9',
    message: 'Raw color value with no design token bound.',
  };
}

function warningFinding(nodeName: string): Finding {
  return { ...errorFinding(nodeName, 'primitive-misuse'), severity: 'warning' };
}

describe('findingsToMarkdown', () => {
  it('renders errors first, then warnings, grouped by rule', () => {
    const markdown: string = findingsToMarkdown([
      warningFinding('Icon/close'),
      errorFinding('Card'),
    ]);

    expect(markdown).toBe(
      [
        '# ESDS Linter',
        '',
        '**1 errors · 1 warnings**',
        '',
        '## Errors',
        '',
        '### Unbound value (1)',
        '- `Card` — Fill — `#4A90D9`',
        '',
        '## Warnings',
        '',
        '### Primitive misuse (1)',
        '- `Icon/close` — Fill — `#4A90D9`',
        '',
      ].join('\n'),
    );
  });

  it('groups same-rule findings under one section per severity', () => {
    const markdown: string = findingsToMarkdown([
      errorFinding('Card'),
      errorFinding('Banner', 'wrong-token'),
      errorFinding('Icon/close'),
    ]);

    expect(markdown).toBe(
      [
        '# ESDS Linter',
        '',
        '**3 errors · 0 warnings**',
        '',
        '## Errors',
        '',
        '### Unbound value (2)',
        '- `Card` — Fill — `#4A90D9`',
        '- `Icon/close` — Fill — `#4A90D9`',
        '',
        '### Wrong token (1)',
        '- `Banner` — Fill — `#4A90D9`',
        '',
      ].join('\n'),
    );
  });

  it('appends the inspected layer count when provided', () => {
    const markdown: string = findingsToMarkdown([errorFinding('Card')], { inspectedCount: 340 });

    expect(markdown).toContain('**1 errors · 0 warnings** — 340 layers inspected');
  });

  it('appends a cancelled note', () => {
    const markdown: string = findingsToMarkdown([errorFinding('Card')], { cancelled: true });

    expect(markdown).toContain('_Cancelled — partial results._');
  });

  it('renders a clean pass for zero findings', () => {
    expect(findingsToMarkdown([])).toBe(
      [
        '# ESDS Linter',
        '',
        '**0 errors · 0 warnings**',
        '',
        'All checked properties are token-bound.',
        '',
      ].join('\n'),
    );
  });
});
