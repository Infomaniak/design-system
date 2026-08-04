import { isCurlyReference } from '../../../../../../../design-token/reference/types/curly/is-curly-reference.ts';
import type { NumberDesignTokensCollectionToken } from '../../../../../../token/types/base/number/number-design-tokens-collection-token.ts';
import type { NumberDesignTokensCollectionTokenValue } from '../../../../../../token/types/base/number/value/number-design-tokens-collection-token-value.ts';
import type { NumberFigmaDesignToken } from '../../../../figma/token/types/number/number-figma-design-token.ts';
import { designTokensCollectionTokenWithMapValueToFigmaDesignToken } from '../../design-tokens-collection-token-with-map-value-to-figma-design-token.ts';

export function numberDesignTokensCollectionTokenToNumberFigmaDesignToken(
  token: NumberDesignTokensCollectionToken,
): NumberFigmaDesignToken {
  if (!isCurlyReference(token.value)) {
    if (token.name.includes('opacity')) {
      return designTokensCollectionTokenWithMapValueToFigmaDesignToken(
        {
          ...token,
          value: token.value * 100,
        },
        'number',
        numberDesignTokensCollectionTokenValueToFigmaValue,
      );
    }
  }

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
