import { isPredefinedFontWeightDesignTokenValue } from '../../../../../../../design-token/token/types/base/types/font-weight/value/types/predefined/is-predefined-font-weight-design-token-value.ts';
import { predefinedFontWeightDesignTokenValueToNumberValue } from '../../../../../../../design-token/token/types/base/types/font-weight/value/types/predefined/to/number-value/predefined-font-weight-design-token-value-to-number-value.ts';
import type { FontWeightDesignTokensCollectionToken } from '../../../../../../token/types/base/font-weight/font-weight-design-tokens-collection-token.ts';
import type { FontWeightDesignTokensCollectionTokenValue } from '../../../../../../token/types/base/font-weight/value/font-weight-design-tokens-collection-token-value.ts';
import type { NumberFigmaDesignToken } from '../../../../figma/token/types/number/number-figma-design-token.ts';
import { valueOrCurlyReferenceToValueOrFigmaReference } from '../../../../reference/value-or-curly-reference-to-figma-reference.ts';

export function fontWeightDesignTokensCollectionTokenToNumberFigmaDesignToken(
  token: FontWeightDesignTokensCollectionToken,
): NumberFigmaDesignToken {
  return {
    $type: 'number',
    $value: valueOrCurlyReferenceToValueOrFigmaReference<
      FontWeightDesignTokensCollectionTokenValue,
      number
    >(token.value, fontWeightDesignTokensCollectionTokenValueToFigmaValue),
    $description: token.description,
  };
}

export function fontWeightDesignTokensCollectionTokenValueToFigmaValue(
  value: FontWeightDesignTokensCollectionTokenValue,
): number {
  return isPredefinedFontWeightDesignTokenValue(value)
    ? predefinedFontWeightDesignTokenValueToNumberValue(value)
    : value;
}
