import type { ColorDesignTokensCollectionToken } from '../../../../../../token/types/base/color/color-design-tokens-collection-token.ts';
import type { ColorDesignTokensCollectionTokenValue } from '../../../../../../token/types/base/color/value/color-design-tokens-collection-token-value.ts';
import { colorDesignTokensCollectionTokenValueToColorInstance } from '../../../../../../token/types/base/color/value/to/color-design-tokens-collection-token-value-to-color-instance.ts';
import type { ColorFigmaDesignToken } from '../../../../figma/token/types/color/color-figma-design-token.ts';
import type { ColorFigmaDesignTokenValue } from '../../../../figma/token/types/color/value/color-figma-design-token-value.ts';
import { designTokensCollectionTokenWithMapValueToFigmaDesignToken } from '../../design-tokens-collection-token-with-map-value-to-figma-design-token.ts';

export function colorDesignTokensCollectionTokenToColorFigmaDesignToken(
  token: ColorDesignTokensCollectionToken,
): ColorFigmaDesignToken {
  return designTokensCollectionTokenWithMapValueToFigmaDesignToken(
    token,
    'color',
    colorDesignTokensCollectionTokenValueToFigmaValue,
  );
}

export interface ColorDesignTokensCollectionTokenValueToFigmaValueOptions {
  readonly hex?: boolean;
}

export function colorDesignTokensCollectionTokenValueToFigmaValue(
  value: ColorDesignTokensCollectionTokenValue,
  { hex = false }: ColorDesignTokensCollectionTokenValueToFigmaValueOptions = {},
): ColorFigmaDesignTokenValue {
  return hex
    ? colorDesignTokensCollectionTokenValueToColorInstance(value).toString({
        format: 'hex',
        collapse: false,
      })
    : {
        colorSpace: value.colorSpace,
        components: value.components,
        alpha: value.alpha,
      };
}
