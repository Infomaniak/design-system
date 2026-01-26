import { designTokensTreeSchema } from '../../design-token/tree/design-tokens-tree.schema.ts';
import type { DesignTokensTree } from '../../design-token/tree/design-tokens-tree.ts';

export function validateDesignTokensTree(tree: DesignTokensTree): DesignTokensTree {
  return designTokensTreeSchema.parse(tree) as DesignTokensTree;
}
