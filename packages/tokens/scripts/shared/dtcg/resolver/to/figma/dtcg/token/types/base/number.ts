import type { NumberDesignTokensCollectionToken } from '../../../../../../token/types/base/number/number-design-tokens-collection-token.ts';
import type { NumberDesignTokensCollectionTokenValue } from '../../../../../../token/types/base/number/value/number-design-tokens-collection-token-value.ts';
import type { NumberFigmaDesignToken } from '../../../../figma/token/types/number/number-figma-design-token.ts';
import { designTokensCollectionTokenWithMapValueToFigmaDesignToken } from '../../design-tokens-collection-token-with-map-value-to-figma-design-token.ts';

export function numberDesignTokensCollectionTokenToNumberFigmaDesignToken(
  token: NumberDesignTokensCollectionToken,
): NumberFigmaDesignToken {
  return designTokensCollectionTokenWithMapValueToFigmaDesignToken(
    token,
    'number',
    numberDesignTokensCollectionTokenValueToFigmaValue,
  );
}

export function numberDesignTokensCollectionTokenValueToFigmaValue(
  value: NumberDesignTokensCollectionTokenValue,
): number {
  return value;
}
