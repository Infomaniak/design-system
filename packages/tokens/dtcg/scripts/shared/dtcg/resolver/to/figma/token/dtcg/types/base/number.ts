import type { NumberDesignTokensCollectionToken } from '../../../../../../token/types/base/number/number-design-tokens-collection-token.ts';
import type { NumberDesignTokensCollectionTokenValue } from '../../../../../../token/types/base/number/value/number-design-tokens-collection-token-value.ts';
import type { NumberFigmaDesignToken } from '../../../../figma/token/types/number/number-figma-design-token.ts';
import { valueOrCurlyReferenceToValueOrFigmaReference } from '../../../../reference/value-or-curly-reference-to-figma-reference.ts';

export function numberDesignTokensCollectionTokenToNumberFigmaDesignToken(
  token: NumberDesignTokensCollectionToken,
): NumberFigmaDesignToken {
  return {
    $type: 'number',
    $value: valueOrCurlyReferenceToValueOrFigmaReference(
      token.value,
      numberDesignTokensCollectionTokenValueToFigmaValue,
    ),
    $description: token.description,
  };
}

export function numberDesignTokensCollectionTokenValueToFigmaValue(
  value: NumberDesignTokensCollectionTokenValue,
): number {
  return value;
}
