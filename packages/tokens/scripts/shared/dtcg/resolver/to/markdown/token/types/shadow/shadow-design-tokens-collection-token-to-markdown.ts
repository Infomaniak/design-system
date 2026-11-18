/**
 * Shadow Design Token Markdown Renderer
 *
 * Handles rendering of shadow design tokens to markdown table rows.
 * Shadow tokens contain multiple dimensional components (x, y, blur, spread)
 * that need to be composed into a CSS box-shadow string.
 *
 * @module shadow-design-tokens-collection-token-to-markdown
 */

import { CSS_VARIABLE_PREFIX } from '../../../../../../../../scripts/build-tokens/src/constants/css-variable-prefix.ts';
import type { ShadowDesignTokensCollectionToken } from '../../../../../token/types/composite/shadow/shadow-design-tokens-collection-token.ts';
import { createCssVariableNameGenerator } from '../../../../css/token/name/create-css-variable-name-generator.ts';
import type { MarkdownRenderContext } from '../../markdown-render-context.ts';
import type { MarkdownTokenRow } from '../../markdown-token-row.ts';

/**
 * Configuration options for shadow markdown rendering
 */
export interface ShadowMarkdownRenderOptions {
  /**
   * Size of the shadow preview box in pixels (width and height)
   * @default 50
   */
  readonly boxSize?: number;
}

/**
 * Renders a shadow design token to a markdown table row.
 *
 * Creates a visual preview with a box displaying the shadow effect.
 * The shadow CSS value is displayed as text below the preview.
 *
 * @param token - The shadow design token to render
 * @param _context - The render context (unused for shadow tokens)
 * @param options - Rendering options for customizing the preview
 * @returns A markdown table row with shadow preview
 *
 * @example
 * Input: shadow.1 with composite value { x: 0px, y: 1px, blur: 2px, spread: 0px }
 * Output: {
 *   preview: Box with shadow effect displayed,
 *   name: 'shadow.1',
 *   value: '0px 1px 2px 0px rgba(12,12,12,0.09)',
 *   description: ''
 * }
 */
export function shadowDesignTokensCollectionTokenToMarkdown(
  token: ShadowDesignTokensCollectionToken,
  _context: MarkdownRenderContext,
  options: ShadowMarkdownRenderOptions = {},
): MarkdownTokenRow {
  const { boxSize = 50 } = options;

  // Generate the CSS variable name for this token
  const cssVariable = createCssVariableNameGenerator({
    prefix: CSS_VARIABLE_PREFIX,
  })(token.name);

  // Create the shadow preview HTML using CSS variable directly
  // The browser resolves var(--esds-*) via the CSS cascade
  const preview = /* HTML */ `
    <div
      style="
      width: ${boxSize}px;
      height: ${boxSize}px;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 4px;
      box-shadow: var(${cssVariable});
      margin: 16px;
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
