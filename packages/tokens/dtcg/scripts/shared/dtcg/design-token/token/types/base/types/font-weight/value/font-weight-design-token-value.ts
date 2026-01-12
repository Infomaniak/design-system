import type { NumberFontWeightDesignTokenValue } from './types/number/number-font-weight-design-token-value.ts';
import type { PredefinedFontWeightDesignTokenValue } from './types/predefined/predefined-font-weight-design-token-value.ts';

export type FontWeightDesignTokenValue =
  | NumberFontWeightDesignTokenValue
  | PredefinedFontWeightDesignTokenValue;
