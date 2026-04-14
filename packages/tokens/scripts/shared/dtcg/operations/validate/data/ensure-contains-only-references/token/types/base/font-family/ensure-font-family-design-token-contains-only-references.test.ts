import { describe, expect, test } from 'vitest';
import type { FontFamilyDesignToken } from '../../../../../../../../design-token/token/types/base/types/font-family/font-family-design-token.ts';
import { ensureFontFamilyDesignTokenContainsOnlyReferences } from './ensure-font-family-design-token-contains-only-references.ts';

describe('ensureFontFamilyDesignTokenContainsOnlyReferences', () => {
  test('should not throw when token contains curly reference', () => {
    const token: FontFamilyDesignToken = {
      $value: '{font.family.primary}',
    };

    expect(() => ensureFontFamilyDesignTokenContainsOnlyReferences(token)).not.toThrow();
  });

  test('should not throw when token contains JSON reference', () => {
    const token: FontFamilyDesignToken = {
      $value: { $ref: 'font.family.primary' },
    };

    expect(() => ensureFontFamilyDesignTokenContainsOnlyReferences(token)).not.toThrow();
  });

  test('should throw when token contains direct font family string', () => {
    const token: FontFamilyDesignToken = {
      $value: 'Arial, sans-serif',
    };

    expect(() => ensureFontFamilyDesignTokenContainsOnlyReferences(token)).toThrow();
  });

  test('should throw when token contains direct font family array', () => {
    const token: FontFamilyDesignToken = {
      $value: ['Arial', 'sans-serif'],
    };

    expect(() => ensureFontFamilyDesignTokenContainsOnlyReferences(token)).toThrow();
  });
});
