import type { BorderDesignTokenValueColor } from '../../border-design-token-value-color.ts';
import { isColorBorderDesignTokenValueColor } from '../../types/color/is-color-border-design-token-value-color.ts';
import {
  colorBorderDesignTokenValueColorToCssValue,
  type ColorBorderDesignTokenValueColorToCssValueOptions,
} from '../../types/color/to/css-value/color-border-design-token-value-color-to-css-value.ts';
import {
  referenceBorderDesignTokenValueColorToCssValue,
  type ReferenceBorderDesignTokenValueColorToCssValueOptions,
} from '../../types/reference/to/css-value/reference-border-design-token-value-color-to-css-value.ts';

export interface BorderDesignTokenValueColorToCssValueOptions
  extends
    ColorBorderDesignTokenValueColorToCssValueOptions,
    ReferenceBorderDesignTokenValueColorToCssValueOptions {}

export function borderDesignTokenValueColorToCssValue(
  color: BorderDesignTokenValueColor,
  options?: BorderDesignTokenValueColorToCssValueOptions,
): string {
  if (isColorBorderDesignTokenValueColor(color)) {
    return colorBorderDesignTokenValueColorToCssValue(color, options);
  } else {
    return referenceBorderDesignTokenValueColorToCssValue(color, options);
  }
}
