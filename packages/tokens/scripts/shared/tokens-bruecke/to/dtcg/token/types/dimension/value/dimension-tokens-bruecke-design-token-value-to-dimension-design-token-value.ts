import type { DimensionDesignTokenValue } from '../../../../../../../dtcg/design-token/token/types/base/types/dimension/value/dimension-design-token-value.ts';
import type { DimensionDesignTokenValueUnit } from '../../../../../../../dtcg/design-token/token/types/base/types/dimension/value/members/unit/dimension-design-token-value-unit.ts';
import type { DimensionTokensBrueckeDesignTokenValue } from '../../../../../../tokens-bruecke/token/types/dimension/value/dimension-tokens-bruecke-design-token-value.ts';

export function dimensionTokensBrueckeDesignTokenValueToDimensionDesignTokenValue(
  input: DimensionTokensBrueckeDesignTokenValue,
): DimensionDesignTokenValue {
  let unit: DimensionDesignTokenValueUnit;

  if (input.endsWith('px')) {
    unit = 'px';
  } else if (input.endsWith('rem')) {
    unit = 'rem';
  } else {
    throw new Error(`Unsupported unit: ${input}`);
  }

  const value: number = Number(input.slice(0, -unit.length));

  if (Number.isNaN(value) || !Number.isFinite(value)) {
    throw new Error(`Invalid value: ${input}`);
  }

  return {
    value,
    unit,
  };
}
