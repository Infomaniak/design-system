import type { ValueOrDesignTokenReference } from '../../../../../../reference/value-or/value-or-design-token-reference.ts';
import type { DimensionDesignTokenValue } from '../../../../base/types/dimension/value/dimension-design-token-value.ts';
import type { FontFamilyDesignTokenValue } from '../../../../base/types/font-family/value/font-family-design-token-value.ts';
import type { FontWeightDesignTokenValue } from '../../../../base/types/font-weight/value/font-weight-design-token-value.ts';
import type { TypographyDesignTokenValueLineHeight } from './members/line-height/typography-design-token-value-line-height.ts';

export interface TypographyDesignTokenValue {
  readonly fontFamily: ValueOrDesignTokenReference<FontFamilyDesignTokenValue>;
  readonly fontSize: ValueOrDesignTokenReference<DimensionDesignTokenValue>;
  readonly fontWeight: ValueOrDesignTokenReference<FontWeightDesignTokenValue>;
  readonly letterSpacing: ValueOrDesignTokenReference<DimensionDesignTokenValue>;
  readonly lineHeight: ValueOrDesignTokenReference<TypographyDesignTokenValueLineHeight>;
}
