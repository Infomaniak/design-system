import type { ArrayDesignTokenName } from '../../../../token/name/array-design-token-name.ts';
import { designTokenNameSegmentToKotlinVariableSegment } from './design-token-name-segment-to-kotlin-variable-segment.ts';

export function arrayDesignTokenNameToKotlinVariableSegments(name: ArrayDesignTokenName): string {
  return name
    .map((segment: string, index: number): string => {
      const newSegment: string = designTokenNameSegmentToKotlinVariableSegment(segment);
      return index === 0 || newSegment.length === 0
        ? newSegment
        : `${newSegment.at(0)!.toUpperCase()}${newSegment.slice(1)}`;
    })
    .join('');
}
