import { removeUndefinedProperties } from '../../../../../../../../scripts/helpers/misc/object/remove-undefined-properties.ts';
import type { DesignTokensGroup } from '../../../../dtcg/design-token/group/design-tokens-group.ts';
import type { TypographyDesignToken } from '../../../../dtcg/design-token/token/types/composite/types/typography/typography-design-token.ts';
import type { TokensBrueckeDesignTokensGroup } from '../../../tokens-bruecke/group/tokens-bruecke-design-tokens-group.ts';
import { isTypographyTokensBrueckeDesignTokensGroup } from '../../../tokens-bruecke/group/types/typography/is-typography-tokens-bruecke-design-tokens-group.ts';
import type { TokensBrueckeToDtcgContext } from '../context/tokens-bruecke-to-dtcg-context.ts';
import { tokensBrueckeDesignTokenWithMapValueToDesignToken } from '../token/tokens-bruecke-design-token-with-map-value-to-design-token.ts';
import { dimensionTokensBrueckeDesignTokenValueToDimensionDesignTokenValue } from '../token/types/dimension/value/dimension-tokens-bruecke-design-token-value-to-dimension-design-token-value.ts';
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
        fontFamily: tokensBrueckeDesignTokenWithMapValueToDesignToken(
          children.family,
          'fontFamily',
          (value: string): string => {
            return value;
          },
        ).$value,
        fontSize: tokensBrueckeDesignTokenWithMapValueToDesignToken(
          children.size,
          'dimension',
          dimensionTokensBrueckeDesignTokenValueToDimensionDesignTokenValue,
        ).$value,
        fontWeight: tokensBrueckeDesignTokenWithMapValueToDesignToken(
          children.weight,
          'fontWeight',
          (value: string): number => {
            return dimensionTokensBrueckeDesignTokenValueToDimensionDesignTokenValue(value)
              .value as number;
          },
        ).$value,
        letterSpacing: tokensBrueckeDesignTokenWithMapValueToDesignToken(
          children['letter-spacing'],
          'dimension',
          dimensionTokensBrueckeDesignTokenValueToDimensionDesignTokenValue,
        ).$value,
        lineHeight: tokensBrueckeDesignTokenWithMapValueToDesignToken(
          children['line-height'],
          'number',
          (value: string): number => {
            return dimensionTokensBrueckeDesignTokenValueToDimensionDesignTokenValue(value)
              .value as number;
          },
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
