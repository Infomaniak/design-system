import { isDesignToken } from '../../../token/is-design-token.js';
import type { DesignTokensTree } from '../../design-tokens-tree.js';

import { normalizeInheritedPropertiesOfDesignTokensGroup } from '../../../group/normalize/inherited-properties/normalize-inherited-properties-of-design-tokens-group.js';
import { normalizeInheritedPropertiesOfDesignToken } from '../../../token/normalize/inherited-properties/normalize-inherited-properties-of-design-token.js';

export interface NormalizeInheritedPropertiesOfDesignTokensTreeContext {
  readonly $description?: string;
  readonly $type?: string;
  readonly $deprecated?: boolean | string;
  readonly $extensions?: object;
}

export function normalizeInheritedPropertiesOfDesignTokensTree(
  input: DesignTokensTree,
  ctx: NormalizeInheritedPropertiesOfDesignTokensTreeContext = {},
): DesignTokensTree {
  return isDesignToken(input) ?
      normalizeInheritedPropertiesOfDesignToken(input, ctx)
    : normalizeInheritedPropertiesOfDesignTokensGroup(input, ctx);
}
