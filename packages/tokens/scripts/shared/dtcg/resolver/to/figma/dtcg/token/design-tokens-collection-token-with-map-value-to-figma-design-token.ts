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
  return {
    $type,
    $value: valueOrCurlyReferenceToValueOrFigmaReference<GValue, GFigmaValue>(
      token.value,
      mapValue,
    ),
    ...removeUndefinedProperties({
      $description: token.description,
      scopes: token.extensions?.['scopes'] as readonly FigmaDesignTokenScope[] | undefined,
    }),
  };
}
