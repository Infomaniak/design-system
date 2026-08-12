import { convertPxToRem } from '../../../../../../../design-token/token/types/base/types/dimension/value/members/value/convert/convert-px-to-rem.ts';
import type { DimensionDesignTokensCollectionTokenValue } from '../dimension-design-tokens-collection-token-value.ts';

export function convertDimensionDesignTokensCollectionTokenValueToRem({
  value,
  unit,
}: DimensionDesignTokensCollectionTokenValue): DimensionDesignTokensCollectionTokenValue {
  return {
    value: unit === 'rem' ? value : convertPxToRem(value),
    unit: 'rem',
  };
}
