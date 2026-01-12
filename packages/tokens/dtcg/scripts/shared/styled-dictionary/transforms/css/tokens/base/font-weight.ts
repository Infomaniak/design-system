import StyleDictionary from 'style-dictionary';
import { transformTypes } from 'style-dictionary/enums';
import type { PlatformConfig, TransformedToken } from 'style-dictionary/types';
import { designTokenReferenceSchema } from '../../../../../dtcg/design-token/reference/design-token-reference.schema.ts';
import type { DesignTokenReference } from '../../../../../dtcg/design-token/reference/design-token-reference.ts';
import { fontWeightDesignTokenValueSchema } from '../../../../../dtcg/design-token/token/types/base/types/font-weight/value/font-weight-design-token-value.schema.ts';
import type { NumberFontWeightDesignTokenValue } from '../../../../../dtcg/design-token/token/types/base/types/font-weight/value/types/number/number-font-weight-design-token-value.ts';
import { predefinedFontWeightDesignTokenValueSchema } from '../../../../../dtcg/design-token/token/types/base/types/font-weight/value/types/predefined/predefined-font-weight-design-token-value.schema.ts';
import type { PredefinedFontWeightDesignTokenValue } from '../../../../../dtcg/design-token/token/types/base/types/font-weight/value/types/predefined/predefined-font-weight-design-token-value.ts';
import { predefinedFontWeightDesignTokenValueToNumberValue } from '../../../../../dtcg/design-token/token/types/base/types/font-weight/value/types/predefined/to/number-value/predefined-font-weight-design-token-value-to-number-value.ts';
import type { CssContext } from '../../css-context.ts';
import { designTokenReferenceToCssValue } from '../../references/design-token-reference-to-css-value.ts';

export function fontWeightDesignTokenValueToCssValue($value: unknown, ctx: CssContext): string {
  if (designTokenReferenceSchema.safeParse($value).success) {
    return designTokenReferenceToCssValue($value as DesignTokenReference, ctx);
  }

  fontWeightDesignTokenValueSchema.parse($value);

  if (predefinedFontWeightDesignTokenValueSchema.safeParse($value).success) {
    $value = predefinedFontWeightDesignTokenValueToNumberValue(
      $value as PredefinedFontWeightDesignTokenValue,
    );
  }

  return ($value as NumberFontWeightDesignTokenValue).toString(10);
}

export const DTCG_FONT_WEIGHT_CSS = 'dtcg/font-weight/css';

export function registerDtcgFontWeightCssStyleDictionaryTransform(): void {
  StyleDictionary.registerTransform({
    name: DTCG_FONT_WEIGHT_CSS,
    type: transformTypes.value,
    filter: (token: TransformedToken): boolean => {
      return token.$type === 'fontWeight';
    },
    transform: (token: TransformedToken, ctx: PlatformConfig): string => {
      return fontWeightDesignTokenValueToCssValue(token.$value, ctx);
    },
  });
}
