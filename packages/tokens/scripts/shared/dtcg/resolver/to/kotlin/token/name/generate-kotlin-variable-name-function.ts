import type { SegmentsReference } from '../../../../../design-token/reference/types/segments/segments-reference.ts';

export interface GenerateKotlinVariableNameFunction {
  (name: SegmentsReference): string;
}
