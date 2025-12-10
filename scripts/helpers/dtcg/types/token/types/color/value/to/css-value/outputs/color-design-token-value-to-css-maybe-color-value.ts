import type { ColorDesignTokenValue } from '../../../color-design-token-value.ts';
import { serializeColorDesignTokenValueComponents } from './serialize-color-design-token-value-components.ts';

export function colorDesignTokenValueToCssMaybeColorValue({
  colorSpace,
  components,
  alpha,
}: ColorDesignTokenValue): string {
  switch (colorSpace) {
    case 'srgb':
      return `rgb(${serializeColorDesignTokenValueComponents({ components, alpha })})`;
    case 'hsl':
    case 'hwb':
    case 'lab':
    case 'lch':
    case 'oklab':
    case 'oklch':
      return `${colorSpace}(${serializeColorDesignTokenValueComponents({ components, alpha })})`;
    case 'srgb-linear':
    case 'display-p3':
    case 'a98-rgb':
    case 'prophoto-rgb':
    case 'rec2020':
    case 'xyz-d50':
    case 'xyz-d65':
      return `color(${colorSpace} ${serializeColorDesignTokenValueComponents({ components, alpha })})`;
    default:
      throw new Error(`Unsupported color space: ${colorSpace}`);
  }
}
