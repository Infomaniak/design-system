import type { FontWeightDesignTokenValue } from '../../font-weight-design-token-value.ts';
import type { PredefinedFontWeightDesignTokenValue } from './predefined-font-weight-design-token-value.ts';

export function isPredefinedFontWeightDesignTokenValue(
  input: FontWeightDesignTokenValue,
): input is PredefinedFontWeightDesignTokenValue {
  return typeof input === 'string';
}
