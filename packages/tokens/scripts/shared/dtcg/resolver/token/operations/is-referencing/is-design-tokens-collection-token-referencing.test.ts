import { describe, expect, test } from 'vitest';
import type { ColorDesignTokensCollectionToken } from '../../types/base/color/color-design-tokens-collection-token.ts';
import type { TypographyDesignTokensCollectionToken } from '../../types/composite/typography/typography-design-tokens-collection-token.ts';
import { isDesignTokensCollectionTokenReferencing } from './is-design-tokens-collection-token-referencing.ts';

const TARGET = '{color.red.500}';
const OTHER = '{opacity.medium}';

describe('isDesignTokensCollectionTokenReferencing', () => {
  test('should return true for a whole-value reference matching the target', () => {
    const token: ColorDesignTokensCollectionToken = {
      type: 'color',
      name: ['color', 'background', 'brand'],
      value: TARGET,
      files: [],
    };

    expect(isDesignTokensCollectionTokenReferencing(token, TARGET)).toBe(true);
  });

  test('should return false for a whole-value reference not matching the target', () => {
    const token: ColorDesignTokensCollectionToken = {
      type: 'color',
      name: ['color', 'background', 'brand'],
      value: OTHER,
      files: [],
    };

    expect(isDesignTokensCollectionTokenReferencing(token, TARGET)).toBe(false);
  });

  test('should return true for a color object-value referencing the target through components', () => {
    const token: ColorDesignTokensCollectionToken = {
      type: 'color',
      name: ['color', 'background', 'brand'],
      value: {
        colorSpace: 'srgb',
        components: TARGET,
      },
      files: [],
    };

    expect(isDesignTokensCollectionTokenReferencing(token, TARGET)).toBe(true);
  });

  test('should return true for a color object-value referencing the target through alpha', () => {
    const token: ColorDesignTokensCollectionToken = {
      type: 'color',
      name: ['color', 'background', 'brand'],
      value: {
        colorSpace: 'srgb',
        components: [1, 0, 0],
        alpha: TARGET,
      },
      files: [],
    };

    expect(isDesignTokensCollectionTokenReferencing(token, TARGET)).toBe(true);
  });

  test('should return false for a color object-value without any reference', () => {
    const token: ColorDesignTokensCollectionToken = {
      type: 'color',
      name: ['color', 'background', 'brand'],
      value: {
        colorSpace: 'srgb',
        components: [1, 0, 0],
        alpha: 0.5,
      },
      files: [],
    };

    expect(isDesignTokensCollectionTokenReferencing(token, TARGET)).toBe(false);
  });

  test('should still return true for a typography value referencing the target', () => {
    const token: TypographyDesignTokensCollectionToken = {
      type: 'typography',
      name: ['typography', 'body'],
      value: {
        fontFamily: TARGET,
        fontSize: {
          value: 16,
          unit: 'px',
        },
        fontWeight: 400,
        letterSpacing: {
          value: 0,
          unit: 'px',
        },
        lineHeight: 1.5,
      },
      files: [],
    };

    expect(isDesignTokensCollectionTokenReferencing(token, TARGET)).toBe(true);
  });

  test('should throw for a token without type', () => {
    const token = {
      name: ['color', 'background', 'brand'],
      value: {
        colorSpace: 'srgb',
        components: [1, 0, 0],
      },
      files: [],
    } as const;

    expect(() => {
      isDesignTokensCollectionTokenReferencing(
        token as unknown as Parameters<typeof isDesignTokensCollectionTokenReferencing>[0],
        OTHER,
      );
    }).toThrow('Expected token with type.');
  });
});
