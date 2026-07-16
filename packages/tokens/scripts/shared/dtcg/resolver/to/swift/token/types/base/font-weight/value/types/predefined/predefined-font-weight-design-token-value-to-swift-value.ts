import type { PredefinedFontWeightDesignTokenValue } from '../../../../../../../../../../design-token/token/types/base/types/font-weight/value/types/predefined/predefined-font-weight-design-token-value.ts';
import { predefinedFontWeightDesignTokenValueToNumberValue } from '../../../../../../../../../../design-token/token/types/base/types/font-weight/value/types/predefined/to/number-value/predefined-font-weight-design-token-value-to-number-value.ts';
import { numberFontWeightDesignTokenValueToSwiftValue } from '../number/number-font-weight-design-token-value-to-swift-value.ts';

export function predefinedFontWeightDesignTokenValueToSwiftValue(
  value: PredefinedFontWeightDesignTokenValue,
): string {
  return numberFontWeightDesignTokenValueToSwiftValue(
    predefinedFontWeightDesignTokenValueToNumberValue(value),
  );
}
