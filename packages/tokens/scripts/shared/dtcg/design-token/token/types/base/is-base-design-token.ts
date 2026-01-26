import type { GenericDesignToken } from '../../generic-design-token.ts';
import type { BaseDesignToken } from './base-design-token.ts';
import { isColorDesignToken } from './types/color/is-color-design-token.ts';
import { isCubicBezierDesignToken } from './types/cubic-bezier/is-cubic-bezier-design-token.ts';
import { isDimensionDesignToken } from './types/dimension/is-dimension-design-token.ts';
import { isDurationDesignToken } from './types/duration/is-duration-design-token.ts';
import { isFontFamilyDesignToken } from './types/font-family/is-font-family-design-token.ts';
import { isFontWeightDesignToken } from './types/font-weight/is-font-weight-design-token.ts';
import { isNumberDesignToken } from './types/number/is-number-design-token.ts';

export function isBaseDesignToken(input: GenericDesignToken): input is BaseDesignToken {
  return (
    isColorDesignToken(input) ||
    isCubicBezierDesignToken(input) ||
    isDimensionDesignToken(input) ||
    isDurationDesignToken(input) ||
    isFontFamilyDesignToken(input) ||
    isFontWeightDesignToken(input) ||
    isNumberDesignToken(input)
  );
}
