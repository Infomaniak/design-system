import { isDesignToken } from '../dtcg/design-token/token/is-design-token.ts';
import type { FigmaDesignTokensGroup } from '../dtcg/resolver/to/figma/figma/group/figma-design-tokens-group.ts';
import type { FigmaDesignTokensTree } from '../dtcg/resolver/to/figma/figma/tree/figma-design-tokens-tree.ts';
import type { ArrayDesignTokenName } from '../dtcg/resolver/token/name/array-design-token-name.ts';

export function insertFigmaDesignTokensTreeIntoFigmaDesignTokensGroup(
  figmaTokens: FigmaDesignTokensGroup,
  name: ArrayDesignTokenName,
  value: FigmaDesignTokensTree,
): void {
  if (name.length === 0) {
    throw new Error('Cannot set property on root');
  }

  let node: FigmaDesignTokensTree = figmaTokens;

  for (let i: number = 0; i < name.length; i++) {
    const segment: PropertyKey = name[i];

    if (isDesignToken(node)) {
      throw new Error('$root tokens are not supported by Figma.');
    }

    if (i === name.length - 1) {
      Reflect.set(node, segment, value);
    } else {
      if (Reflect.has(node, segment)) {
        node = Reflect.get(node, segment);
      } else {
        const next: FigmaDesignTokensTree = {};
        Reflect.set(node, segment, next);
        node = next;
      }
    }
  }
}
