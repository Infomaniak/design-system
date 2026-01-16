import type { DimensionDesignTokensCollectionToken } from '../../../../../token/types/base/dimension/dimension-design-tokens-collection-token.ts';
import type { DimensionDesignTokensCollectionTokenValue } from '../../../../../token/types/base/dimension/value/dimension-design-tokens-collection-token-value.ts';
import { valueOrCurlyReferenceToValueOrFigmaReference } from '../../../reference/value-or-curly-reference-to-figma-reference.ts';

export function dimensionDesignTokensCollectionTokenToFigmaObject(
  token: DimensionDesignTokensCollectionToken,
): unknown {
  return {
    $type: 'number',
    $value: valueOrCurlyReferenceToValueOrFigmaReference(
      token.value,
      dimensionDesignTokensCollectionTokenValueToFigmaValue,
    ),
    $description: token.description,
  };
}

export function dimensionDesignTokensCollectionTokenValueToFigmaValue(
  value: DimensionDesignTokensCollectionTokenValue,
): number {
  return value.unit === 'rem' ? value.value * 16 : value.value;
}
