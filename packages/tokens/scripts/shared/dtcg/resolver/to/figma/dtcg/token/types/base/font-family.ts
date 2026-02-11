import { isStringFontFamilyDesignTokenValue } from '../../../../../../../design-token/token/types/base/types/font-family/value/types/string/is-string-font-family-design-token-value.ts';
import type { FontFamilyDesignTokensCollectionToken } from '../../../../../../token/types/base/font-family/font-family-design-tokens-collection-token.ts';
import type { FontFamilyDesignTokensCollectionTokenValue } from '../../../../../../token/types/base/font-family/value/font-family-design-tokens-collection-token-value.ts';
import type { StringFigmaDesignToken } from '../../../../figma/token/types/string/string-figma-design-token.ts';
import { designTokensCollectionTokenWithMapValueToFigmaDesignToken } from '../../design-tokens-collection-token-with-map-value-to-figma-design-token.ts';

export function fontFamilyDesignTokensCollectionTokenToStringFigmaDesignToken(
  token: FontFamilyDesignTokensCollectionToken,
): StringFigmaDesignToken {
  return designTokensCollectionTokenWithMapValueToFigmaDesignToken(
    token,
    'string',
    fontFamilyDesignTokensCollectionTokenValueToFigmaValue,
  );
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
