import type { BorderDesignTokenValueWidth } from '../../border-design-token-value-width.ts';
import { isDimensionBorderDesignTokenValueWidth } from '../../types/dimension/is-dimension-border-design-token-value-width.ts';
import { dimensionBorderDesignTokenValueWidthToCssValue } from '../../types/dimension/to/css-value/dimension-border-design-token-value-width-to-css-value.ts';
import {
  referenceBorderDesignTokenValueWidthToCssValue,
  type ReferenceBorderDesignTokenValueWidthToCssValueOptions,
} from '../../types/reference/to/css-value/reference-border-design-token-value-width-to-css-value.ts';

export interface BorderDesignTokenValueWidthToCssValueOptions extends ReferenceBorderDesignTokenValueWidthToCssValueOptions {}

export function borderDesignTokenValueWidthToCssValue(
  width: BorderDesignTokenValueWidth,
  options?: BorderDesignTokenValueWidthToCssValueOptions,
): string {
  if (isDimensionBorderDesignTokenValueWidth(width)) {
    return dimensionBorderDesignTokenValueWidthToCssValue(width);
  } else {
    return referenceBorderDesignTokenValueWidthToCssValue(width, options);
  }
}
