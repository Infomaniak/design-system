import Color, { type Coords } from 'colorjs.io';
import { isDesignTokenReference } from '../../../../design-token/reference/is-design-token-reference.ts';
import { isJsonReference } from '../../../../design-token/reference/types/json/is-json-reference.ts';
import type { ValueOrJsonReference } from '../../../../design-token/reference/types/json/value-or/value-or-json-reference.ts';
import type { ColorDesignToken } from '../../../../design-token/token/types/base/types/color/color-design-token.ts';
import type { ColorDesignTokenValueComponents } from '../../../../design-token/token/types/base/types/color/value/members/components/color-design-token-value-components.ts';
import type { ColorDesignTokenValueComponent } from '../../../../design-token/token/types/base/types/color/value/members/components/component/color-design-token-value-component.ts';
import { designTokenReferenceToFigmaReference } from '../../references/design-token-reference-to-figma-reference.ts';

export function colorDesignTokenToFigmaObject({ $value }: ColorDesignToken): any {
  if (isDesignTokenReference($value)) {
    return {
      $type: 'color',
      $value: designTokenReferenceToFigmaReference($value),
    };
  }

  const { colorSpace, components, alpha } = $value;

  if (isJsonReference(colorSpace) || isJsonReference(components) || isJsonReference(alpha)) {
    throw new Error('JSON references are not supported yet.');
  }

  return {
    $type: 'color',
    $value: new Color({
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
    }),
  };
}
