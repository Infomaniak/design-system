import type { ColorDesignTokenColorSpace } from './members/color-design-token-color-space.ts';
import type { ColorDesignTokenValueComponent } from './members/color-design-token-value-component.ts';

/**
 * @inheritDoc https://www.designtokens.org/tr/2025.10/color/#format
 */
export interface ColorDesignTokenValue {
  readonly colorSpace: ColorDesignTokenColorSpace;
  readonly components: readonly ColorDesignTokenValueComponent[];
  readonly alpha?: number; // [0, 1]
  readonly hex?: string;
}
