import { isJsonReference } from '../../../../../../../reference/types/json/is-json-reference.ts';
import type { DimensionDesignTokenValue } from '../dimension-design-token-value.ts';
import { convertRemToPx } from '../members/value/convert/convert-rem-to-px.ts';

export function convertDimensionDesignTokenValueToPx({
  value,
  unit,
}: DimensionDesignTokenValue): DimensionDesignTokenValue {
  if (isJsonReference(value) || isJsonReference(unit)) {
    throw new Error('Unable to convert JSON reference to px');
  }

  return {
    value: unit === 'px' ? value : convertRemToPx(value),
    unit: 'px',
  };
}
