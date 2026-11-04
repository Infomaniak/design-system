import { describe, expect, test } from 'vitest';
import type { ColorDesignTokenColorSpace } from '../../../../../../../../design-token/token/types/base/types/color/value/members/color-space/color-design-token-color-space.ts';
import type { ColorDesignTokensCollectionTokenValue } from '../../../../../../../token/types/base/color/value/color-design-tokens-collection-token-value.ts';
import { colorDesignTokensCollectionTokenValueToCssValue } from './color-design-tokens-collection-token-value-to-css-value.ts';

const generateCssVariableName = (name: readonly string[]): string => {
  return `--${name.join('-')}`;
};

const options = { generateCssVariableName };

describe('colorDesignTokensCollectionTokenValueToCssValue', () => {
  test('should format a literal srgb color as hex', () => {
    const value: ColorDesignTokensCollectionTokenValue = {
      colorSpace: 'srgb',
      components: [1, 0, 0],
    };

    expect(colorDesignTokensCollectionTokenValueToCssValue(value)).toBe('#f00');
  });

  test('should default the alpha to 1 when components are referenced', () => {
    const value: ColorDesignTokensCollectionTokenValue = {
      colorSpace: 'srgb',
      components: '{color.red.500}',
    };

    expect(colorDesignTokensCollectionTokenValueToCssValue(value, options)).toBe(
      'rgb(from var(--color-red-500) r g b / 1)',
    );
  });

  test('should emit a relative color with a referenced alpha', () => {
    const value: ColorDesignTokensCollectionTokenValue = {
      colorSpace: 'srgb',
      components: '{color.red.500}',
      alpha: '{opacity.medium}',
    };

    expect(colorDesignTokensCollectionTokenValueToCssValue(value, options)).toBe(
      'rgb(from var(--color-red-500) r g b / var(--opacity-medium))',
    );
  });

  test('should emit a relative color with a literal alpha', () => {
    const value: ColorDesignTokensCollectionTokenValue = {
      colorSpace: 'srgb',
      components: '{color.red.500}',
      alpha: 0.5,
    };

    expect(colorDesignTokensCollectionTokenValueToCssValue(value, options)).toBe(
      'rgb(from var(--color-red-500) r g b / 0.5)',
    );
  });

  test('should emit a relative color from a literal color with a referenced alpha', () => {
    const value: ColorDesignTokensCollectionTokenValue = {
      colorSpace: 'srgb',
      components: [1, 0, 0],
      alpha: '{opacity.medium}',
    };

    expect(colorDesignTokensCollectionTokenValueToCssValue(value, options)).toBe(
      'rgb(from #f00 r g b / var(--opacity-medium))',
    );
  });

  test('should emit a relative oklch color', () => {
    const value: ColorDesignTokensCollectionTokenValue = {
      colorSpace: 'oklch',
      components: '{color.red.500}',
      alpha: '{opacity.medium}',
    };

    expect(colorDesignTokensCollectionTokenValueToCssValue(value, options)).toBe(
      'oklch(from var(--color-red-500) l c h / var(--opacity-medium))',
    );
  });

  test('should emit a relative color() for wide-gamut spaces', () => {
    const value: ColorDesignTokensCollectionTokenValue = {
      colorSpace: 'display-p3',
      components: '{color.red.500}',
      alpha: '{opacity.medium}',
    };

    expect(colorDesignTokensCollectionTokenValueToCssValue(value, options)).toBe(
      'color(from var(--color-red-500) display-p3 r g b / var(--opacity-medium))',
    );
  });

  test('should throw on an unsupported color space', () => {
    const value: ColorDesignTokensCollectionTokenValue = {
      colorSpace: 'invalid' as string as ColorDesignTokenColorSpace,
      components: '{color.red.500}',
      alpha: '{opacity.medium}',
    };

    expect(() => colorDesignTokensCollectionTokenValueToCssValue(value, options)).toThrow(
      'Unsupported color space: invalid',
    );
  });
});
