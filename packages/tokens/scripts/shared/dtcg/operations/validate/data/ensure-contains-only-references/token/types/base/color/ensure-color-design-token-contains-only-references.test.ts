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

  test('should throw when token contains direct color object value (hex)', () => {
    const token: ColorDesignToken = {
      $value: {
        colorSpace: 'srgb',
        components: [0, 0.4, 0.8],
        hex: '#0066cc',
      },
    };

    expect(() => ensureColorDesignTokenContainsOnlyReferences(token)).toThrow();
  });

  test('should not throw when token contains a referenced components and no alpha', () => {
    const token: ColorDesignToken = {
      $value: {
        colorSpace: 'srgb',
        components: '{color.red.500}',
      },
    };

    expect(() => ensureColorDesignTokenContainsOnlyReferences(token)).not.toThrow();
  });

  test('should not throw when token contains referenced components and alpha', () => {
    const token: ColorDesignToken = {
      $value: {
        colorSpace: 'srgb',
        components: '{color.red.500}',
        alpha: '{opacity.20}',
      },
    };

    expect(() => ensureColorDesignTokenContainsOnlyReferences(token)).not.toThrow();
  });

  test('should throw when token contains referenced components with a literal alpha', () => {
    const token: ColorDesignToken = {
      $value: {
        colorSpace: 'srgb',
        components: '{color.red.500}',
        alpha: 0.5,
      },
    };

    expect(() => ensureColorDesignTokenContainsOnlyReferences(token)).toThrow();
  });
});
