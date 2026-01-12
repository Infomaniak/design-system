import type { DesignTokensGroup } from '../../design-token/group/design-tokens-group.ts';
import { isDesignTokensGroup } from '../../design-token/group/is-design-tokens-group.ts';
import type { DesignTokensTree } from '../../design-token/tree/design-tokens-tree.ts';
import { cascadeInheritedPropertiesOfDesignTokensTree } from '../cascade-inherited-properties/cascade-inherited-properties-of-design-tokens-tree.ts';
import { resolveDesignTokensTreeExtends } from '../resolve-extends/resolve-design-tokens-tree-extends.ts';
import { patchDesignTokensGroup } from './patch-design-tokens-group.ts';

export function mergeDesignTokens(
  tokensA: DesignTokensTree,
  tokensB: DesignTokensTree,
): DesignTokensGroup {
  tokensA = cascadeInheritedPropertiesOfDesignTokensTree(resolveDesignTokensTreeExtends(tokensA));
  tokensB = cascadeInheritedPropertiesOfDesignTokensTree(resolveDesignTokensTreeExtends(tokensB));

  if (!isDesignTokensGroup(tokensA) || !isDesignTokensGroup(tokensB)) {
    throw new Error('Expected both arguments to be DesignTokensGroup.');
  }

  return patchDesignTokensGroup(tokensA, tokensB, {
    onConflict: 'replace',
  });

  // const {
  //   $description: descriptionA,
  //   $type: typeA,
  //   $extends: extendsA,
  //   $ref: refA,
  //   $deprecated: deprecatedA,
  //   $extensions: extensionsA,
  //   ...childrenA
  // } = tokensA;
  //
  // const {
  //   $description: descriptionB,
  //   $type: typeB,
  //   $extends: extendsB,
  //   $ref: refB,
  //   $deprecated: deprecatedB,
  //   $extensions: extensionsB,
  //   ...childrenB
  // } = tokensB;
  //
  // return {
  //   ...tokensA,
  //   ...tokensB,
  // };
}
