import { resolveValueOrJsonReference } from '../../../../../../../design-token/reference/types/json/value-or/resolve/resolve-value-or-json-reference.ts';
import type { DimensionDesignTokenValue } from '../../../../../../../design-token/token/types/base/types/dimension/value/dimension-design-token-value.ts';
import type { DimensionDesignTokensCollectionTokenValue } from '../dimension-design-tokens-collection-token-value.ts';

export function dimensionDesignTokenValueToDimensionDesignTokensCollectionTokenValue(
  $value: DimensionDesignTokenValue,
  root: unknown,
): DimensionDesignTokensCollectionTokenValue {
  return {
    value: resolveValueOrJsonReference($value.value, root),
    unit: resolveValueOrJsonReference($value.unit, root),
  };
}
