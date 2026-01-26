import StyleDictionary from 'style-dictionary';
import { transformTypes } from 'style-dictionary/enums';
import type { PlatformConfig, TransformedToken } from 'style-dictionary/types';
import { isDesignTokenReference } from '../../../../../dtcg/design-token/reference/is-design-token-reference.ts';
import { isJsonReference } from '../../../../../dtcg/design-token/reference/types/json/is-json-reference.ts';
import type { ValueOrJsonReference } from '../../../../../dtcg/design-token/reference/types/json/value-or/value-or-json-reference.ts';
import { fontFamilyDesignTokenValueSchema } from '../../../../../dtcg/design-token/token/types/base/types/font-family/value/font-family-design-token-value.schema.ts';
import type { StringArrayFontFamilyDesignTokenValue } from '../../../../../dtcg/design-token/token/types/base/types/font-family/value/types/string-array/string-array-font-family-design-token-value.ts';
import { isStringFontFamilyDesignTokenValue } from '../../../../../dtcg/design-token/token/types/base/types/font-family/value/types/string/is-string-font-family-design-token-value.ts';

import type { CssContext } from '../../css-context.ts';
import { designTokenReferenceToCssValue } from '../../references/design-token-reference-to-css-value.ts';

export function fontFamilyDesignTokenValueFontToCssValue(input: string): string {
  return input.includes(' ') ? JSON.stringify(input) : input;
}

export function fontFamilyDesignTokenValueToCssValue($value: unknown, ctx: CssContext): string {
  if (isDesignTokenReference($value)) {
    return designTokenReferenceToCssValue($value, ctx);
  }

  fontFamilyDesignTokenValueSchema.parse($value);

  if (isStringFontFamilyDesignTokenValue($value)) {
    return fontFamilyDesignTokenValueFontToCssValue($value);
  } else {
    return ($value as StringArrayFontFamilyDesignTokenValue)
      .map((item: ValueOrJsonReference<string>): string => {
        if (isJsonReference(item)) {
          throw new Error('JSON references are not supported yet.');
        }
        return fontFamilyDesignTokenValueFontToCssValue(item as string);
      })
      .join(', ');
  }
}

export const DTCG_FONT_FAMILY_CSS = 'dtcg/font-family/css';

export function registerDtcgFontFamilyCssStyleDictionaryTransform(): void {
  StyleDictionary.registerTransform({
    name: DTCG_FONT_FAMILY_CSS,
    type: transformTypes.value,
    filter: (token: TransformedToken): boolean => {
      return token.$type === 'fontFamily';
    },
    transform: (token: TransformedToken, ctx: PlatformConfig): string => {
      return fontFamilyDesignTokenValueToCssValue(token.$value, ctx);
    },
  });
}
