import type { Coords } from 'colorjs.io';
import Color from 'colorjs.io';
import StyleDictionary from 'style-dictionary';
import { transformTypes } from 'style-dictionary/enums';
import type { PlatformConfig, TransformedToken } from 'style-dictionary/types';
import { designTokenReferenceSchema } from '../../../../../dtcg/design-token/reference/design-token-reference.schema.ts';
import type { DesignTokenReference } from '../../../../../dtcg/design-token/reference/design-token-reference.ts';
import { jsonReferenceSchema } from '../../../../../dtcg/design-token/reference/types/json/json-reference.schema.ts';
import type { ValueOrJsonReference } from '../../../../../dtcg/design-token/reference/types/json/value-or/value-or-json-reference.ts';
import { colorDesignTokenValueSchema } from '../../../../../dtcg/design-token/token/types/base/types/color/value/color-design-token-value.schema.ts';
import type { ColorDesignTokenValueComponents } from '../../../../../dtcg/design-token/token/types/base/types/color/value/members/components/color-design-token-value-components.ts';
import type { ColorDesignTokenValueComponent } from '../../../../../dtcg/design-token/token/types/base/types/color/value/members/components/component/color-design-token-value-component.ts';
import type { CssContext } from '../../css-context.ts';
import { designTokenReferenceToCssValue } from '../../references/design-token-reference-to-css-value.ts';

export function colorDesignTokenValueToCssValue($value: unknown, ctx: CssContext): string {
  if (designTokenReferenceSchema.safeParse($value).success) {
    return designTokenReferenceToCssValue($value as DesignTokenReference, ctx);
  }

  const { colorSpace, components, alpha } = colorDesignTokenValueSchema.parse($value);

  if (
    jsonReferenceSchema.safeParse(colorSpace).success ||
    jsonReferenceSchema.safeParse(components).success ||
    jsonReferenceSchema.safeParse(alpha).success
  ) {
    throw new Error('JSON references are not supported yet.');
  }

  return new Color({
    space: colorSpace as any,
    coords: (components as ColorDesignTokenValueComponents).map(
      (component: ValueOrJsonReference<ColorDesignTokenValueComponent>): number | null => {
        if (jsonReferenceSchema.safeParse(component).success) {
          throw new Error('JSON references are not supported yet.');
        }
        return component === 'none' ? null : (component as number);
      },
    ) as Coords,
    alpha: alpha as number | undefined,
  }).toString({
    format: 'hex',
  });
}

export const DTCG_COLOR_CSS = 'dtcg/color/css';

export function registerDtcgColorCssStyleDictionaryTransform(): void {
  StyleDictionary.registerTransform({
    name: DTCG_COLOR_CSS,
    type: transformTypes.value,
    filter: (token: TransformedToken): boolean => {
      return token.$type === 'color';
    },
    transform: (token: TransformedToken, ctx: PlatformConfig): string => {
      return colorDesignTokenValueToCssValue(token.$value, ctx);
    },
  });
}
