import { describe, expect, test } from 'vitest';
import type { FontWeightDesignToken } from '../../../../../../../../design-token/token/types/base/types/font-weight/font-weight-design-token.ts';
import { ensureFontWeightDesignTokenContainsOnlyReferences } from './ensure-font-weight-design-token-contains-only-references.ts';

describe('ensureFontWeightDesignTokenContainsOnlyReferences', () => {
  test('should not throw when token contains curly reference', () => {
    const token: FontWeightDesignToken = {
      $value: '{font.weight.bold}',
    };

    expect(() => ensureFontWeightDesignTokenContainsOnlyReferences(token)).not.toThrow();
  });

  test('should not throw when token contains JSON reference', () => {
    const token: FontWeightDesignToken = {
      $value: { $ref: 'font.weight.bold' },
    };

    expect(() => ensureFontWeightDesignTokenContainsOnlyReferences(token)).not.toThrow();
  });

  test('should throw when token contains direct font weight number', () => {
    const token: FontWeightDesignToken = {
      $value: 700,
    };

    expect(() => ensureFontWeightDesignTokenContainsOnlyReferences(token)).toThrow();
  });

  test('should throw when token contains direct font weight string', () => {
    const token: FontWeightDesignToken = {
      $value: 'bold',
    };

    expect(() => ensureFontWeightDesignTokenContainsOnlyReferences(token)).toThrow();
  });
});
