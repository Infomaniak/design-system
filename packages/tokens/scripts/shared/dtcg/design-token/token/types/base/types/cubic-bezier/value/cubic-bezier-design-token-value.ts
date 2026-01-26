import type { ValueOrJsonReference } from '../../../../../../reference/types/json/value-or/value-or-json-reference.ts';

export type CubicBezierDesignTokenValue = readonly [
  ValueOrJsonReference<number>,
  ValueOrJsonReference<number>,
  ValueOrJsonReference<number>,
  ValueOrJsonReference<number>,
];
