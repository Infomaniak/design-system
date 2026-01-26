import type { ValueOrDesignTokenReference } from '../../../../../../reference/value-or/value-or-design-token-reference.ts';
import type { ColorDesignTokenValue } from '../../../../base/types/color/value/color-design-token-value.ts';
import type { DimensionDesignTokenValue } from '../../../../base/types/dimension/value/dimension-design-token-value.ts';
import type { StrokeStyleDesignTokenValue } from '../../stroke-style/value/stroke-style-design-token-value.ts';

export interface BorderDesignTokenValue {
  readonly color: ValueOrDesignTokenReference<ColorDesignTokenValue>;
  readonly width: ValueOrDesignTokenReference<DimensionDesignTokenValue>;
  readonly style: ValueOrDesignTokenReference<StrokeStyleDesignTokenValue>;
}
