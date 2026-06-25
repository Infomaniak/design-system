import type { ColorDesignTokensCollectionTokenValue } from '../../../../../../../token/types/base/color/value/color-design-tokens-collection-token-value.ts';
import { colorDesignTokensCollectionTokenValueToColorInstance } from '../../../../../../../token/types/base/color/value/to/color-design-tokens-collection-token-value-to-color-instance.ts';
import type { KotlinVariableDeclarationColorValue } from '../../../../../kotlin-variable-declaration/value/built-in/color/kotlin-variable-declaration-color-value.ts';

/**
 * @inheritDoc https://developer.android.com/reference/kotlin/androidx/compose/ui/graphics/Color#public-constructors
 */
export function colorDesignTokensCollectionTokenValueToKotlinValue(
  value: ColorDesignTokensCollectionTokenValue,
): KotlinVariableDeclarationColorValue {
  const hexColor: string = colorDesignTokensCollectionTokenValueToColorInstance(value)
    .toString({
      format: 'hex',
      alpha: true,
      collapse: false,
    })
    .toUpperCase(); // #RRGGBBAA

  return {
    type: 'Color',
    value: `Color(0x${hexColor.slice(7, 9)}${hexColor.slice(1, 7)})`, // #AARRGGBB
  };
}
