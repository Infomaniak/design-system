import { isObject } from '../../../../../../../../../../scripts/helpers/misc/object/is-object.ts';
import { removeUndefinedProperties } from '../../../../../../../../../../scripts/helpers/misc/object/remove-undefined-properties.ts';
import type { DesignTokensCollectionTokenWithType } from '../../../../token/design-tokens-collection-token.ts';
import type {
  FigmaDesignToken,
  FigmaDesignTokenScope,
} from '../../figma/token/figma-design-token.ts';
import { valueOrCurlyReferenceToValueOrFigmaReference } from '../../reference/value-or-curly-reference-to-figma-reference.ts';

export function designTokensCollectionTokenWithMapValueToFigmaDesignToken<
  GValue,
  GFigmaType extends string,
  GFigmaValue,
>(
  token: DesignTokensCollectionTokenWithType<string, GValue>,
  $type: GFigmaType,
  mapValue: (value: GValue) => GFigmaValue,
): FigmaDesignToken<GFigmaType, GFigmaValue> {
  let scopes: readonly FigmaDesignTokenScope[] | undefined = undefined;
  let mode: Record<string, string> | undefined = undefined;

  if (token.extensions !== undefined) {
    if (
      Reflect.has(token.extensions, 'scopes') &&
      Array.isArray(Reflect.get(token.extensions, 'scopes'))
    ) {
      scopes = Reflect.get(token.extensions, 'scopes') as readonly FigmaDesignTokenScope[];
    }
    if (Reflect.has(token.extensions, 'mode') && isObject(Reflect.get(token.extensions, 'mode'))) {
      mode = Reflect.get(token.extensions, 'mode') as Record<string, string>;
    }
  }

  let $extensions: Record<string, unknown> | undefined = undefined;

  if (mode !== undefined) {
    $extensions = {
      mode,
    };
  }

  return {
    $type,
    $value: valueOrCurlyReferenceToValueOrFigmaReference<GValue, GFigmaValue>(
      token.value,
      mapValue,
    ),
    ...removeUndefinedProperties({
      $description: token.description,
      scopes,
      $extensions,
    }),
  };
}
