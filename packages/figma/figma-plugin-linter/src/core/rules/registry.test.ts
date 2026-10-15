import { describe, expect, it } from 'vitest';
import { LINT_RULES } from './registry.ts';

describe('LINT_RULES registry', () => {
  it('registers all rules in severity order (errors first, warnings last)', () => {
    expect(LINT_RULES.map((rule: { readonly id: string }): string => rule.id)).toEqual([
      'unbound-value',
      'wrong-scope',
      'wrong-token',
      'unbound-effect',
      'no-text-style',
      'icon-as-frame',
      'primitive-misuse',
      'unknown-collection',
      'unresolved-binding',
      'opacity-over-color',
      'local-effect-style',
      'local-text-style',
      'blend-mode',
      'dataviz-brand-root',
      'local-collection',
      'lorem-ipsum',
      'style-override',
      'local-duplicate',
    ]);
  });
});
