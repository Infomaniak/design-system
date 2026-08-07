import { isJsonReference } from '../../../../../../../reference/types/json/is-json-reference.ts';
import type { DimensionDesignTokenValue } from '../dimension-design-token-value.ts';
import { convertPxToRem } from '../members/value/convert/convert-px-to-rem.ts';

export function convertDimensionDesignTokenValueToRem({
  value,
  unit,
}: DimensionDesignTokenValue): DimensionDesignTokenValue {
  if (isJsonReference(value) || isJsonReference(unit)) {
    throw new Error('Unable to convert JSON reference to rem');
  }

  return {
    value: unit === 'rem' ? value : convertPxToRem(value),
    unit: 'rem',
  };
}
