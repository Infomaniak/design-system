import {
  colorDesignTokenValueToCssValue,
  type ColorDesignTokenValueToCssValueOptions,
} from '../../../../../../../../../color/value/to/css-value/color-design-token-value-to-css-value.ts';
import type { ColorBorderDesignTokenValueColor } from '../../color-border-design-token-value-color.ts';

export interface ColorBorderDesignTokenValueColorToCssValueOptions extends ColorDesignTokenValueToCssValueOptions {}

export function colorBorderDesignTokenValueColorToCssValue(
  color: ColorBorderDesignTokenValueColor,
  options?: ColorBorderDesignTokenValueColorToCssValueOptions,
): string {
  return colorDesignTokenValueToCssValue(color, options);
}
