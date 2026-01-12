import StyleDictionary from 'style-dictionary';
import { transformTypes } from 'style-dictionary/enums';
import type { PlatformConfig, TransformedToken } from 'style-dictionary/types';
import { designTokenReferenceSchema } from '../../../../../dtcg/design-token/reference/design-token-reference.schema.ts';
import type { DesignTokenReference } from '../../../../../dtcg/design-token/reference/design-token-reference.ts';
import { typographyDesignTokenValueSchema } from '../../../../../dtcg/design-token/token/types/composite/types/typography/value/typography-design-token-value.schema.ts';
import type { CssContext } from '../../css-context.ts';
import { designTokenReferenceToCssValue } from '../../references/design-token-reference-to-css-value.ts';
import { dimensionDesignTokenValueToCssValue } from '../base/dimension.ts';
import { fontFamilyDesignTokenValueToCssValue } from '../base/font-family.ts';
import { fontWeightDesignTokenValueToCssValue } from '../base/font-weight.ts';
import { numberDesignTokenValueToCssValue } from '../base/number.ts';

export function typographyDesignTokenValueToCssValue($value: unknown, ctx: CssContext): string {
  if (designTokenReferenceSchema.safeParse($value).success) {
    return designTokenReferenceToCssValue($value as DesignTokenReference, ctx);
  }

  const { fontFamily, fontSize, fontWeight, lineHeight } =
    typographyDesignTokenValueSchema.parse($value);

  // if (
  //   jsonReferenceSchema.safeParse(fontFamily).success ||
  //   jsonReferenceSchema.safeParse(fontSize).success ||
  //   jsonReferenceSchema.safeParse(fontWeight).success ||
  //   jsonReferenceSchema.safeParse(letterSpacing).success ||
  //   jsonReferenceSchema.safeParse(lineHeight).success
  // ) {
  //   throw new Error('References are not supported yet.');
  // }

  return `${fontWeightDesignTokenValueToCssValue(fontWeight, ctx)} ${dimensionDesignTokenValueToCssValue(fontSize, ctx)}/${numberDesignTokenValueToCssValue(lineHeight, ctx)} ${fontFamilyDesignTokenValueToCssValue(fontFamily, ctx)}`;
}

export const DTCG_TYPOGRAPHY_CSS = 'dtcg/typography/css';

export function registerDtcgTypographyCssStyleDictionaryTransform(): void {
  StyleDictionary.registerTransform({
    name: DTCG_TYPOGRAPHY_CSS,
    type: transformTypes.value,
    transitive: true,
    filter: (token: TransformedToken): boolean => {
      return token.$type === 'typography';
    },
    transform: (token: TransformedToken, ctx: PlatformConfig): string => {
      return typographyDesignTokenValueToCssValue(token.original.$value, ctx);
    },
  });
}
