import type { DimensionDesignTokensCollectionToken } from '../../../../../../token/types/base/dimension/dimension-design-tokens-collection-token.ts';
import { convertDimensionDesignTokensCollectionTokenValueToPx } from '../../../../../../token/types/base/dimension/value/convert/convert-dimension-design-tokens-collection-token-value-to-px.ts';
import type { DimensionDesignTokensCollectionTokenValue } from '../../../../../../token/types/base/dimension/value/dimension-design-tokens-collection-token-value.ts';
import type { NumberFigmaDesignToken } from '../../../../figma/token/types/number/number-figma-design-token.ts';
import { designTokensCollectionTokenWithMapValueToFigmaDesignToken } from '../../design-tokens-collection-token-with-map-value-to-figma-design-token.ts';

export function dimensionDesignTokensCollectionTokenToNumberFigmaDesignToken(
  token: DimensionDesignTokensCollectionToken,
): NumberFigmaDesignToken {
  return designTokensCollectionTokenWithMapValueToFigmaDesignToken(
    token,
    'number',
    dimensionDesignTokensCollectionTokenValueToFigmaValue,
  );
}

export function dimensionDesignTokensCollectionTokenValueToFigmaValue(
  value: DimensionDesignTokensCollectionTokenValue,
): number {
  return convertDimensionDesignTokensCollectionTokenValueToPx(value).value;
}
