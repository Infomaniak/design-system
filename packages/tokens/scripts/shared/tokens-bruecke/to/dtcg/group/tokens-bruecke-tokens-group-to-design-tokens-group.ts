import { removeUndefinedProperties } from '../../../../../../../../scripts/helpers/misc/object/remove-undefined-properties.ts';
import type { DesignTokensGroup } from '../../../../dtcg/design-token/group/design-tokens-group.ts';
import type { TokensBrueckeDesignTokensGroup } from '../../../tokens-bruecke/group/tokens-bruecke-design-tokens-group.ts';
import type { TokensBrueckeToDtcgContext } from '../context/tokens-bruecke-to-dtcg-context.ts';
import { tokensBrueckeTokensTreeToDesignTokensTree } from '../tree/tokens-bruecke-tokens-tree-to-design-tokens-tree.ts';

export function tokensBrueckeTokensGroupToDesignTokensGroup(
  { $description, $deprecated, $extensions, ...children }: TokensBrueckeDesignTokensGroup,
  ctx: TokensBrueckeToDtcgContext,
): DesignTokensGroup {
  return {
    ...removeUndefinedProperties({
      $description,
      $deprecated,
      $extensions,
    }),
    ...Object.fromEntries(
      Object.entries(children).map(([key, value]: [string, any]): [string, any] => {
        return [
          key,
          tokensBrueckeTokensTreeToDesignTokensTree(value, {
            ...ctx,
            path: [...ctx.path, key],
          }),
        ];
      }),
    ),
  };
}
