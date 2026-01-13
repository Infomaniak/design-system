import StyleDictionary from 'style-dictionary';
import { transformTypes } from 'style-dictionary/enums';
import type { PlatformConfig, TransformedToken } from 'style-dictionary/types';
import { isDesignTokenReference } from '../../../../../dtcg/design-token/reference/is-design-token-reference.ts';
import { isJsonReference } from '../../../../../dtcg/design-token/reference/types/json/is-json-reference.ts';
import { dimensionDesignTokenValueSchema } from '../../../../../dtcg/design-token/token/types/base/types/dimension/value/dimension-design-token-value.schema.ts';
import type { CssContext } from '../../css-context.ts';
import { designTokenReferenceToCssValue } from '../../references/design-token-reference-to-css-value.ts';
import { strokeStyleDesignTokenValueDashArrayToCssValue } from '../composite/stroke-style.ts';

export function dimensionDesignTokenValueToCssValue($value: unknown, ctx: CssContext): string {
  if (isDesignTokenReference($value)) {
    return designTokenReferenceToCssValue($value, ctx);
  }

  const { value, unit } = dimensionDesignTokenValueSchema.parse($value);

  if (isJsonReference(value) || isJsonReference(unit)) {
    throw new Error('JSON references are not supported yet.');
  }

  return `${value}${unit}`;
}

export const DTCG_DIMENSION_CSS = 'dtcg/dimension/css';

export function registerDtcgDimensionCssStyleDictionaryTransform(): void {
  StyleDictionary.registerTransform({
    name: DTCG_DIMENSION_CSS,
    type: transformTypes.value,
    filter: (token: TransformedToken): boolean => {
      return token.$type === 'dimension';
    },
    transform: (token: TransformedToken, ctx: PlatformConfig): string => {
      if (Array.isArray(token.$value)) {
        return strokeStyleDesignTokenValueDashArrayToCssValue(token.$value, ctx);
      }

      return dimensionDesignTokenValueToCssValue(token.$value, ctx);
    },
  });
}
