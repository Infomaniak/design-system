import type { DimensionDesignTokensCollectionToken } from '../../../../../../token/types/base/dimension/dimension-design-tokens-collection-token.ts';
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
  return value.unit === 'rem' ? value.value * 16 : value.value;
}
