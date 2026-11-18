import { describe, expect, test } from 'vitest';
import type { ColorDesignTokenValue } from '../../../../../../../../design-token/token/types/base/types/color/value/color-design-token-value.ts';
import { ensureColorDesignTokenValueContainsOnlyReferences } from './ensure-color-design-token-value-contains-only-references.ts';

describe('ensureColorDesignTokenValueContainsOnlyReferences', () => {
  test('should not throw when components is a curly reference', () => {
    const $value: ColorDesignTokenValue = {
      colorSpace: 'srgb',
      components: '{color.red.500}',
    };

    expect(() => ensureColorDesignTokenValueContainsOnlyReferences($value)).not.toThrow();
  });

  test('should not throw when components is a JSON reference', () => {
    const $value: ColorDesignTokenValue = {
      colorSpace: 'srgb',
      components: { $ref: 'color.red.500' },
    };

    expect(() => ensureColorDesignTokenValueContainsOnlyReferences($value)).not.toThrow();
  });

  test('should not throw when components is a reference and alpha is a reference', () => {
    const $value: ColorDesignTokenValue = {
      colorSpace: 'srgb',
      components: '{color.red.500}',
      alpha: '{opacity.20}',
    };

    expect(() => ensureColorDesignTokenValueContainsOnlyReferences($value)).not.toThrow();
  });

  test('should not throw when components is a reference and alpha is a raw value (documented Figma exception)', () => {
    const $value: ColorDesignTokenValue = {
      colorSpace: 'srgb',
      components: '{color.red.500}',
      alpha: 0.5,
    };

    expect(() => ensureColorDesignTokenValueContainsOnlyReferences($value)).not.toThrow();
  });

  test('should throw when components is a direct value', () => {
    const $value: ColorDesignTokenValue = {
      colorSpace: 'srgb',
      components: [0, 0.4, 0.8],
      hex: '#0066cc',
    };

    expect(() => ensureColorDesignTokenValueContainsOnlyReferences($value)).toThrow();
  });
});
