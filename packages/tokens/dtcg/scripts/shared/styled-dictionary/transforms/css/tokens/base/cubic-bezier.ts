import StyleDictionary from 'style-dictionary';
import { transformTypes } from 'style-dictionary/enums';
import type { PlatformConfig, TransformedToken } from 'style-dictionary/types';
import { isDesignTokenReference } from '../../../../../dtcg/design-token/reference/is-design-token-reference.ts';
import { isJsonReference } from '../../../../../dtcg/design-token/reference/types/json/is-json-reference.ts';
import type { ValueOrJsonReference } from '../../../../../dtcg/design-token/reference/types/json/value-or/value-or-json-reference.ts';
import { cubicBezierDesignTokenValueSchema } from '../../../../../dtcg/design-token/token/types/base/types/cubic-bezier/value/cubic-bezier-design-token-value.schema.ts';
import type { CubicBezierDesignTokenValue } from '../../../../../dtcg/design-token/token/types/base/types/cubic-bezier/value/cubic-bezier-design-token-value.ts';
import type { CssContext } from '../../css-context.ts';
import { designTokenReferenceToCssValue } from '../../references/design-token-reference-to-css-value.ts';

export function cubicBezierDesignTokenValueToCssValue($value: unknown, ctx: CssContext): string {
  if (isDesignTokenReference($value)) {
    return designTokenReferenceToCssValue($value, ctx);
  }

  cubicBezierDesignTokenValueSchema.parse($value);

  return `cubic-bezier(${($value as CubicBezierDesignTokenValue)
    .map((item: ValueOrJsonReference<number>): string => {
      if (isJsonReference(item)) {
        throw new Error('JSON references are not supported yet.');
      }

      return item.toString(10);
    })
    .join(', ')})`;
}

export const DTCG_CUBIC_BEZIER_CSS = 'dtcg/cubic-bezier/css';

export function registerDtcgCubicBezierCssStyleDictionaryTransform(): void {
  StyleDictionary.registerTransform({
    name: DTCG_CUBIC_BEZIER_CSS,
    type: transformTypes.value,
    filter: (token: TransformedToken): boolean => {
      return token.$type === 'cubicBezier';
    },
    transform: (token: TransformedToken, ctx: PlatformConfig): string => {
      return cubicBezierDesignTokenValueToCssValue(token.$value, ctx);
    },
  });
}
