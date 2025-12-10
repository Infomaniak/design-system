import type { DesignTokenReference } from '../../../../../../../../reference/design-token-reference.ts';
import type { ColorDesignTokenValue } from '../../../../../../color/value/color-design-token-value.ts';
import type { NumberDesignTokenValue } from '../../../../../../number/value/number-design-token-value.ts';

export interface ObjectGradientDesignTokenValue {
  readonly color: ColorDesignTokenValue | DesignTokenReference;
  readonly position: NumberDesignTokenValue | DesignTokenReference; // [0, 1]
}
