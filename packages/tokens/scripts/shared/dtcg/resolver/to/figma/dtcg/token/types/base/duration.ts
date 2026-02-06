import type { DurationDesignTokensCollectionToken } from '../../../../../../token/types/base/duration/duration-design-tokens-collection-token.ts';
import type { DurationDesignTokensCollectionTokenValue } from '../../../../../../token/types/base/duration/value/duration-design-tokens-collection-token-value.ts';
import type { NumberFigmaDesignToken } from '../../../../figma/token/types/number/number-figma-design-token.ts';
import { designTokensCollectionTokenWithMapValueToFigmaDesignToken } from '../../design-tokens-collection-token-with-map-value-to-figma-design-token.ts';

export function durationDesignTokensCollectionTokenToNumberFigmaDesignToken(
  token: DurationDesignTokensCollectionToken,
): NumberFigmaDesignToken {
  return designTokensCollectionTokenWithMapValueToFigmaDesignToken(
    token,
    'number',
    durationDesignTokensCollectionTokenValueToFigmaValue,
  );
}

export function durationDesignTokensCollectionTokenValueToFigmaValue(
  value: DurationDesignTokensCollectionTokenValue,
): number {
  return value.unit === 's' ? value.value * 1000 : value.value;
}
