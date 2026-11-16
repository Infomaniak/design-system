import { describe, expect, test } from 'vitest';
import type { ObjectShadowDesignTokensCollectionTokenValue } from '../types/object/object-shadow-design-tokens-collection-token-value.ts';
import { isShadowDesignTokensCollectionTokenValueReferencing } from './is-shadow-design-tokens-collection-token-value-referencing.ts';

const TARGET = '{color.red.500}';
const OTHER = '{color.blue.500}';

const objectValue = (
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

describe('isShadowDesignTokensCollectionTokenValueReferencing', () => {
  test('should return false for an object value without any reference to the target', () => {
    expect(isShadowDesignTokensCollectionTokenValueReferencing(objectValue(), TARGET)).toBe(false);
  });

  test('should return true when an object value references the target', () => {
    expect(
      isShadowDesignTokensCollectionTokenValueReferencing(objectValue({ blur: TARGET }), TARGET),
    ).toBe(true);
  });

  test('should return false for an object array value without any reference to the target', () => {
    expect(isShadowDesignTokensCollectionTokenValueReferencing([objectValue()], TARGET)).toBe(
      false,
    );
  });

  test('should return true when an object of the array references the target', () => {
    expect(
      isShadowDesignTokensCollectionTokenValueReferencing(
        [objectValue(), objectValue({ blur: TARGET })],
        TARGET,
      ),
    ).toBe(true);
  });

  test('should return true when a whole-value reference of the array matches the target', () => {
    expect(isShadowDesignTokensCollectionTokenValueReferencing([OTHER, TARGET], TARGET)).toBe(true);
  });

  test('should return false when a whole-value reference of the array does not match the target', () => {
    expect(isShadowDesignTokensCollectionTokenValueReferencing([OTHER, OTHER], TARGET)).toBe(false);
  });
});
