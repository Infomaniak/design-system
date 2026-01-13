import StyleDictionary from 'style-dictionary';
import { transformTypes } from 'style-dictionary/enums';
import type { PlatformConfig, TransformedToken } from 'style-dictionary/types';
import { isDesignTokenReference } from '../../../../../dtcg/design-token/reference/is-design-token-reference.ts';
import { isJsonReference } from '../../../../../dtcg/design-token/reference/types/json/is-json-reference.ts';
import type { ValueOrDesignTokenReference } from '../../../../../dtcg/design-token/reference/value-or/value-or-design-token-reference.ts';
import type { DimensionDesignTokenValue } from '../../../../../dtcg/design-token/token/types/base/types/dimension/value/dimension-design-token-value.ts';
import { strokeStyleDesignTokenValueSchema } from '../../../../../dtcg/design-token/token/types/composite/types/stroke-style/value/stroke-style-design-token-value.schema.ts';
import type { StrokeStyleDesignTokenValueDashArray } from '../../../../../dtcg/design-token/token/types/composite/types/stroke-style/value/types/object/members/dash-array/stroke-style-design-token-value-dash-array.ts';
import type { ObjectStrokeStyleDesignTokenValue } from '../../../../../dtcg/design-token/token/types/composite/types/stroke-style/value/types/object/object-stroke-style-design-token-value.ts';
import { isPredefinedStrokeStyleDesignTokenValue } from '../../../../../dtcg/design-token/token/types/composite/types/stroke-style/value/types/predefined/is-predefined-stroke-style-design-token-value.ts';
import type { CssContext } from '../../css-context.ts';
import { designTokenReferenceToCssValue } from '../../references/design-token-reference-to-css-value.ts';
import { dimensionDesignTokenValueToCssValue } from '../base/dimension.ts';

export function strokeStyleDesignTokenValueDashArrayToCssValue(
  input: StrokeStyleDesignTokenValueDashArray,
  ctx: CssContext,
): string {
  return input
    .map((value: ValueOrDesignTokenReference<DimensionDesignTokenValue>): string => {
      return dimensionDesignTokenValueToCssValue(value, ctx);
    })
    .join(', ');
}

export function strokeStyleDesignTokenValueToCssValue($value: unknown, ctx: CssContext): string {
  if (isDesignTokenReference($value)) {
    return designTokenReferenceToCssValue($value, ctx);
  }

  strokeStyleDesignTokenValueSchema.parse($value);

  if (isPredefinedStrokeStyleDesignTokenValue($value)) {
    return $value;
  } else {
    const { dashArray, lineCap } = $value as ObjectStrokeStyleDesignTokenValue;

    if (isJsonReference(dashArray) || isJsonReference(lineCap)) {
      throw new Error('JSON references are not supported yet.');
    }

    return `${strokeStyleDesignTokenValueDashArrayToCssValue(dashArray, ctx)} ${lineCap}`;
  }
}

export const DTCG_STROKE_STYLE_CSS = 'dtcg/stroke-style/css';

export function registerDtcgStrokeStyleCssStyleDictionaryTransform(): void {
  StyleDictionary.registerTransform({
    name: DTCG_STROKE_STYLE_CSS,
    type: transformTypes.value,
    transitive: true,
    filter: (token: TransformedToken): boolean => {
      return token.$type === 'strokeStyle';
    },
    transform: (token: TransformedToken, ctx: PlatformConfig): string => {
      return strokeStyleDesignTokenValueToCssValue(token.original.$value, ctx);
    },
  });
}
