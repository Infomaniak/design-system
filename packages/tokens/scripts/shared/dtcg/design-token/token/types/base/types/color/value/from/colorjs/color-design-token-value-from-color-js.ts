import Color from 'colorjs.io';
import type { ColorSpace } from 'colorjs.io/fn';
import { removeUndefinedProperties } from '../../../../../../../../../../../../../../scripts/helpers/misc/object/remove-undefined-properties.ts';
import type { ColorDesignTokenValue } from '../../color-design-token-value.ts';
import type { ColorDesignTokenColorSpace } from '../../members/color-space/color-design-token-color-space.ts';
import type { ColorDesignTokenValueComponent } from '../../members/components/component/color-design-token-value-component.ts';

/**
 * @inheritDoc https://www.designtokens.org/tr/2025.10/color/#format
 * @inheritDoc https://colorjs.io
 */
export function colorDesignTokenValueFromColorJs(color: Color): ColorDesignTokenValue {
  return {
    colorSpace: colorSpaceToColorDesignTokenColorSpace(color.space),
    components: color.coords.map((component: number | null): ColorDesignTokenValueComponent => {
      return component === null ? 'none' : component;
    }),
    ...removeUndefinedProperties({
      alpha: color.alpha === 1 ? undefined : color.alpha,
    }),
    hex: color.toString({
      format: 'hex',
    }),
  };
}

function colorSpaceToColorDesignTokenColorSpace(
  colorSpace: ColorSpace,
): ColorDesignTokenColorSpace {
  switch (colorSpace.name) {
    case 'sRGB':
      return 'srgb';
    default:
      throw new Error(`Unsupported color space: ${colorSpace.name}`);
  }
}
