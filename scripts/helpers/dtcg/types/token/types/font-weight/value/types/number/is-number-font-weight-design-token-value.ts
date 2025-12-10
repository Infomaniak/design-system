import type { FontWeightDesignTokenValue } from '../../font-weight-design-token-value.ts';
import type { NumberFontWeightDesignTokenValue } from './number-font-weight-design-token-value.ts';

export function isNumberFontWeightDesignTokenValue(
  input: FontWeightDesignTokenValue,
): input is NumberFontWeightDesignTokenValue {
  return typeof input === 'number';
}
