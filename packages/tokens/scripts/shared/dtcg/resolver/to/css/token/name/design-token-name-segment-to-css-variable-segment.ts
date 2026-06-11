import { toDashCase } from '../../../../../../../../../../scripts/helpers/misc/case/to-dash-case/to-dash-case.ts';

export function designTokenNameSegmentToCssVariableSegment(segment: string): string {
  return toDashCase(segment);
}
