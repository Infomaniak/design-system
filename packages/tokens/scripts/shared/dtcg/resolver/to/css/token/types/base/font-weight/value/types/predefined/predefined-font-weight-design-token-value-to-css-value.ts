import type { PredefinedFontWeightDesignTokenValue } from '../../../../../../../../../../design-token/token/types/base/types/font-weight/value/types/predefined/predefined-font-weight-design-token-value.ts';
import { predefinedFontWeightDesignTokenValueToNumberValue } from '../../../../../../../../../../design-token/token/types/base/types/font-weight/value/types/predefined/to/number-value/predefined-font-weight-design-token-value-to-number-value.ts';
import { numberFontWeightDesignTokenValueToCssValue } from '../number/ number-font-weight-design-token-value-to-css-value.ts';

export function predefinedFontWeightDesignTokenValueToCssValue(
  value: PredefinedFontWeightDesignTokenValue,
): string {
  return numberFontWeightDesignTokenValueToCssValue(
    predefinedFontWeightDesignTokenValueToNumberValue(value),
  );
}
