import type { DesignTokenNameSegments } from '../../../token/name/segments/design-token-name-segments.js';
import type { DesignTokensGroup } from '../../design-tokens-group.js';

export function preventDesignTokensGroupExtends(
  { $extends, $ref }: DesignTokensGroup,
  path?: DesignTokenNameSegments,
): void {
  if ($extends !== undefined || $ref !== undefined) {
    throw new Error(
      `Found ${$extends !== undefined ? '$extends' : '$ref'} on group${path === undefined ? '' : ` "${path.join('.')}"`}. Normalize it before using it.`,
    );
  }
}
