import type { ColorDesignTokenValue } from '../../color-design-token-value.ts';
import { colorDesignTokenValueToCssColorValue } from './outputs/color-design-token-value-to-css-color-value.ts';
import { colorDesignTokenValueToCssHexValue } from './outputs/color-design-token-value-to-css-hex-value.ts';
import { colorDesignTokenValueToCssMaybeColorValue } from './outputs/color-design-token-value-to-css-maybe-color-value.ts';

export interface ColorDesignTokenValueToCssValueOptions {
  readonly colorFormat?: 'hex' | 'use-color-function-if-required' | 'always-use-color-function';
}

/**
 * @inheritDoc https://www.w3.org/TR/css-color-4
 * @inheritDoc https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/color
 * @inheritDoc https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value
 */
export function colorDesignTokenValueToCssValue(
  value: ColorDesignTokenValue,
  { colorFormat = 'use-color-function-if-required' }: ColorDesignTokenValueToCssValueOptions = {},
): string {
  switch (colorFormat) {
    case 'hex':
      return colorDesignTokenValueToCssHexValue(value);
    case 'use-color-function-if-required':
      return colorDesignTokenValueToCssMaybeColorValue(value);
    case 'always-use-color-function':
      return colorDesignTokenValueToCssColorValue(value);
    default:
      throw new Error(`Unsupported format: ${colorFormat}`);
  }
}
