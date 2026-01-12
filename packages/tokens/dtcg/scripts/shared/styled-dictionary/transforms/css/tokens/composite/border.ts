import StyleDictionary from 'style-dictionary';
import { transformTypes } from 'style-dictionary/enums';
import type { PlatformConfig, TransformedToken } from 'style-dictionary/types';
import { designTokenReferenceSchema } from '../../../../../dtcg/design-token/reference/design-token-reference.schema.ts';
import type { DesignTokenReference } from '../../../../../dtcg/design-token/reference/design-token-reference.ts';
import { isJsonReference } from '../../../../../dtcg/design-token/reference/types/json/is-json-reference.ts';
import { borderDesignTokenValueSchema } from '../../../../../dtcg/design-token/token/types/composite/types/border/value/border-design-token-value.schema.ts';
import type { CssContext } from '../../css-context.ts';
import { designTokenReferenceToCssValue } from '../../references/design-token-reference-to-css-value.ts';
import { colorDesignTokenValueToCssValue } from '../base/color.ts';
import { dimensionDesignTokenValueToCssValue } from '../base/dimension.ts';
import { strokeStyleDesignTokenValueToCssValue } from './stroke-style.ts';

export function borderDesignTokenValueToCssValue($value: unknown, ctx: CssContext): string {
  if (designTokenReferenceSchema.safeParse($value).success) {
    return designTokenReferenceToCssValue($value as DesignTokenReference, ctx);
  }

  const { color, width, style } = borderDesignTokenValueSchema.parse($value);

  if (isJsonReference(color) || isJsonReference(width) || isJsonReference(style)) {
    throw new Error('JSON references are not supported yet.');
  }

  return `${dimensionDesignTokenValueToCssValue(width, ctx)} ${strokeStyleDesignTokenValueToCssValue(style, ctx)} ${colorDesignTokenValueToCssValue(color, ctx)}`;
}

export const DTCG_BORDER_CSS = 'dtcg/border/css';

export function registerDtcgBorderCssStyleDictionaryTransform(): void {
  StyleDictionary.registerTransform({
    name: DTCG_BORDER_CSS,
    type: transformTypes.value,
    transitive: true,
    filter: (token: TransformedToken): boolean => {
      return token.$type === 'border';
    },
    transform: (token: TransformedToken, ctx: PlatformConfig): string => {
      return borderDesignTokenValueToCssValue(token.original.$value, ctx);
    },
  });
}
