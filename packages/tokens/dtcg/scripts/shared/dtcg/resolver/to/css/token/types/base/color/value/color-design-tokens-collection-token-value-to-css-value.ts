import type { SerializeOptions } from 'colorjs.io';
import type { ColorDesignTokensCollectionTokenValue } from '../../../../../../../token/types/base/color/value/color-design-tokens-collection-token-value.ts';
import { colorDesignTokensCollectionTokenValueToColorInstance } from '../../../../../../../token/types/base/color/value/to/color-design-tokens-collection-token-value-to-color-instance.ts';

export interface ColorDesignTokensCollectionTokenValueToCssValueOptions {
  readonly formatColorOptions?: SerializeOptions;
}

/**
 * @inheritDoc https://www.w3.org/TR/css-color-4
 * @inheritDoc https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/color
 * @inheritDoc https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value
 */
export function colorDesignTokensCollectionTokenValueToCssValue(
  value: ColorDesignTokensCollectionTokenValue,
  { formatColorOptions }: ColorDesignTokensCollectionTokenValueToCssValueOptions = {},
): string {
  return colorDesignTokensCollectionTokenValueToColorInstance(value).toString(formatColorOptions);
}
