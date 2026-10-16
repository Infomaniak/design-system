import { describe, expect, it } from 'vitest';
import { LINT_RULES } from './registry.ts';

describe('LINT_RULES registry', () => {
  it('registers the shipped rules in order', () => {
    expect(LINT_RULES.map((rule: { readonly id: string }): string => rule.id)).toEqual([
      'lorem-ipsum',
    ]);
  });
});
