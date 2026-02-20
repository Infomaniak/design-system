import { removeUndefinedProperties } from '../../../../../../../../scripts/helpers/misc/object/remove-undefined-properties.ts';
import type { DesignTokensGroup } from '../../../../dtcg/design-token/group/design-tokens-group.ts';
import type { TypographyDesignToken } from '../../../../dtcg/design-token/token/types/composite/types/typography/typography-design-token.ts';
import type { TokensBrueckeDesignTokensGroup } from '../../../tokens-bruecke/group/tokens-bruecke-design-tokens-group.ts';
import { isTypographyTokensBrueckeDesignTokensGroup } from '../../../tokens-bruecke/group/types/typography/is-typography-tokens-bruecke-design-tokens-group.ts';
import type { TokensBrueckeToDtcgContext } from '../context/tokens-bruecke-to-dtcg-context.ts';
import { dimensionTokensBrueckeDesignTokenToDimensionDesignToken } from '../token/types/dimension/dimension-tokens-bruecke-design-token-to-dimension-design-token.ts';
import { dimensionTokensBrueckeDesignTokenToNumberDesignToken } from '../token/types/dimension/dimension-tokens-bruecke-design-token-to-number-design-token.ts';
import { stringTokensBrueckeDesignTokenToFontFamilyDesignToken } from '../token/types/string/string-tokens-bruecke-design-token-to-font-family-design-token.ts';
import { stringTokensBrueckeDesignTokenToFontWeightDesignToken } from '../token/types/string/string-tokens-bruecke-design-token-to-font-weight-design-token.ts';
import { tokensBrueckeTokensTreeToDesignTokensTree } from '../tree/tokens-bruecke-tokens-tree-to-design-tokens-tree.ts';

export function tokensBrueckeTokensGroupToDesignTokensGroup(
  { $description, $deprecated, $extensions, ...children }: TokensBrueckeDesignTokensGroup,
  ctx: TokensBrueckeToDtcgContext,
): DesignTokensGroup | TypographyDesignToken {
  if (isTypographyTokensBrueckeDesignTokensGroup(children)) {
    return {
      ...removeUndefinedProperties({
        $description,
        $deprecated,
        $extensions,
      }),
      $type: 'typography',
      $value: {
        fontFamily: stringTokensBrueckeDesignTokenToFontFamilyDesignToken(children.family, ctx)
          .$value,
        fontSize: dimensionTokensBrueckeDesignTokenToDimensionDesignToken(children.size, ctx)
          .$value,
        fontWeight: stringTokensBrueckeDesignTokenToFontWeightDesignToken(children.weight, ctx)
          .$value,
        letterSpacing: dimensionTokensBrueckeDesignTokenToDimensionDesignToken(
          children['letter-spacing'],
          ctx,
        ).$value,
        lineHeight: dimensionTokensBrueckeDesignTokenToNumberDesignToken(
          children['line-height'],
          ctx,
        ).$value,
      },
    } satisfies TypographyDesignToken;
  }
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
