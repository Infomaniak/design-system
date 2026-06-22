import { isEmptyObject } from '../../../../../../../../scripts/helpers/misc/object/is-empty-object.ts';
import { removeUndefinedProperties } from '../../../../../../../../scripts/helpers/misc/object/remove-undefined-properties.ts';
import type { ExplicitAny } from '../../../../../../../../scripts/helpers/types/explicit-any.ts';
import { isCurlyReference } from '../../../../dtcg/design-token/reference/types/curly/is-curly-reference.ts';
import type { DesignToken } from '../../../../dtcg/design-token/token/design-token.ts';
import type { GenericTokensBrueckeDesignToken } from '../../../tokens-bruecke/token/generic-tokens-bruecke-design-token.ts';
import type { TokensBrueckeDesignToken } from '../../../tokens-bruecke/token/tokens-bruecke-design-token.ts';

export function tokensBrueckeDesignTokenWithMapValueToDesignToken<
  GInputValue,
  GType extends string,
  GValue,
>(
  token: TokensBrueckeDesignToken<ExplicitAny, GInputValue>,
  $type: GType,
  mapValue: (value: GInputValue) => GValue,
): DesignToken<GType, GValue> {
  return {
    $value: isCurlyReference(token.$value) ? token.$value : mapValue(token.$value),
    $type,
    ...removeUndefinedProperties({
      $deprecated: token.$deprecated,
      $description: tokensBrueckeDesignTokenToDesignTokenDescription(token),
      $extensions: tokensBrueckeDesignTokenToDesignTokenExtensions(token, mapValue),
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
  mapValue: (value: ExplicitAny) => unknown,
): Record<string, unknown> | undefined {
  let $extensions: Record<string, unknown> = token.$extensions ?? {};

  if (token.scopes !== undefined) {
    $extensions = {
      ...$extensions,
      scopes: token.scopes,
    };
  }

  if ($extensions['mode'] !== undefined) {
    $extensions = {
      ...$extensions,
      mode: Object.fromEntries(
        Object.entries($extensions['mode'] as Record<string, unknown>).map(
          ([key, value]: [string, unknown]): [string, unknown] => {
            return [key, isCurlyReference(value) ? value : mapValue(value)];
          },
        ),
      ),
    };
  }

  return isEmptyObject($extensions) ? undefined : $extensions;
}
