import type { DesignTokenReference } from '../../../../reference/design-token-reference.ts';
import type { ColorDesignTokenValue } from '../../color/value/color-design-token-value.ts';
import type { DimensionDesignTokenValue } from '../../dimension/value/dimension-design-token-value.ts';

export type ShadowDesignTokenValue =
  | ObjectShadowDesignTokenValue
  | readonly (ObjectShadowDesignTokenValue | DesignTokenReference)[];

export interface ObjectShadowDesignTokenValue {
  readonly color: ColorDesignTokenValue | DesignTokenReference;
  readonly offsetX: DimensionDesignTokenValue | DesignTokenReference;
  readonly offsetY: DimensionDesignTokenValue | DesignTokenReference;
  readonly blur: DimensionDesignTokenValue | DesignTokenReference;
  readonly spread: DimensionDesignTokenValue | DesignTokenReference;
  readonly inset?: boolean;
}
