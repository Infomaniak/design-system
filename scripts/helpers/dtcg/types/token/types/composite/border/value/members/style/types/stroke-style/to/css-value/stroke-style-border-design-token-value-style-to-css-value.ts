import { strokeStyleDesignTokenValueToCssValue } from '../../../../../../../../stroke-style/value/to/css-value/stroke-style-design-token-value-to-css-value.ts';
import type { StrokeStyleBorderDesignTokenValueStyle } from '../../stroke-style-border-design-token-value-style.ts';

export interface StrokeStyleBorderDesignTokenValueStyleToCssValueOptions {}

export function strokeStyleBorderDesignTokenValueStyleToCssValue(
  style: StrokeStyleBorderDesignTokenValueStyle,
  _options?: StrokeStyleBorderDesignTokenValueStyleToCssValueOptions,
): string {
  return strokeStyleDesignTokenValueToCssValue(style);
}
