import { describe, expect, test } from 'vitest';
import type { ColorDesignToken } from '../../../../../../../../design-token/token/types/base/types/color/color-design-token.ts';
import { ensureColorDesignTokenContainsOnlyReferences } from './ensure-color-design-token-contains-only-references.ts';

describe('ensureColorDesignTokenContainsOnlyReferences', () => {
  test('should not throw when token contains curly reference', () => {
    const token: ColorDesignToken = {
      $value: '{color.red.500}',
    };

    expect(() => ensureColorDesignTokenContainsOnlyReferences(token)).not.toThrow();
  });

  test('should not throw when token contains JSON reference', () => {
    const token: ColorDesignToken = {
      $value: { $ref: 'color.red.500' },
    };

    expect(() => ensureColorDesignTokenContainsOnlyReferences(token)).not.toThrow();
  });

  test('should not throw when token contains object value with referenced components', () => {
    const token: ColorDesignToken = {
      $value: {
        colorSpace: 'srgb',
        components: '{color.red.500}',
      },
    };

    expect(() => ensureColorDesignTokenContainsOnlyReferences(token)).not.toThrow();
  });

  test('should throw when token contains object value with direct components value', () => {
    const token: ColorDesignToken = {
      $value: {
        colorSpace: 'srgb',
        components: [0, 0.4, 0.8],
        hex: '#0066cc',
      },
    };

    expect(() => ensureColorDesignTokenContainsOnlyReferences(token)).toThrow();
  });
});
