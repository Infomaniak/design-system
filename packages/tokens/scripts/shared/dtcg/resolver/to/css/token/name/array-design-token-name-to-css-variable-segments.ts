import type { ArrayDesignTokenName } from '../../../../token/name/array-design-token-name.ts';
import { designTokenNameSegmentToCssVariableSegment } from './design-token-name-segment-to-css-variable-segment.ts';

export interface ArrayDesignTokenNameToCssVariableSegmentsOptions {
  readonly removeSegments?: Iterable<'empty' | 'dash'>;
}

export function arrayDesignTokenNameToCssVariableSegments(
  name: ArrayDesignTokenName,
  { removeSegments = ['empty', 'dash'] }: ArrayDesignTokenNameToCssVariableSegmentsOptions = {},
): string {
  const _removeSegments = new Set(removeSegments);
  return name
    .map(designTokenNameSegmentToCssVariableSegment)
    .map(designTokenNameSegmentToCssVariableSegment)
    .filter((segment: string): boolean => {
      return (
        !(_removeSegments.has('empty') && segment === '') &&
        !(_removeSegments.has('dash') && segment === '-')
      );
    })
    .join('-');
}
