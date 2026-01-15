import Color, { type Coords } from 'colorjs.io';
import { isDesignTokenReference } from '../../../../design-token/reference/is-design-token-reference.ts';
import type { ResolvedDesignToken } from '../../../../design-token/reference/resolve/token/resolved-design-token.ts';
import { designTokenReferenceToCurlyReference } from '../../../../design-token/reference/to/curly-reference/design-token-reference-to-curly-reference.ts';
import { isJsonReference } from '../../../../design-token/reference/types/json/is-json-reference.ts';
import type { ValueOrJsonReference } from '../../../../design-token/reference/types/json/value-or/value-or-json-reference.ts';
import type { ColorDesignToken } from '../../../../design-token/token/types/base/types/color/color-design-token.ts';
import type { ColorDesignTokenValue } from '../../../../design-token/token/types/base/types/color/value/color-design-token-value.ts';
import type { ColorDesignTokenValueComponents } from '../../../../design-token/token/types/base/types/color/value/members/components/color-design-token-value-components.ts';
import type { ColorDesignTokenValueComponent } from '../../../../design-token/token/types/base/types/color/value/members/components/component/color-design-token-value-component.ts';
import type { DesignTokenTreeToFigmaFormatContext } from '../../design-token-tree-to-figma-format-context.ts';

export function colorDesignTokenValueToFigmaValue(
  { colorSpace, components, alpha }: ColorDesignTokenValue,
  _ctx: DesignTokenTreeToFigmaFormatContext,
): string {
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
    collapse: false,
  });
}

export function resolvedColorDesignTokenToFigmaObject(
  { $value: $originalValue }: ColorDesignToken,
  { $value, $description }: ResolvedDesignToken<'color', ColorDesignTokenValue>,
  ctx: DesignTokenTreeToFigmaFormatContext,
): any {
  return {
    $type: 'color',
    $value: isDesignTokenReference($originalValue)
      ? designTokenReferenceToCurlyReference($originalValue)
      : colorDesignTokenValueToFigmaValue($value, ctx),
    $description,
  };
}
