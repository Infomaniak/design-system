import type { DesignTokenReference } from '../../../../reference/design-token-reference.ts';
import type { DimensionDesignTokenValue } from '../../dimension/value/dimension-design-token-value.ts';
import type { FontFamilyDesignTokenValue } from '../../font-family/value/font-family-design-token-value.ts';
import type { FontWeightDesignTokenValue } from '../../font-weight/value/font-weight-design-token-value.ts';
import type { NumberDesignTokenValue } from '../../number/value/number-design-token-value.ts';

export interface TypographyDesignTokenValue {
  readonly fontFamily: FontFamilyDesignTokenValue | DesignTokenReference;
  readonly fontSize: DimensionDesignTokenValue | DesignTokenReference;
  readonly fontWeight: FontWeightDesignTokenValue | DesignTokenReference;
  readonly letterSpacing: DimensionDesignTokenValue | DesignTokenReference;
  readonly lineHeight: NumberDesignTokenValue | DesignTokenReference;
}
