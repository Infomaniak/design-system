import type { ValueOrJsonReference } from '../../../../../../reference/types/json/value-or/value-or-json-reference.ts';
import type { ValueOrDesignTokenReference } from '../../../../../../reference/value-or/value-or-design-token-reference.ts';
import type { ColorDesignTokenAlpha } from './members/alpha/color-design-token-alpha.ts';
import type { ColorDesignTokenColorSpace } from './members/color-space/color-design-token-color-space.ts';
import type { ColorDesignTokenValueComponents } from './members/components/color-design-token-value-components.ts';
import type { ColorDesignTokenHex } from './members/hex/color-design-token-hex.ts';

/**
 * @inheritDoc https://www.designtokens.org/tr/2025.10/color/#format
 */
export interface ColorDesignTokenValue {
  readonly colorSpace: ValueOrJsonReference<ColorDesignTokenColorSpace>;
  /**
   * NOTE: Curly reference is not official
   */
  readonly components: ValueOrDesignTokenReference<ColorDesignTokenValueComponents>;
  /**
   * NOTE: Curly reference is not official
   */
  readonly alpha?: ValueOrDesignTokenReference<ColorDesignTokenAlpha>; // [0, 1]
  readonly hex?: ValueOrJsonReference<ColorDesignTokenHex>;
}
