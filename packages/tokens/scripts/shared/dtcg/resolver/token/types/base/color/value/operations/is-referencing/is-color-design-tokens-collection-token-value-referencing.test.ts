import { describe, expect, test } from 'vitest';
import type { ColorDesignTokensCollectionTokenValue } from '../../color-design-tokens-collection-token-value.ts';
import { isColorDesignTokensCollectionTokenValueReferencing } from './is-color-design-tokens-collection-token-value-referencing.ts';

const TARGET = '{color.red.500}';
const OTHER = '{opacity.medium}';

const value = (
  overrides: Partial<ColorDesignTokensCollectionTokenValue>,
): ColorDesignTokensCollectionTokenValue => {
  return {
    colorSpace: 'srgb',
    components: [1, 0, 0],
    ...overrides,
  };
};

describe('isColorDesignTokensCollectionTokenValueReferencing', () => {
  test('should return false for a color without any reference', () => {
    expect(isColorDesignTokensCollectionTokenValueReferencing(value({}), TARGET)).toBe(false);
  });

  test('should return false for a color with a literal alpha', () => {
    expect(isColorDesignTokensCollectionTokenValueReferencing(value({ alpha: 0.5 }), TARGET)).toBe(
      false,
    );
  });

  test('should return true when components reference the target', () => {
    expect(
      isColorDesignTokensCollectionTokenValueReferencing(value({ components: TARGET }), TARGET),
    ).toBe(true);
  });

  test('should return false when components reference another token', () => {
    expect(
      isColorDesignTokensCollectionTokenValueReferencing(value({ components: OTHER }), TARGET),
    ).toBe(false);
  });

  test('should return true when alpha references the target', () => {
    expect(
      isColorDesignTokensCollectionTokenValueReferencing(value({ alpha: TARGET }), TARGET),
    ).toBe(true);
  });

  test('should return false when alpha references another token', () => {
    expect(
      isColorDesignTokensCollectionTokenValueReferencing(value({ alpha: OTHER }), TARGET),
    ).toBe(false);
  });

  test('should return true when components reference the target even if alpha references another token', () => {
    expect(
      isColorDesignTokensCollectionTokenValueReferencing(
        value({ components: TARGET, alpha: OTHER }),
        TARGET,
      ),
    ).toBe(true);
  });
});
