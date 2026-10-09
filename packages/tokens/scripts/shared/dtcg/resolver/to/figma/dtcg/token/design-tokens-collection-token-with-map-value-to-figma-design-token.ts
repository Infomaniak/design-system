import { removeUndefinedProperties } from '../../../../../../../../../../scripts/helpers/misc/object/remove-undefined-properties.ts';
import type { DesignTokensCollectionTokenWithType } from '../../../../token/design-tokens-collection-token.ts';
import type {
  FigmaDesignToken,
  FigmaDesignTokenScope,
} from '../../figma/token/figma-design-token.ts';
import { valueOrCurlyReferenceToValueOrFigmaReference } from '../../reference/value-or-curly-reference-to-figma-reference.ts';
import {
  type DesignTokensCollectionTokenMode,
  getDesignTokensCollectionTokenMode,
} from './extensions/get-design-tokens-collection-token-mode.ts';
import { getDesignTokensCollectionTokenScopes } from './extensions/get-design-tokens-collection-token-scopes.ts';

export function designTokensCollectionTokenWithMapValueToFigmaDesignToken<
  GValue,
  GFigmaType extends string,
  GFigmaValue,
>(
  token: DesignTokensCollectionTokenWithType<string, GValue>,
  $type: GFigmaType,
  mapValue: (value: GValue) => GFigmaValue,
): FigmaDesignToken<GFigmaType, GFigmaValue> {
  const scopes: readonly FigmaDesignTokenScope[] | undefined =
    getDesignTokensCollectionTokenScopes(token);
  const mode: DesignTokensCollectionTokenMode<GValue> | undefined =
    getDesignTokensCollectionTokenMode<GValue>(token);

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
