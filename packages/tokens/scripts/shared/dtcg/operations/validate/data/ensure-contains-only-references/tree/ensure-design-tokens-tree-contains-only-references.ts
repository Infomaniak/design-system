import { isDesignTokensGroup } from '../../../../../design-token/group/is-design-tokens-group.ts';
import type { DesignTokensTree } from '../../../../../design-token/tree/design-tokens-tree.ts';
import type { ValidateDesignTokensTreeContext } from '../../../validate-design-tokens-tree-context.ts';
import { ensureDesignTokensGroupContainsOnlyReferences } from '../group/ensure-design-tokens-group-contains-only-references.ts';
import { ensureDesignTokenContainsOnlyReferences } from '../token/ensure-design-token-contains-only-references.ts';

export function ensureDesignTokensTreeContainsOnlyReferences(
  tree: DesignTokensTree,
  context: ValidateDesignTokensTreeContext,
): void {
  if (isDesignTokensGroup(tree)) {
    ensureDesignTokensGroupContainsOnlyReferences(tree, context);
  } else {
    ensureDesignTokenContainsOnlyReferences(tree, context);
  }
}
