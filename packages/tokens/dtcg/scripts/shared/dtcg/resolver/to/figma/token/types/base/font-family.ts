import { isStringFontFamilyDesignTokenValue } from '../../../../../../design-token/token/types/base/types/font-family/value/types/string/is-string-font-family-design-token-value.ts';
import type { FontFamilyDesignTokensCollectionToken } from '../../../../../token/types/base/font-family/font-family-design-tokens-collection-token.ts';
import type { FontFamilyDesignTokensCollectionTokenValue } from '../../../../../token/types/base/font-family/value/font-family-design-tokens-collection-token-value.ts';
import { valueOrCurlyReferenceToValueOrFigmaReference } from '../../../reference/value-or-curly-reference-to-figma-reference.ts';

export function fontFamilyDesignTokensCollectionTokenToFigmaObject(
  token: FontFamilyDesignTokensCollectionToken,
): unknown {
  return {
    $type: 'string',
    $value: valueOrCurlyReferenceToValueOrFigmaReference(
      token.value,
      fontFamilyDesignTokensCollectionTokenValueToFigmaValue,
    ),
    $description: token.description,
  };
}

export function fontFamilyDesignTokensCollectionTokenValueToFigmaValue(
  value: FontFamilyDesignTokensCollectionTokenValue,
): string {
  if (isStringFontFamilyDesignTokenValue(value)) {
    return value;
  } else {
    return value
      .map((item: string): string => {
        return item.includes(' ') ? JSON.stringify(item) : item;
      })
      .join(', ');
  }
}
