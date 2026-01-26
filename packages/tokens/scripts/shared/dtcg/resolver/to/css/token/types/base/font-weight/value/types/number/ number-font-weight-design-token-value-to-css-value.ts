import type { NumberFontWeightDesignTokenValue } from '../../../../../../../../../../design-token/token/types/base/types/font-weight/value/types/number/number-font-weight-design-token-value.ts';

export function numberFontWeightDesignTokenValueToCssValue(
  value: NumberFontWeightDesignTokenValue,
): string {
  return value.toString(10);
}
