import { CSS_VARIABLE_PREFIX } from '../../../../../../../../scripts/build-tokens/src/constants/css-variable-prefix.ts';
import type { ColorDesignTokensCollectionToken } from '../../../../../token/types/base/color/color-design-tokens-collection-token.ts';
import { createCssVariableNameGenerator } from '../../../../css/token/name/create-css-variable-name-generator.ts';
import type { MarkdownRenderContext } from '../../markdown-render-context.ts';
import type { MarkdownTokenRow } from '../../markdown-token-row.ts';

/**
 * Renders a color design token to a markdown table row.
 *
 * Creates a visual color preview with a swatch box.
 * The color value text is resolved at browser runtime via `data-preview-value`
 * so it reflects theme/product CSS overrides dynamically.
 *
 * @param token - The color design token to render
 * @param _context - The render context (unused — resolution is browser-side)
 * @param _options - Rendering options
 * @returns A markdown table row with color preview
 *
 * @example
 * Input: color.red.500 with value { hex: "#f4364f", ... }
 * Output: {
 *   preview: '<div style="background: var(--esds-color-red-500);"></div><div data-preview-value="--esds-color-red-500"></div>',
 *   name: 'color.red.500',
 *   cssVariable: '--esds-color-red-500',
 *   description: ''
 * }
 */
export function colorDesignTokensCollectionTokenToMarkdown(
  token: ColorDesignTokensCollectionToken,
  _context: MarkdownRenderContext,
  _options: object = {},
): MarkdownTokenRow {
  // Generate the CSS variable name for this token
  const cssVariable = createCssVariableNameGenerator({
    prefix: CSS_VARIABLE_PREFIX,
  })(token.name);

  // Create the color preview HTML using CSS variable directly.
  // The visual swatch updates with theme/product CSS overrides.
  // The text value is filled in at browser runtime via data-preview-value.
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
