import type { NumberFontWeightDesignTokenValue } from '../../../../../../../../../../design-token/token/types/base/types/font-weight/value/types/number/number-font-weight-design-token-value.ts';

export function numberFontWeightDesignTokenValueToSwiftValue(
  value: NumberFontWeightDesignTokenValue,
): string {
  // NOTE: in case we don't support native font-weight
  // return value.toString(10);

  if (!Reflect.has(FONT_WEIGHT_MAP, value)) {
    throw new Error(`Font weight ${value} is not supported`);
  }

  return FONT_WEIGHT_MAP[value];
}

const FONT_WEIGHT_MAP: Record<number, string> = {
  100: '.ultraLight',
  200: '.thin',
  300: '.light',
  400: '.regular',
  500: '.medium',
  600: '.semibold',
  700: '.bold',
  800: '.heavy',
  900: '.black',
};
