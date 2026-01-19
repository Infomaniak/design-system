import type { ColorDesignTokensCollectionToken } from '../../../../../token/types/base/color/color-design-tokens-collection-token.ts';
import type { ColorDesignTokensCollectionTokenValue } from '../../../../../token/types/base/color/value/color-design-tokens-collection-token-value.ts';
import { colorDesignTokensCollectionTokenValueToColorInstance } from '../../../../../token/types/base/color/value/to/color-design-tokens-collection-token-value-to-color-instance.ts';
import { valueOrCurlyReferenceToValueOrFigmaReference } from '../../../reference/value-or-curly-reference-to-figma-reference.ts';

export function colorDesignTokensCollectionTokenToFigmaObject(
  token: ColorDesignTokensCollectionToken,
): unknown {
  return {
    $type: 'color',
    $value: valueOrCurlyReferenceToValueOrFigmaReference(
      token.value,
      colorDesignTokensCollectionTokenValueToFigmaValue,
    ),
    $description: token.description,
  };
}

export function colorDesignTokensCollectionTokenValueToFigmaValue(
  value: ColorDesignTokensCollectionTokenValue,
): string {
  return colorDesignTokensCollectionTokenValueToColorInstance(value).toString({
    format: 'hex',
    collapse: false,
  });
}
