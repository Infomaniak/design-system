import StyleDictionary from 'style-dictionary';
import { transformTypes } from 'style-dictionary/enums';
import type { PlatformConfig, TransformedToken } from 'style-dictionary/types';
import { isDesignTokenReference } from '../../../../../dtcg/design-token/reference/is-design-token-reference.ts';
import { numberDesignTokenValueSchema } from '../../../../../dtcg/design-token/token/types/base/types/number/value/number-design-token-value.schema.ts';
import type { CssContext } from '../../css-context.ts';
import { designTokenReferenceToCssValue } from '../../references/design-token-reference-to-css-value.ts';

export function numberDesignTokenValueToCssValue($value: unknown, ctx: CssContext): string {
  if (isDesignTokenReference($value)) {
    return designTokenReferenceToCssValue($value, ctx);
  }

  return numberDesignTokenValueSchema.parse($value).toString(10);
}

export const DTCG_NUMBER_CSS = 'dtcg/number/css';

export function registerDtcgNumberCssStyleDictionaryTransform(): void {
  StyleDictionary.registerTransform({
    name: DTCG_NUMBER_CSS,
    type: transformTypes.value,
    filter: (token: TransformedToken): boolean => {
      return token.$type === 'number';
    },
    transform: (token: TransformedToken, ctx: PlatformConfig): string => {
      return numberDesignTokenValueToCssValue(token.$value, ctx);
    },
  });
}
