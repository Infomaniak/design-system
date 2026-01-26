import type { SegmentsReference } from '../../../../../design-token/reference/types/segments/segments-reference.ts';

export interface GenerateCssVariableNameFunction {
  (name: SegmentsReference): string;
}
