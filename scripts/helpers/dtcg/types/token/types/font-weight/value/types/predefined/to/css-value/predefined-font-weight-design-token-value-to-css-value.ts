import { numberFontWeightDesignTokenValueToCssValue } from '../../../number/to/css-value/number-font-weight-design-token-value-to-css-value.ts';
import type { PredefinedFontWeightDesignTokenValue } from '../../predefined-font-weight-design-token-value.ts';
import { predefinedFontWeightDesignTokenValueToNumberValue } from '../number-value/predefined-font-weight-design-token-value-to-number-value.ts';

export function predefinedFontWeightDesignTokenValueToCssValue(
  value: PredefinedFontWeightDesignTokenValue,
): string {
  return numberFontWeightDesignTokenValueToCssValue(
    predefinedFontWeightDesignTokenValueToNumberValue(value),
  );
}
