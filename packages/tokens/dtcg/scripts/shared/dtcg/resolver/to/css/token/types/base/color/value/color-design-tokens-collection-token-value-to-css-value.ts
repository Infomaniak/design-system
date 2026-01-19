import type { ColorDesignTokensCollectionTokenValue } from '../../../../../../../token/types/base/color/value/color-design-tokens-collection-token-value.ts';
import { colorDesignTokensCollectionTokenValueToColorInstance } from '../../../../../../../token/types/base/color/value/to/color-design-tokens-collection-token-value-to-color-instance.ts';
import { DEFAULT_FORMAT_COLOR_FUNCTION } from './default-format-color-function.ts';
import type { FormatColorFunction } from './format-color-function.ts';

export interface ColorDesignTokensCollectionTokenValueToCssValueOptions {
  readonly formatColor?: FormatColorFunction;
}

/**
 * @inheritDoc https://www.w3.org/TR/css-color-4
 * @inheritDoc https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/color
 * @inheritDoc https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value
 */
export function colorDesignTokensCollectionTokenValueToCssValue(
  value: ColorDesignTokensCollectionTokenValue,
  {
    formatColor = DEFAULT_FORMAT_COLOR_FUNCTION,
  }: ColorDesignTokensCollectionTokenValueToCssValueOptions = {},
): string {
  return formatColor(colorDesignTokensCollectionTokenValueToColorInstance(value));
}
