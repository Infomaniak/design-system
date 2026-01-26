import StyleDictionary from 'style-dictionary';
import { transformTypes } from 'style-dictionary/enums';
import type { PlatformConfig, TransformedToken } from 'style-dictionary/types';
import { isDesignTokenReference } from '../../../../../dtcg/design-token/reference/is-design-token-reference.ts';
import { isJsonReference } from '../../../../../dtcg/design-token/reference/types/json/is-json-reference.ts';
import { durationDesignTokenValueSchema } from '../../../../../dtcg/design-token/token/types/base/types/duration/value/duration-design-token-value.schema.ts';
import type { CssContext } from '../../css-context.ts';
import { designTokenReferenceToCssValue } from '../../references/design-token-reference-to-css-value.ts';

export function durationDesignTokenValueToCssValue($value: unknown, ctx: CssContext): string {
  if (isDesignTokenReference($value)) {
    return designTokenReferenceToCssValue($value, ctx);
  }

  const { value, unit } = durationDesignTokenValueSchema.parse($value);

  if (isJsonReference(value) || isJsonReference(unit)) {
    throw new Error('JSON references are not supported yet.');
  }

  return `${value}${unit}`;
}

export const DTCG_DURATION_CSS = 'dtcg/duration/css';

export function registerDtcgDurationCssStyleDictionaryTransform(): void {
  StyleDictionary.registerTransform({
    name: DTCG_DURATION_CSS,
    type: transformTypes.value,
    filter: (token: TransformedToken): boolean => {
      return token.$type === 'duration';
    },
    transform: (token: TransformedToken, ctx: PlatformConfig): string => {
      return durationDesignTokenValueToCssValue(token.$value, ctx);
    },
  });
}
