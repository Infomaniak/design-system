import type { BorderDesignTokenValueStyle } from '../../border-design-token-value-style.ts';
import {
  referenceBorderDesignTokenValueStyleToCssValue,
  type ReferenceBorderDesignTokenValueStyleToCssValueOptions,
} from '../../types/reference/to/css-value/reference-border-design-token-value-style-to-css-value.ts';
import { isStrokeStyleBorderDesignTokenValueStyle } from '../../types/stroke-style/is-stroke-style-border-design-token-value-style.ts';
import {
  strokeStyleBorderDesignTokenValueStyleToCssValue,
  type StrokeStyleBorderDesignTokenValueStyleToCssValueOptions,
} from '../../types/stroke-style/to/css-value/stroke-style-border-design-token-value-style-to-css-value.ts';

export interface BorderDesignTokenValueStyleToCssValueOptions
  extends
    StrokeStyleBorderDesignTokenValueStyleToCssValueOptions,
    ReferenceBorderDesignTokenValueStyleToCssValueOptions {}

export function borderDesignTokenValueStyleToCssValue(
  strokeStyle: BorderDesignTokenValueStyle,
  options?: BorderDesignTokenValueStyleToCssValueOptions,
): string {
  if (isStrokeStyleBorderDesignTokenValueStyle(strokeStyle)) {
    return strokeStyleBorderDesignTokenValueStyleToCssValue(strokeStyle, options);
  } else {
    return referenceBorderDesignTokenValueStyleToCssValue(strokeStyle, options);
  }
}
