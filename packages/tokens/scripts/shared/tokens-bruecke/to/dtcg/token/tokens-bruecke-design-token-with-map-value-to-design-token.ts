import { removeUndefinedProperties } from '../../../../../../../../scripts/helpers/misc/object/remove-undefined-properties.ts';
import { isCurlyReference } from '../../../../dtcg/design-token/reference/types/curly/is-curly-reference.ts';
import type { DesignToken } from '../../../../dtcg/design-token/token/design-token.ts';
import type { GenericTokensBrueckeDesignToken } from '../../../tokens-bruecke/token/generic-tokens-bruecke-design-token.ts';
import type { TokensBrueckeDesignToken } from '../../../tokens-bruecke/token/tokens-bruecke-design-token.ts';

export function tokensBrueckeDesignTokenWithMapValueToDesignToken<
  GInputValue,
  GType extends string,
  GValue,
>(
  token: TokensBrueckeDesignToken<any, GInputValue>,
  $type: GType,
  mapValue: (value: GInputValue) => GValue,
): DesignToken<GType, GValue> {
  return {
    $value: isCurlyReference(token.$value) ? token.$value : mapValue(token.$value),
    $type,
    ...removeUndefinedProperties({
      $deprecated: token.$deprecated,
      $description: tokensBrueckeDesignTokenToDesignTokenDescription(token),
      $extensions: tokensBrueckeDesignTokenToDesignTokenExtensions(token),
    }),
  };
}

function tokensBrueckeDesignTokenToDesignTokenDescription(
  token: GenericTokensBrueckeDesignToken,
): string | undefined {
  if (token.$description === undefined || token.$description === '') {
    return undefined;
  } else {
    return token.$description;
  }
}

function tokensBrueckeDesignTokenToDesignTokenExtensions(
  token: GenericTokensBrueckeDesignToken,
): Record<string, unknown> | undefined {
  let $extensions: Record<string, unknown> | undefined =
    token.scopes === undefined
      ? token.$extensions
      : token.$extensions === undefined
        ? {
            scopes: token.scopes,
          }
        : {
            scopes: token.scopes,
            ...token.$extensions,
          };

  if ($extensions !== undefined && Reflect.has($extensions, 'mode')) {
    const mode: Record<string, unknown> = Reflect.get($extensions, 'mode')! as Record<
      string,
      unknown
    >;

    const entries: readonly (readonly [string, unknown])[] = Object.entries(mode);

    if (
      entries.length === 0 ||
      entries.every(([, value]): boolean => value === entries[0][1]) /* all identical */
    ) {
      Reflect.deleteProperty($extensions, 'mode');
    }
  }

  return $extensions === undefined || Object.keys($extensions).length === 0
    ? undefined
    : $extensions;
}
