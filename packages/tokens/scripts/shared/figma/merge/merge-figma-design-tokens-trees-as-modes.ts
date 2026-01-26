import { isObject } from '../../../../../../scripts/helpers/misc/object/is-object.ts';
import type { FigmaDesignTokensGroup } from '../../dtcg/resolver/to/figma/figma/group/figma-design-tokens-group.ts';
import type { GenericFigmaDesignToken } from '../../dtcg/resolver/to/figma/figma/token/generic-figma-design-token.ts';
import type { FigmaDesignTokensTree } from '../../dtcg/resolver/to/figma/figma/tree/figma-design-tokens-tree.ts';

export type NamedFigmaTokens = readonly [name: string, tokens: FigmaDesignTokensTree];

export function mergeFigmaDesignTokensTreesAsModes(
  tokensToMerge: readonly NamedFigmaTokens[],
): FigmaDesignTokensTree {
  let type: 'token' | 'group' | undefined;

  for (const [, tokens] of tokensToMerge) {
    if (!isObject(tokens)) {
      throw new Error('Expected an object.');
    }

    const tokensType: 'token' | 'group' = Reflect.has(tokens as object, '$value')
      ? 'token'
      : 'group';

    if (type === undefined) {
      type = tokensType;
    } else if (type !== tokensType) {
      throw new Error('Expected all tokens to be of the same type.');
    }
  }

  if (type === undefined) {
    throw new Error('Expected at least one token.');
  }

  if (type === 'token') {
    // tokens
    const [, token] = tokensToMerge[0];

    /*
      "$extensions": {
        "mode": {
          "Mode 1": "#0c0c0d0d",
          "Mode 2": "#0c0c0d0d"
        }
      }
     */

    return {
      ...(token as GenericFigmaDesignToken),
      $extensions: {
        mode: Object.fromEntries(
          tokensToMerge.map(([name, tree]: NamedFigmaTokens): [string, unknown] => {
            return [name, Reflect.get(tree as object, '$value')];
          }),
        ),
      },
    } satisfies GenericFigmaDesignToken;
  }

  // groups

  return Object.fromEntries(
    Array.from(
      new Set(
        tokensToMerge.flatMap(([, tokens]: NamedFigmaTokens): string[] =>
          Object.keys(tokens as object),
        ),
      ),
    ).map((key: string): [string, unknown] => {
      return [
        key,
        mergeFigmaDesignTokensTreesAsModes(
          tokensToMerge.map(([name, tokens]: NamedFigmaTokens): NamedFigmaTokens => {
            const child: FigmaDesignTokensTree = Reflect.get(tokens, key);
            if (child === undefined) {
              throw new Error(`Expected child "${key}" to exist.`);
            }
            return [name, child];
          }),
        ),
      ];
    }),
  ) as FigmaDesignTokensGroup;
}
