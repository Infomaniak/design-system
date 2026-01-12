import type { NormalizeInheritedPropertiesOfDesignTokensTreeContext } from '../../../tree/normalize/inherited-properties/normalize-inherited-properties-of-design-tokens-tree.js';

import type { GenericDesignToken } from '../../generic-design-token.js';

export function normalizeInheritedPropertiesOfDesignToken(
  input: GenericDesignToken,
  ctx: NormalizeInheritedPropertiesOfDesignTokensTreeContext,
): GenericDesignToken {
  return {
    ...ctx,
    ...input,
  };
}
