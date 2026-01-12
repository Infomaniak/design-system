import type { CascadeInheritedPropertiesOfDesignTokensTreeContext } from './cascade-inherited-properties-of-design-tokens-tree-context.ts';

import type { GenericDesignToken } from '../../design-token/token/generic-design-token.ts';

export function cascadeInheritedPropertiesOfDesignToken(
  input: GenericDesignToken,
  ctx: CascadeInheritedPropertiesOfDesignTokensTreeContext,
): GenericDesignToken {
  return {
    ...ctx,
    ...input,
  };
}
