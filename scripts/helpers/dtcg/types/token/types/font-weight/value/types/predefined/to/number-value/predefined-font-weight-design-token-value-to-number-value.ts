import type { PredefinedFontWeightDesignTokenValue } from '../../predefined-font-weight-design-token-value.ts';

export function predefinedFontWeightDesignTokenValueToNumberValue(
  value: PredefinedFontWeightDesignTokenValue,
): number {
  switch (value) {
    case 'thin':
    case 'hairline':
      return 100;
    case 'extra-light':
    case 'ultra-light':
      return 200;
    case 'light':
      return 300;
    case 'normal':
    case 'regular':
    case 'book':
      return 400;
    case 'medium':
      return 500;
    case 'semi-bold':
    case 'demi-bold':
      return 600;
    case 'bold':
      return 700;
    case 'extra-bold':
    case 'ultra-bold':
      return 800;
    case 'black':
    case 'heavy':
      return 900;
    case 'extra-black':
    case 'ultra-black':
      return 950;
    default:
      throw new Error(`Unexpected font weight value: ${value}`);
  }
}
