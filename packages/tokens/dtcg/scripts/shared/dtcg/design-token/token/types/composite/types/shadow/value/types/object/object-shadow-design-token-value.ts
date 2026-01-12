import type { ValueOrDesignTokenReference } from '../../../../../../../../reference/value-or/value-or-design-token-reference.ts';
import type { ColorDesignTokenValue } from '../../../../../../base/types/color/value/color-design-token-value.ts';
import type { DimensionDesignTokenValue } from '../../../../../../base/types/dimension/value/dimension-design-token-value.ts';

export interface ObjectShadowDesignTokenValue {
  readonly color: ValueOrDesignTokenReference<ColorDesignTokenValue>;
  readonly offsetX: ValueOrDesignTokenReference<DimensionDesignTokenValue>;
  readonly offsetY: ValueOrDesignTokenReference<DimensionDesignTokenValue>;
  readonly blur: ValueOrDesignTokenReference<DimensionDesignTokenValue>;
  readonly spread: ValueOrDesignTokenReference<DimensionDesignTokenValue>;
  readonly inset?: boolean;
}
