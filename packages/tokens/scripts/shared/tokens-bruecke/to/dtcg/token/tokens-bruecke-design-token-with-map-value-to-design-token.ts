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
      $deprecated: tokensBrueckeDesignTokenToDesignTokenDeprecated(token),
      $description: tokensBrueckeDesignTokenToDesignTokenDescription(token),
      $extensions: tokensBrueckeDesignTokenToDesignTokenExtensions(token, mapValue),
    }),
  };
}

function tokensBrueckeDesignTokenToDesignTokenDeprecated(
  token: GenericTokensBrueckeDesignToken,
): string | boolean | undefined {
  const $deprecated: string | boolean | undefined =
    token.$deprecated === undefined && token.$description !== undefined
      ? /^@deprecated(\s+|$)/.test(token.$description)
      : token.$deprecated;

  // NOTE: If the token is NOT deprecated, it is more readable and compact if it is not be present in the JSON.
  // NOTE: $deprecated could be a string, so we need to check if it is false explicitly.
  return $deprecated === false ? undefined : $deprecated;
}

function tokensBrueckeDesignTokenToDesignTokenDescription(
  token: GenericTokensBrueckeDesignToken,
): string | undefined {
  const $description: string =
    token.$description === undefined
      ? ''
      : token.$description.trim().replace(/^@deprecated(\s+|$)/, '');

  return $description === '' ? undefined : $description;
}

function tokensBrueckeDesignTokenToDesignTokenExtensions(
  token: GenericTokensBrueckeDesignToken,
  mapValue: (value: ExplicitAny) => unknown,
): Record<string, unknown> | undefined {
  let $extensions: Record<string, unknown> = token.$extensions ?? {};

  if (token.scopes !== undefined) {
    $extensions = {
      ...$extensions,
      scopes: token.scopes.length === 1 && token.scopes[0] === 'ALL_SCOPES' ? [] : token.scopes,
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
