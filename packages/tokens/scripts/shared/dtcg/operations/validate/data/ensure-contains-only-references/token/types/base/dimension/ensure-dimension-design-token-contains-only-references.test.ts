import { describe, expect, test } from 'vitest';
import type { DimensionDesignToken } from '../../../../../../../../design-token/token/types/base/types/dimension/dimension-design-token.ts';
import { ensureDimensionDesignTokenContainsOnlyReferences } from './ensure-dimension-design-token-contains-only-references.ts';

describe('ensureDimensionDesignTokenContainsOnlyReferences', () => {
  test('should not throw when token contains curly reference', () => {
    const token: DimensionDesignToken = {
      $value: '{spacing.base}',
    };

    expect(() => ensureDimensionDesignTokenContainsOnlyReferences(token)).not.toThrow();
  });

  test('should not throw when token contains JSON reference', () => {
    const token: DimensionDesignToken = {
      $value: { $ref: 'spacing.base' },
    };

    expect(() => ensureDimensionDesignTokenContainsOnlyReferences(token)).not.toThrow();
  });

  test('should throw when token contains direct dimension object value', () => {
    const token: DimensionDesignToken = {
      $value: {
        value: 16,
        unit: 'px',
      },
    };

    expect(() => ensureDimensionDesignTokenContainsOnlyReferences(token)).toThrow();
  });
});
