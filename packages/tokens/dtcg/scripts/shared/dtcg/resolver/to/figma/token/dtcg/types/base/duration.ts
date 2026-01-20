import type { DurationDesignTokensCollectionToken } from '../../../../../../token/types/base/duration/duration-design-tokens-collection-token.ts';
import type { DurationDesignTokensCollectionTokenValue } from '../../../../../../token/types/base/duration/value/duration-design-tokens-collection-token-value.ts';
import type { NumberFigmaDesignToken } from '../../../../figma/token/types/number/number-figma-design-token.ts';
import { valueOrCurlyReferenceToValueOrFigmaReference } from '../../../../reference/value-or-curly-reference-to-figma-reference.ts';

export function durationDesignTokensCollectionTokenToNumberFigmaDesignToken(
  token: DurationDesignTokensCollectionToken,
): NumberFigmaDesignToken {
  return {
    $type: 'number',
    $value: valueOrCurlyReferenceToValueOrFigmaReference(
      token.value,
      durationDesignTokensCollectionTokenValueToFigmaValue,
    ),
    $description: token.description,
  };
}

export function durationDesignTokensCollectionTokenValueToFigmaValue(
  value: DurationDesignTokensCollectionTokenValue,
): number {
  return value.unit === 's' ? value.value * 1000 : value.value;
}
