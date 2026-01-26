import type { ValueOrJsonReference } from '../../../../../../reference/types/json/value-or/value-or-json-reference.ts';
import type { DurationDesignTokenValueUnit } from './members/unit/duration-design-token-value-unit.ts';

export interface DurationDesignTokenValue {
  readonly value: ValueOrJsonReference<number>;
  readonly unit: ValueOrJsonReference<DurationDesignTokenValueUnit>;
}
