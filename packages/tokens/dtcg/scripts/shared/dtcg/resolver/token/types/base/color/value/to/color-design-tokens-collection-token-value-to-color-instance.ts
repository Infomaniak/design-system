import Color, { type Coords } from 'colorjs.io';
import type { ColorDesignTokenValueComponent } from '../../../../../../../design-token/token/types/base/types/color/value/members/components/component/color-design-token-value-component.ts';
import type { ColorDesignTokensCollectionTokenValue } from '../color-design-tokens-collection-token-value.ts';

export function colorDesignTokensCollectionTokenValueToColorInstance(
  value: ColorDesignTokensCollectionTokenValue,
): Color {
  return new Color({
    space: value.colorSpace as any,
    coords: value.components.map((component: ColorDesignTokenValueComponent): number | null => {
      return component === 'none' ? null : (component as number);
    }) as Coords,
    alpha: value.alpha,
  });
}
