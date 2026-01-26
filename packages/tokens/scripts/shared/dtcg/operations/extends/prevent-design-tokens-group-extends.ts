import type { DesignTokensGroup } from '../../design-token/group/design-tokens-group.ts';
import type { DesignTokenNameSegments } from '../../design-token/token/name/segments/design-token-name-segments.ts';

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
