import type { ColorDesignTokenValue } from '../../../color-design-token-value.ts';
import type { ColorDesignTokenValueComponent } from '../../../members/color-design-token-value-component.ts';

export function colorDesignTokenValueToCssHexValue({
  colorSpace,
  components,
  alpha,
}: ColorDesignTokenValue): string {
  switch (colorSpace) {
    case 'srgb':
      return `#${components
        .map((component: ColorDesignTokenValueComponent): string => {
          return component === 'none' ? '00' : component.toString(16).padStart(2, '0');
        })
        .join('')}${alpha === undefined ? '' : alpha.toString(16).padStart(2, '0')})`;
    case 'hsl':
    case 'hwb':
    case 'lab':
    case 'lch':
    case 'oklab':
    case 'oklch':
      // TODO: convert to hex
      throw new Error(`TODO: Convert color space '${colorSpace}' to hex-`);
    case 'srgb-linear':
    case 'display-p3':
    case 'a98-rgb':
    case 'prophoto-rgb':
    case 'rec2020':
    case 'xyz-d50':
    case 'xyz-d65':
      throw new Error(`Cannot convert color space '${colorSpace}' to hex.`);
    default:
      throw new Error(`Unsupported color space: ${colorSpace}`);
  }
}
