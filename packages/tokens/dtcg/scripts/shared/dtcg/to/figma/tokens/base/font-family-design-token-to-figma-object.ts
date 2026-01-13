import { isDesignTokenReference } from '../../../../design-token/reference/is-design-token-reference.ts';
import { isJsonReference } from '../../../../design-token/reference/types/json/is-json-reference.ts';
import type { ValueOrDesignTokenReference } from '../../../../design-token/reference/value-or/value-or-design-token-reference.ts';
import type { FontFamilyDesignToken } from '../../../../design-token/token/types/base/types/font-family/font-family-design-token.ts';
import { isStringFontFamilyDesignTokenValue } from '../../../../design-token/token/types/base/types/font-family/value/types/string/is-string-font-family-design-token-value.ts';
import { designTokenReferenceToFigmaReference } from '../../references/design-token-reference-to-figma-reference.ts';

export function fontFamilyDesignTokenToFigmaObject({ $value }: FontFamilyDesignToken): any {
  if (isDesignTokenReference($value)) {
    return {
      $type: 'string',
      $value: designTokenReferenceToFigmaReference($value),
    };
  }

  if (isStringFontFamilyDesignTokenValue($value)) {
    return {
      $type: 'string',
      $value,
    };
  } else {
    return {
      $type: 'string',
      $value: $value
        .map((item: ValueOrDesignTokenReference<string>): string => {
          if (isJsonReference(item)) {
            throw new Error('JSON references are not supported yet.');
          }
          return item.includes(' ') ? JSON.stringify(item) : item;
        })
        .join(', '),
    };
    // throw new Error('Unsupported font family design token value: string array.');
  }
}
