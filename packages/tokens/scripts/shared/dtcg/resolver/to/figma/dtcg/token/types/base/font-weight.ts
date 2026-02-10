import { isPredefinedFontWeightDesignTokenValue } from '../../../../../../../design-token/token/types/base/types/font-weight/value/types/predefined/is-predefined-font-weight-design-token-value.ts';
import { predefinedFontWeightDesignTokenValueToNumberValue } from '../../../../../../../design-token/token/types/base/types/font-weight/value/types/predefined/to/number-value/predefined-font-weight-design-token-value-to-number-value.ts';
import type { FontWeightDesignTokensCollectionToken } from '../../../../../../token/types/base/font-weight/font-weight-design-tokens-collection-token.ts';
import type { FontWeightDesignTokensCollectionTokenValue } from '../../../../../../token/types/base/font-weight/value/font-weight-design-tokens-collection-token-value.ts';
import type { NumberFigmaDesignToken } from '../../../../figma/token/types/number/number-figma-design-token.ts';
import { designTokensCollectionTokenWithMapValueToFigmaDesignToken } from '../../design-tokens-collection-token-with-map-value-to-figma-design-token.ts';

export function fontWeightDesignTokensCollectionTokenToNumberFigmaDesignToken(
  token: FontWeightDesignTokensCollectionToken,
): NumberFigmaDesignToken {
  return designTokensCollectionTokenWithMapValueToFigmaDesignToken(
    token,
    'number',
    fontWeightDesignTokensCollectionTokenValueToFigmaValue,
  );
}

export function fontWeightDesignTokensCollectionTokenValueToFigmaValue(
  value: FontWeightDesignTokensCollectionTokenValue,
): number {
  return isPredefinedFontWeightDesignTokenValue(value)
    ? predefinedFontWeightDesignTokenValueToNumberValue(value)
    : value;
}
