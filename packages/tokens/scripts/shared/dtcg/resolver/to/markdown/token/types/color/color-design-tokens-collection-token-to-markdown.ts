import type { ColorDesignTokensCollectionToken } from '../../../../../token/types/base/color/color-design-tokens-collection-token.ts';
import { valueOrCurlyReferenceToCssVariableReference } from '../../../../css/reference/value-or-curly-reference-to-css-variable-reference.ts';
import { colorDesignTokensCollectionTokenValueToCssValue } from '../../../../css/token/types/base/color/value/color-design-tokens-collection-token-value-to-css-value.ts';
import type { MarkdownRenderContext } from '../../markdown-render-context.ts';
import type { MarkdownTokenRow } from '../../markdown-token-row.ts';

/**
 * Supported color formats for markdown preview
 */
export type SupportedColorFormat = 'hex' | 'oklch';

/**
 * Configuration options for color markdown rendering
 */
export interface ColorMarkdownRenderOptions {
  /**
   * Color format to display in the value column
   * @default 'hex'
   */
  readonly valueFormat?: SupportedColorFormat;
}

/**
 * Renders a color design token to a markdown table row.
 *
 * Creates a visual color preview with a swatch box and displays the color value
 * in the specified format (hex or oklch).
 *
 * @param token - The color design token to render
 * @param _context - The render context (unused for simple color tokens)
 * @param _options - Rendering options
 * @returns A markdown table row with color preview
 *
 * @example
 * Input: color.red.500 with value { hex: "#f4364f", components: [0.956, 0.211, 0.309], colorSpace: "srgb" }
 * Output: {
 *   preview: '<div style="border-radius: 4px; width: 100%; height: 75px; background: #f4364f; border: 1px solid #ccc;"></div>',
 *   name: 'color.red.500',
 *   value: '#f4364f',
 *   description: ''
 * }
 */
export function colorDesignTokensCollectionTokenToMarkdown(
  token: ColorDesignTokensCollectionToken,
  _context: MarkdownRenderContext,
  _options: ColorMarkdownRenderOptions = {},
): MarkdownTokenRow {
  // Get the color value as a CSS string (always returns the best representation)
  // For markdown, we use the default format which typically returns hex for srgb colors
  const cssValue: string = valueOrCurlyReferenceToCssVariableReference(
    token.value,
    colorDesignTokensCollectionTokenValueToCssValue,
  );

  // Create the color preview HTML
  // Shows a rounded rectangle with the color as background
  const preview = /* HTML */ `
    <div
      style="
      border-radius: 4px;
      width: 100%;
      height: 75px;
      background: ${cssValue};
      border: 1px solid #e5e7eb;
    "
    ></div>
    <div
      style="
      margin-top: 4px;
      font-family: monospace;
      font-size: 12px;
      color: #6b7280;
    "
    >
      ${cssValue}
    </div>
  `;

  return {
    preview,
    name: token.name.join('.'),
    value: cssValue,
    description: token.description ?? '',
  };
}
