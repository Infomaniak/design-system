import { isObject } from '../../../../../../../../scripts/helpers/misc/object/is-object.ts';
import { removeUndefinedProperties } from '../../../../../../../../scripts/helpers/misc/object/remove-undefined-properties.ts';
import type { ExplicitAny } from '../../../../../../../../scripts/helpers/types/explicit-any.ts';
import type { DesignTokensGroup } from '../../../../dtcg/design-token/group/design-tokens-group.ts';
import type { CurlyReference } from '../../../../dtcg/design-token/reference/types/curly/curly-reference.ts';
import { isCurlyReference } from '../../../../dtcg/design-token/reference/types/curly/is-curly-reference.ts';
import type { ValueOrCurlyReference } from '../../../../dtcg/design-token/reference/types/curly/value-or/value-or-curly-reference.ts';
import type { GenericDesignToken } from '../../../../dtcg/design-token/token/generic-design-token.ts';
import { compactCompositeTokenValue } from '../../../../dtcg/design-token/token/types/composite/operations/compact-composite-token-value.ts';
import type { TypographyDesignToken } from '../../../../dtcg/design-token/token/types/composite/types/typography/typography-design-token.ts';
import type { TokensBrueckeDesignTokensGroup } from '../../../tokens-bruecke/group/tokens-bruecke-design-tokens-group.ts';
import { isTypographyTokensBrueckeDesignTokensGroup } from '../../../tokens-bruecke/group/types/typography/is-typography-tokens-bruecke-design-tokens-group.ts';
import type { TokensBrueckeToDtcgContext } from '../context/tokens-bruecke-to-dtcg-context.ts';
import { dimensionTokensBrueckeDesignTokenToDimensionDesignToken } from '../token/types/dimension/dimension-tokens-bruecke-design-token-to-dimension-design-token.ts';
import { dimensionTokensBrueckeDesignTokenToNumberDesignToken } from '../token/types/dimension/dimension-tokens-bruecke-design-token-to-number-design-token.ts';
import { stringTokensBrueckeDesignTokenToFontFamilyDesignToken } from '../token/types/string/string-tokens-bruecke-design-token-to-font-family-design-token.ts';
import { tokensBrueckeTokensTreeToDesignTokensTree } from '../tree/tokens-bruecke-tokens-tree-to-design-tokens-tree.ts';

export function tokensBrueckeTokensGroupToDesignTokensGroup(
  { $description, $deprecated, $extensions, ...children }: TokensBrueckeDesignTokensGroup,
  ctx: TokensBrueckeToDtcgContext,
): DesignTokensGroup | TypographyDesignToken {
  if (isTypographyTokensBrueckeDesignTokensGroup(children)) {
    return compactFigmaCompositeTokenValue<TypographyDesignToken>({
      fontFamily: stringTokensBrueckeDesignTokenToFontFamilyDesignToken(children.fontFamily, ctx),
      fontSize: dimensionTokensBrueckeDesignTokenToDimensionDesignToken(children.fontSize, ctx),
      fontWeight: dimensionTokensBrueckeDesignTokenToNumberDesignToken(children.fontWeight, ctx),
      letterSpacing: dimensionTokensBrueckeDesignTokenToDimensionDesignToken(
        children.letterSpacing,
        ctx,
      ),
      /* NOTE: UNOFFICIAL CONVERSION TO DIMENSION */
      lineHeight: dimensionTokensBrueckeDesignTokenToDimensionDesignToken(children.lineHeight, ctx),
    });

    // return isCurlyReference($value)
    //   ? {
    //       $value,
    //       ...removeUndefinedProperties({
    //         $description,
    //         $deprecated,
    //         $extensions,
    //       }),
    //     }
    //   : ({
    //       $type: 'typography',
    //       $value,
    //       ...removeUndefinedProperties({
    //         $description,
    //         $deprecated,
    //         $extensions,
    //       }),
    //     } satisfies TypographyDesignToken);
  }

  return {
    ...removeUndefinedProperties({
      $description,
      $deprecated,
      $extensions,
    }),
    ...Object.fromEntries(
      Object.entries(children).map(([key, value]: [string, ExplicitAny]): [string, ExplicitAny] => {
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

/*---*/

export function compactFigmaCompositeTokenValue<GToken extends GenericDesignToken>(
  tokens: Record<string, GenericDesignToken>,
): GToken {
  const entries: [string, GenericDesignToken][] = Object.entries(tokens);

  if (entries.length === 0) {
    throw new Error('No tokens found');
  }

  const firstToken: GenericDesignToken = entries[0][1];

  const $value: Record<string, ValueOrCurlyReference<unknown>> | CurlyReference =
    compactCompositeTokenValue(
      Object.fromEntries(
        Object.entries(tokens).map(
          ([key, token]: [string, GenericDesignToken]): [string, unknown] => {
            return [key, token.$value];
          },
        ),
      ),
    );

  const modes: Map<
    string /* mode */,
    Record<string, ValueOrCurlyReference<unknown>> /* value */
  > = new Map(
    isObject(firstToken.$extensions) &&
      Reflect.has(firstToken.$extensions, 'mode') &&
      isObject(Reflect.get(firstToken.$extensions, 'mode'))
      ? Object.keys(Reflect.get(firstToken.$extensions, 'mode') as object).map(
          (mode: string): [string, Record<string, ValueOrCurlyReference<unknown>>] => {
            return [
              mode,
              Object.fromEntries(
                entries.map(
                  ([key, token]: [string, GenericDesignToken]): [
                    string,
                    ValueOrCurlyReference<unknown>,
                  ] => {
                    if (
                      isObject(token.$extensions) &&
                      Reflect.has(token.$extensions, 'mode') &&
                      isObject(Reflect.get(token.$extensions, 'mode')) &&
                      Reflect.has(Reflect.get(token.$extensions, 'mode') as object, mode)
                    ) {
                      return [
                        key,
                        Reflect.get(Reflect.get(token.$extensions, 'mode') as object, mode),
                      ];
                    } else {
                      throw new Error(`Token does not have mode ${JSON.stringify(mode)}.`);
                    }
                  },
                ),
              ),
            ];
          },
        )
      : [],
  );

  let mode: Record<string, ValueOrCurlyReference<unknown>> | undefined = undefined;

  if (modes.size > 0) {
    mode = Object.fromEntries(
      modes
        .entries()
        .map(
          ([mode, value]: [string, Record<string, ValueOrCurlyReference<unknown>>]): [
            string,
            ValueOrCurlyReference<unknown>,
          ] => {
            return [mode, compactCompositeTokenValue(value)];
          },
        ),
    );
  }

  let $extensions: Record<string, unknown> | undefined = firstToken.$extensions;

  if (mode !== undefined) {
    $extensions = {
      ...$extensions,
      mode,
    };
  }
  return {
    ...removeUndefinedProperties({
      $type: isCurlyReference($value) ? undefined : 'typography',
    }),
    $value,
    ...removeUndefinedProperties({
      $description: firstToken.$description,
      $deprecated: firstToken.$deprecated,
      $extensions,
    }),
  } as GToken;
}
