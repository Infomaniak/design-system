import type { DesignTokenReference } from '../../../../../reference/design-token-reference.ts';
import type { DimensionDesignTokenValue } from '../../../dimension/value/dimension-design-token-value.ts';
import type { StrokeStyleDesignTokenValue } from '../../stroke-style/value/stroke-style-design-token-value.ts';
import type { BorderDesignTokenValueColor } from './members/color/border-design-token-value-color.ts';

export interface BorderDesignTokenValue {
  readonly color: BorderDesignTokenValueColor;
  readonly width: DimensionDesignTokenValue | DesignTokenReference;
  readonly style: StrokeStyleDesignTokenValue | DesignTokenReference;
}
