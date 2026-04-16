import { describe, expect, test } from 'vitest';
import type { NumberDesignToken } from '../../../../../../../../design-token/token/types/base/types/number/number-design-token.ts';
import { ensureNumberDesignTokenContainsOnlyReferences } from './ensure-number-design-token-contains-only-references.ts';

describe('ensureNumberDesignTokenContainsOnlyReferences', () => {
  test('should not throw when token contains curly reference', () => {
    const token: NumberDesignToken = {
      $value: '{spacing.scale.8}',
    };

    expect(() => ensureNumberDesignTokenContainsOnlyReferences(token)).not.toThrow();
  });

  test('should not throw when token contains JSON reference', () => {
    const token: NumberDesignToken = {
      $value: { $ref: 'spacing.scale.8' },
    };

    expect(() => ensureNumberDesignTokenContainsOnlyReferences(token)).not.toThrow();
  });

  test('should throw when token contains direct number value', () => {
    const token: NumberDesignToken = {
      $value: 42,
    };

    expect(() => ensureNumberDesignTokenContainsOnlyReferences(token)).toThrow();
  });
});
