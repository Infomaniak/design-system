import { describe, expect, test } from 'vitest';
import { colorTokensBrueckeDesignTokenValueToColorDesignTokenValue } from './color-tokens-bruecke-design-token-value-to-color-design-token-value.ts';

describe('colorTokensBrueckeDesignTokenValueToColorDesignTokenValue', () => {
  test('should convert a string color value', () => {
    expect(colorTokensBrueckeDesignTokenValueToColorDesignTokenValue('#ff0000')).toEqual({
      colorSpace: 'srgb',
      components: [1, 0, 0],
      hex: '#f00',
    });
  });

  test('should fix referenced components and alpha containing "$root"', () => {
    expect(
      colorTokensBrueckeDesignTokenValueToColorDesignTokenValue({
        components: '{t1.color.brand.$root}',
        alpha: '{t1.opacity.medium.$root}',
      }),
    ).toEqual({
      colorSpace: 'srgb',
      components: '{t1.color.brand}',
      alpha: '{t1.opacity.medium}',
    });
  });

  test('should keep referenced components and alpha unchanged when they contain no "$root"', () => {
    expect(
      colorTokensBrueckeDesignTokenValueToColorDesignTokenValue({
        components: '{t1.color.brand}',
        alpha: 0.5,
      }),
    ).toEqual({
      colorSpace: 'srgb',
      components: '{t1.color.brand}',
      alpha: 0.5,
    });
  });

  test('should fix the alpha reference while converting literal components', () => {
    expect(
      colorTokensBrueckeDesignTokenValueToColorDesignTokenValue({
        components: '#ff0000',
        alpha: '{t1.opacity.medium.$root}',
      }),
    ).toEqual({
      colorSpace: 'srgb',
      components: [1, 0, 0],
      alpha: '{t1.opacity.medium}',
    });
  });
});
