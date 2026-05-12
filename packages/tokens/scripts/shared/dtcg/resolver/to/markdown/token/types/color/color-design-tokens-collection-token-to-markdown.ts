import { CSS_VARIABLE_PREFIX } from '../../../../../../../../scripts/build-tokens/src/constants/css-variable-prefix.ts';
import type { ColorDesignTokensCollectionToken } from '../../../../../token/types/base/color/color-design-tokens-collection-token.ts';
import { createCssVariableNameGenerator } from '../../../../css/token/name/create-css-variable-name-generator.ts';
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
 *   cssVariable: '--esds-color-red-500',
 *   description: ''
 * }
 */
export function colorDesignTokensCollectionTokenToMarkdown(
  token: ColorDesignTokensCollectionToken,
  _context: MarkdownRenderContext,
  _options: ColorMarkdownRenderOptions = {},
): MarkdownTokenRow {
  // Generate the CSS variable name for this token
  const cssVariable = createCssVariableNameGenerator({
    prefix: CSS_VARIABLE_PREFIX,
  })(token.name);

  // Create the color preview HTML using CSS variable directly
  // The browser resolves var(--esds-*) via the CSS cascade
  const preview = /* HTML */ `
    <div
      style="
      border-radius: 4px;
      width: 100%;
      height: 75px;
      background: var(${cssVariable});
      border: 1px solid #e5e7eb;
    "
    ></div>
    <div data-preview-value="${cssVariable}"></div>
  `;

  return {
    preview,
    name: token.name.join('.'),
    cssVariable,
    description: token.description ?? '',
  };
}
