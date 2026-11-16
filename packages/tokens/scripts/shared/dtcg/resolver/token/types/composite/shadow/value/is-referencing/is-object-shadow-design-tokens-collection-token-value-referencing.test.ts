import { describe, expect, test } from 'vitest';
import type { ObjectShadowDesignTokensCollectionTokenValue } from '../types/object/object-shadow-design-tokens-collection-token-value.ts';
import { isObjectShadowDesignTokensCollectionTokenValueReferencing } from './is-object-shadow-design-tokens-collection-token-value-referencing.ts';

const TARGET = '{color.red.500}';
const OTHER = '{color.blue.500}';

const value = (
  overrides: Partial<ObjectShadowDesignTokensCollectionTokenValue> = {},
): ObjectShadowDesignTokensCollectionTokenValue => {
  return {
    offsetX: '{dimension.0}',
    offsetY: '{dimension.1}',
    blur: '{blur.1}',
    spread: '{dimension.0}',
    color: {
      colorSpace: 'srgb',
      components: '{color.gray.700}',
      alpha: 0.3,
    },
    ...overrides,
  };
};

describe('isObjectShadowDesignTokensCollectionTokenValueReferencing', () => {
  test('should return false for a value without any reference to the target', () => {
    expect(isObjectShadowDesignTokensCollectionTokenValueReferencing(value(), TARGET)).toBe(false);
  });

  test('should return true when offsetX references the target', () => {
    expect(
      isObjectShadowDesignTokensCollectionTokenValueReferencing(value({ offsetX: TARGET }), TARGET),
    ).toBe(true);
  });

  test('should return true when offsetY references the target', () => {
    expect(
      isObjectShadowDesignTokensCollectionTokenValueReferencing(value({ offsetY: TARGET }), TARGET),
    ).toBe(true);
  });

  test('should return true when blur references the target', () => {
    expect(
      isObjectShadowDesignTokensCollectionTokenValueReferencing(value({ blur: TARGET }), TARGET),
    ).toBe(true);
  });

  test('should return true when spread references the target', () => {
    expect(
      isObjectShadowDesignTokensCollectionTokenValueReferencing(value({ spread: TARGET }), TARGET),
    ).toBe(true);
  });

  test('should return true when the whole color references the target', () => {
    expect(
      isObjectShadowDesignTokensCollectionTokenValueReferencing(value({ color: TARGET }), TARGET),
    ).toBe(true);
  });

  test('should return false when the whole color references another token', () => {
    expect(
      isObjectShadowDesignTokensCollectionTokenValueReferencing(value({ color: OTHER }), TARGET),
    ).toBe(false);
  });

  test('should return true when the color components reference the target', () => {
    expect(
      isObjectShadowDesignTokensCollectionTokenValueReferencing(
        value({
          color: {
            colorSpace: 'srgb',
            components: TARGET,
            alpha: 0.3,
          },
        }),
        TARGET,
      ),
    ).toBe(true);
  });

  test('should return true when the color alpha references the target', () => {
    expect(
      isObjectShadowDesignTokensCollectionTokenValueReferencing(
        value({
          color: {
            colorSpace: 'srgb',
            components: '{color.gray.700}',
            alpha: TARGET,
          },
        }),
        TARGET,
      ),
    ).toBe(true);
  });
});
