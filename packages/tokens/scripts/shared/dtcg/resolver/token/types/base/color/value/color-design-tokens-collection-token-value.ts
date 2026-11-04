import type { ValueOrCurlyReference } from '../../../../../../design-token/reference/types/curly/value-or/value-or-curly-reference.ts';
import type { ColorDesignTokenColorSpace } from '../../../../../../design-token/token/types/base/types/color/value/members/color-space/color-design-token-color-space.ts';
import type { ColorDesignTokenValueComponent } from '../../../../../../design-token/token/types/base/types/color/value/members/components/component/color-design-token-value-component.ts';

export interface ColorDesignTokensCollectionTokenValue {
  readonly colorSpace: ColorDesignTokenColorSpace;
  /**
   * NOTE: Curly reference is not official
   */
  readonly components: ValueOrCurlyReference<readonly ColorDesignTokenValueComponent[]>;
  /**
   * NOTE: Curly reference is not official
   */
  readonly alpha?: ValueOrCurlyReference<number>;
  readonly hex?: string;
}
