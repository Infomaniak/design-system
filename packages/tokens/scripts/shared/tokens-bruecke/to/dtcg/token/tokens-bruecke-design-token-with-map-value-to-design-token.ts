import { removeUndefinedProperties } from '../../../../../../../../scripts/helpers/misc/object/remove-undefined-properties.ts';
import { isCurlyReference } from '../../../../dtcg/design-token/reference/types/curly/is-curly-reference.ts';
import type { DesignToken } from '../../../../dtcg/design-token/token/design-token.ts';
import type { TokensBrueckeDesignToken } from '../../../tokens-bruecke/token/tokens-bruecke-design-token.ts';

export function tokensBrueckeDesignTokenWithMapValueToDesignToken<
  GInputValue,
  GType extends string,
  GValue,
>(
  { $value, $description, $extensions, $deprecated }: TokensBrueckeDesignToken<any, GInputValue>,
  $type: GType,
  mapValue: (value: GInputValue) => GValue,
): DesignToken<GType, GValue> {
  return {
    $value: isCurlyReference($value) ? $value : mapValue($value),
    $type,
    ...removeUndefinedProperties({
      $deprecated,
      $description: tokensBrueckeDesignTokenDescriptionToDesignTokenDescription($description),
      $extensions: tokensBrueckeDesignTokenExtensionsToDesignTokenExtensions($extensions),
    }),
  };
}

function tokensBrueckeDesignTokenDescriptionToDesignTokenDescription(
  input: string | undefined,
): string | undefined {
  if (input === undefined || input === '') {
    return undefined;
  } else {
    return input;
  }
}

function tokensBrueckeDesignTokenExtensionsToDesignTokenExtensions(
  input: Record<string, unknown> | undefined,
): Record<string, unknown> | undefined {
  if (input === undefined) {
    return undefined;
  } else {
    const entries: [string, unknown][] = Object.entries(input);

    if (entries.length === 0 || (entries.length === 1 && entries[0][0] === 'mode')) {
      return undefined;
    } else {
      return input;
    }
  }
}
