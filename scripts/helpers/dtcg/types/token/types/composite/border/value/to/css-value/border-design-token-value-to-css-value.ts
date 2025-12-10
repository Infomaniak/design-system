import type { BorderDesignTokenValue } from '../../border-design-token-value.ts';

import {
  borderDesignTokenValueColorToCssValue,
  type BorderDesignTokenValueColorToCssValueOptions,
} from '../../members/color/to/css-value/border-design-token-value-color-to-css-value.ts';
import {
  borderDesignTokenValueStyleToCssValue,
  type BorderDesignTokenValueStyleToCssValueOptions,
} from '../../members/style/to/css-value/border-design-token-value-style-to-css-value.ts';
import {
  borderDesignTokenValueWidthToCssValue,
  type BorderDesignTokenValueWidthToCssValueOptions,
} from '../../members/width/to/css-value/border-design-token-value-width-to-css-value.ts';

export interface BorderDesignTokenValueToCssValueOptions
  extends
    BorderDesignTokenValueWidthToCssValueOptions,
    BorderDesignTokenValueStyleToCssValueOptions,
    BorderDesignTokenValueColorToCssValueOptions {}

/**
 * @inheritDoc https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/border
 */
export function borderDesignTokenValueToCssValue({
  color,
  width,
  style,
}: BorderDesignTokenValue): string {
  return `${borderDesignTokenValueWidthToCssValue(width)} ${borderDesignTokenValueStyleToCssValue(style)} ${borderDesignTokenValueColorToCssValue(color)}`;
}
