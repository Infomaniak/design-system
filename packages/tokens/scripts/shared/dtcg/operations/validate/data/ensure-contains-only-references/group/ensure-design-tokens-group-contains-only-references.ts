import type { DesignTokensGroup } from '../../../../../design-token/group/design-tokens-group.ts';
import type { ValidateDesignTokensTreeContext } from '../../../validate-design-tokens-tree-context.ts';
import { ensureDesignTokensTreeContainsOnlyReferences } from '../tree/ensure-design-tokens-tree-contains-only-references.ts';

export function ensureDesignTokensGroupContainsOnlyReferences(
  token: DesignTokensGroup,
  { file, name, type }: ValidateDesignTokensTreeContext,
): void {
  const {
    $description,
    $type,
    $extends,
    $ref,
    $deprecated,
    $extensions,
    ...children
  }: DesignTokensGroup = token;

  type = $type ?? type;

  for (const [childName, child] of Object.entries(children)) {
    ensureDesignTokensTreeContainsOnlyReferences(child, {
      file,
      name: [...name, childName],
      type,
    });
  }
}
