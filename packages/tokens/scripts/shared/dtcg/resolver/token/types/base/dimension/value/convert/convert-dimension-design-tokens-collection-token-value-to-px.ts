import { convertRemToPx } from '../../../../../../../design-token/token/types/base/types/dimension/value/members/value/convert/convert-rem-to-px.ts';
import type { DimensionDesignTokensCollectionTokenValue } from '../dimension-design-tokens-collection-token-value.ts';

export function convertDimensionDesignTokensCollectionTokenValueToPx({
  value,
  unit,
}: DimensionDesignTokensCollectionTokenValue): DimensionDesignTokensCollectionTokenValue {
  return {
    value: unit === 'px' ? value : convertRemToPx(value),
    unit: 'px',
  };
}
