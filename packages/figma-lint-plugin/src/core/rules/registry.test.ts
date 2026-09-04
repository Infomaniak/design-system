import { describe, expect, it } from 'vitest';
import { LINT_RULES } from './registry.ts';

describe('LINT_RULES registry', () => {
  it('registers all v1 rules in severity order (errors first, warnings last)', () => {
    expect(LINT_RULES.map((rule: { readonly id: string }): string => rule.id)).toEqual([
      'unbound-value',
      'wrong-scope',
      'wrong-token',
      'primitive-misuse',
      'unknown-collection',
      'unresolved-binding',
    ]);
  });
});
