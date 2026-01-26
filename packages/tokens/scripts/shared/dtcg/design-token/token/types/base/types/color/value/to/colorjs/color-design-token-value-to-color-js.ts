import Color from 'colorjs.io';
import type { Coords } from 'colorjs.io/src/color.js';
import { resolveValueOrJsonReference } from '../../../../../../../../reference/types/json/value-or/resolve/resolve-value-or-json-reference.ts';
import type { ValueOrJsonReference } from '../../../../../../../../reference/types/json/value-or/value-or-json-reference.ts';
import type { ColorDesignTokenValue } from '../../color-design-token-value.ts';
import type { ColorDesignTokenColorSpace } from '../../members/color-space/color-design-token-color-space.ts';
import type { ColorDesignTokenValueComponent } from '../../members/components/component/color-design-token-value-component.ts';

/**
 * @inheritDoc https://www.designtokens.org/tr/2025.10/color/#format
 * @inheritDoc https://colorjs.io
 */
export function colorDesignTokenValueToColorJs(
  { colorSpace, components, alpha }: ColorDesignTokenValue,
  root: unknown,
): Color {
  const space: ColorDesignTokenColorSpace = resolveValueOrJsonReference(colorSpace, root);

  const coords: Coords = resolveValueOrJsonReference(components, root)
    .map(
      (
        component: ValueOrJsonReference<ColorDesignTokenValueComponent>,
      ): ColorDesignTokenValueComponent => {
        return resolveValueOrJsonReference(component, root);
      },
    )
    .map((component: ColorDesignTokenValueComponent): number | null => {
      return component === 'none' ? null : component;
    }) as Coords;

  const resolvedAlpha: number | undefined = resolveValueOrJsonReference(alpha, root);

  return new Color({
    space,
    coords,
    alpha: resolvedAlpha,
  });
}
