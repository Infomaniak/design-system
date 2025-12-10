import type { DimensionDesignTokenValueUnit } from './members/dimension-design-token-value-unit.ts';

export interface DimensionDesignTokenValue {
  readonly value: number;
  readonly unit: DimensionDesignTokenValueUnit;
}
