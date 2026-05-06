import { toCamelCase } from '../../../../../../../../../../scripts/helpers/misc/case/to-camel-case/to-camel-case.ts';

export function designTokenNameSegmentToKotlinVariableSegment(segment: string): string {
  return toCamelCase(segment);
}
