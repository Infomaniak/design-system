import type { DurationDesignTokenValueUnit } from './members/duration-design-token-value-unit.ts';

export interface DurationDesignTokenValue {
  readonly value: number;
  readonly unit: DurationDesignTokenValueUnit;
}
