import type { ValueOrJsonReference } from '../../../../../../reference/types/json/value-or/value-or-json-reference.js';
import type { ColorDesignTokenColorSpace } from './members/color-space/color-design-token-color-space.ts';
import type { ColorDesignTokenValueComponents } from './members/components/color-design-token-value-components.ts';

/**
 * @inheritDoc https://www.designtokens.org/tr/2025.10/color/#format
 */
export interface ColorDesignTokenValue {
  readonly colorSpace: ValueOrJsonReference<ColorDesignTokenColorSpace>;
  readonly components: ValueOrJsonReference<ColorDesignTokenValueComponents>;
  readonly alpha?: ValueOrJsonReference<number>; // [0, 1]
  readonly hex?: ValueOrJsonReference<string>;
}
