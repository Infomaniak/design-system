import type { ValueOrDesignTokenReference } from '../../../../../../../../reference/value-or/value-or-design-token-reference.ts';
import type { ColorDesignTokenValue } from '../../../../../../base/types/color/value/color-design-token-value.ts';
import type { NumberDesignTokenValue } from '../../../../../../base/types/number/value/number-design-token-value.ts';

export interface ObjectGradientDesignTokenValue {
  readonly color: ValueOrDesignTokenReference<ColorDesignTokenValue>;
  readonly position: ValueOrDesignTokenReference<NumberDesignTokenValue>; // [0, 1]
}
