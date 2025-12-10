import type { DesignTokenNameSegments } from '../../design-token-name-segments.ts';

export interface DesignTokenNameSegmentsToCssVarNameOptions {
  readonly cssVarNamePrefix?: string;
}

export function designTokenNameSegmentsToCssVarName(
  parts: DesignTokenNameSegments,
  { cssVarNamePrefix = '' }: DesignTokenNameSegmentsToCssVarNameOptions = {},
): string {
  return `--${cssVarNamePrefix === '' ? '' : `${cssVarNamePrefix}-`}${parts.join('-')}`;
}
