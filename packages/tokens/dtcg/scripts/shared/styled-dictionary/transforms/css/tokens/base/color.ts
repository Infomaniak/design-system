import type { Coords } from 'colorjs.io';
import Color from 'colorjs.io';
import StyleDictionary from 'style-dictionary';
import { transformTypes } from 'style-dictionary/enums';
import type { PlatformConfig, TransformedToken } from 'style-dictionary/types';
import { isDesignTokenReference } from '../../../../../dtcg/design-token/reference/is-design-token-reference.ts';
import { isJsonReference } from '../../../../../dtcg/design-token/reference/types/json/is-json-reference.ts';
import type { ValueOrJsonReference } from '../../../../../dtcg/design-token/reference/types/json/value-or/value-or-json-reference.ts';
import { colorDesignTokenValueSchema } from '../../../../../dtcg/design-token/token/types/base/types/color/value/color-design-token-value.schema.ts';
import type { ColorDesignTokenValueComponents } from '../../../../../dtcg/design-token/token/types/base/types/color/value/members/components/color-design-token-value-components.ts';
import type { ColorDesignTokenValueComponent } from '../../../../../dtcg/design-token/token/types/base/types/color/value/members/components/component/color-design-token-value-component.ts';
import type { CssContext } from '../../css-context.ts';
import { designTokenReferenceToCssValue } from '../../references/design-token-reference-to-css-value.ts';

export function colorDesignTokenValueToCssValue($value: unknown, ctx: CssContext): string {
  if (isDesignTokenReference($value)) {
    return designTokenReferenceToCssValue($value, ctx);
  }

  const { colorSpace, components, alpha } = colorDesignTokenValueSchema.parse($value);

  if (isJsonReference(colorSpace) || isJsonReference(components) || isJsonReference(alpha)) {
    throw new Error('JSON references are not supported yet.');
  }

  return new Color({
    space: colorSpace as any,
    coords: (components as ColorDesignTokenValueComponents).map(
      (component: ValueOrJsonReference<ColorDesignTokenValueComponent>): number | null => {
        if (isJsonReference(component)) {
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
