import type { GenericDesignToken } from '../../generic-design-token.js';
import type { BaseDesignToken } from './base-design-token.js';
import { isColorDesignToken } from './types/color/is-color-design-token.js';
import { isCubicBezierDesignToken } from './types/cubic-bezier/is-cubic-bezier-design-token.js';
import { isDimensionDesignToken } from './types/dimension/is-dimension-design-token.js';
import { isDurationDesignToken } from './types/duration/is-duration-design-token.js';
import { isFontFamilyDesignToken } from './types/font-family/is-font-family-design-token.js';
import { isFontWeightDesignToken } from './types/font-weight/is-font-weight-design-token.js';
import { isNumberDesignToken } from './types/number/is-number-design-token.js';

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
