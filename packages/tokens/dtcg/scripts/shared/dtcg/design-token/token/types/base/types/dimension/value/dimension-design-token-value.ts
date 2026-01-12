import type { ValueOrJsonReference } from '../../../../../../reference/types/json/value-or/value-or-json-reference.js';
import type { DimensionDesignTokenValueUnit } from './members/unit/dimension-design-token-value-unit.ts';

export interface DimensionDesignTokenValue {
  readonly value: ValueOrJsonReference<number>;
  readonly unit: ValueOrJsonReference<DimensionDesignTokenValueUnit>;
}
