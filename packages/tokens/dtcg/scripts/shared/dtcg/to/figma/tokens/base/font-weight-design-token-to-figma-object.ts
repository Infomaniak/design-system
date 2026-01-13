import { isDesignTokenReference } from '../../../../design-token/reference/is-design-token-reference.ts';
import type { FontWeightDesignToken } from '../../../../design-token/token/types/base/types/font-weight/font-weight-design-token.ts';
import { isPredefinedFontWeightDesignTokenValue } from '../../../../design-token/token/types/base/types/font-weight/value/types/predefined/is-predefined-font-weight-design-token-value.ts';
import { predefinedFontWeightDesignTokenValueToNumberValue } from '../../../../design-token/token/types/base/types/font-weight/value/types/predefined/to/number-value/predefined-font-weight-design-token-value-to-number-value.ts';
import { designTokenReferenceToFigmaReference } from '../../references/design-token-reference-to-figma-reference.ts';

export function fontWeightDesignTokenToFigmaObject({ $value }: FontWeightDesignToken): any {
  if (isDesignTokenReference($value)) {
    return {
      $type: 'number',
      $value: designTokenReferenceToFigmaReference($value),
    };
  }

  return {
    $type: 'number',
    $value: isPredefinedFontWeightDesignTokenValue($value)
      ? predefinedFontWeightDesignTokenValueToNumberValue($value)
      : $value,
  };
}
