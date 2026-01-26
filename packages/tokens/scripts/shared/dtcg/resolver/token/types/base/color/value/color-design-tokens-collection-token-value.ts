import type { ColorDesignTokenColorSpace } from '../../../../../../design-token/token/types/base/types/color/value/members/color-space/color-design-token-color-space.ts';
import type { ColorDesignTokenValueComponent } from '../../../../../../design-token/token/types/base/types/color/value/members/components/component/color-design-token-value-component.ts';

export interface ColorDesignTokensCollectionTokenValue {
  readonly colorSpace: ColorDesignTokenColorSpace;
  readonly components: readonly ColorDesignTokenValueComponent[];
  readonly alpha?: number;
  readonly hex?: string;
}
