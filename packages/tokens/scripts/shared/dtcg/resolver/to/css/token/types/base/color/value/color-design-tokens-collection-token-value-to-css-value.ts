import { isCurlyReference } from '../../../../../../../../design-token/reference/types/curly/is-curly-reference.ts';
import type { ColorDesignTokensCollectionTokenValue } from '../../../../../../../token/types/base/color/value/color-design-tokens-collection-token-value.ts';
import { colorDesignTokensCollectionTokenValueToColorInstance } from '../../../../../../../token/types/base/color/value/to/color-design-tokens-collection-token-value-to-color-instance.ts';
import {
  valueOrCurlyReferenceToCssVariableReference,
  type ValueOrCurlyReferenceToCssVariableReferenceOptions,
} from '../../../../../reference/value-or-curly-reference-to-css-variable-reference.ts';
import { numberDesignTokensCollectionTokenValueToCssValue } from '../../number/value/number-design-tokens-collection-token-value-to-css-value.ts';
import { DEFAULT_FORMAT_COLOR_FUNCTION } from './default-format-color-function.ts';
import type { FormatColorFunction } from './format-color-function.ts';

/**
 * NOTE: Curly reference is not official
 */
export interface ColorDesignTokensCollectionTokenValueToCssValueOptions extends ValueOrCurlyReferenceToCssVariableReferenceOptions {
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
    ...options
  }: ColorDesignTokensCollectionTokenValueToCssValueOptions = {},
): string {
  /**
   * NOTE: Curly reference is not official
   */
  if (isCurlyReference(value.components) || isCurlyReference(value.alpha)) {
    const sourceColor: string = valueOrCurlyReferenceToCssVariableReference(
      value.components,
      (): string => {
        return formatColor(
          colorDesignTokensCollectionTokenValueToColorInstance({
            ...value,
            alpha: value.alpha,
          }),
        );
      },
      options,
    );

    /**
     * TODO use `alpha()` function when widely available
     * https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/alpha
     */
    const alpha: string = valueOrCurlyReferenceToCssVariableReference(
      value.alpha ?? 1,
      numberDesignTokensCollectionTokenValueToCssValue,
      options,
    );

    switch (value.colorSpace) {
      case 'srgb':
        return `rgb(from ${sourceColor} r g b / ${alpha})`;
      case 'xyz-d65':
      case 'xyz-d50':
        return `color(from ${sourceColor} ${value.colorSpace} x y z / ${alpha})`;
      case 'hsl':
        return `hsl(from ${sourceColor} h s l / ${alpha})`;
      case 'hwb':
        return `hwb(from ${sourceColor} h w b / ${alpha})`;
      case 'lab':
      case 'oklab':
        return `${value.colorSpace}(from ${sourceColor} l a b / ${alpha})`;
      case 'lch':
      case 'oklch':
        return `${value.colorSpace}(from ${sourceColor} l c h / ${alpha})`;
      case 'srgb-linear':
      case 'display-p3':
      case 'a98-rgb':
      case 'prophoto-rgb':
      case 'rec2020':
        return `color(from ${sourceColor} ${value.colorSpace} r g b / ${alpha})`;
      default:
        throw new Error(`Unsupported color space: ${value.colorSpace}`);
    }
  }

  return formatColor(colorDesignTokensCollectionTokenValueToColorInstance(value));
}
