import Color, { type Coords } from 'colorjs.io';
import type { ExplicitAny } from '../../../../../../../../../../../../scripts/helpers/types/explicit-any.ts';
import { isCurlyReference } from '../../../../../../../design-token/reference/types/curly/is-curly-reference.ts';
import type { ColorDesignTokenValueComponent } from '../../../../../../../design-token/token/types/base/types/color/value/members/components/component/color-design-token-value-component.ts';
import type { ColorDesignTokensCollectionTokenValue } from '../color-design-tokens-collection-token-value.ts';

export function colorDesignTokensCollectionTokenValueToColorInstance(
  value: ColorDesignTokensCollectionTokenValue,
): Color {
  /**
   * NOTE: Curly reference is not official
   */
  if (isCurlyReference(value.components) || isCurlyReference(value.alpha)) {
    throw new Error(
      'Cannot convert a ColorDesignTokensCollectionTokenValue with curly references into a Color object.',
    );
  }

  return new Color({
    space: value.colorSpace as ExplicitAny,
    coords: value.components.map((component: ColorDesignTokenValueComponent): number | null => {
      return component === 'none' ? null : (component as number);
    }) as Coords,
    alpha: value.alpha,
  });
}
