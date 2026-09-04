import { describe, expect, it } from 'vitest';
import type { Finding } from '../model/finding.ts';
import { findingsToMarkdown } from './markdown.ts';

function errorFinding(nodeName: string, ruleTitle: string = 'Unbound value'): Finding {
  return {
    ruleId: 'unbound-value',
    ruleTitle,
    severity: 'error',
    nodeId: `node:${nodeName}`,
    nodeName,
    propertyLabel: 'Fill',
    valueLabel: '#4A90D9',
    message: 'Raw color value with no design token bound.',
  };
}

function warningFinding(nodeName: string): Finding {
  return { ...errorFinding(nodeName, 'Primitive misuse'), severity: 'warning' };
}

describe('findingsToMarkdown', () => {
  it('renders errors first, then warnings', () => {
    const markdown: string = findingsToMarkdown([
      warningFinding('Icon/close'),
      errorFinding('Card'),
    ]);

    expect(markdown).toBe(
      [
        '# Infomaniak Design Linter',
        '',
        '**1 errors · 1 warnings**',
        '',
        '## Errors',
        '- **Unbound value** — `Card` — Fill — `#4A90D9`',
        '',
        '## Warnings',
        '- **Primitive misuse** — `Icon/close` — Fill — `#4A90D9`',
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
        '# Infomaniak Design Linter',
        '',
        '**0 errors · 0 warnings**',
        '',
        'All checked properties are token-bound.',
        '',
      ].join('\n'),
    );
  });
});
