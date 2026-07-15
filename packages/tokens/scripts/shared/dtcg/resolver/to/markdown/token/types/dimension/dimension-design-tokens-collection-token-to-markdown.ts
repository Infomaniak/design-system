import { CSS_VARIABLE_PREFIX } from '../../../../../../../../scripts/build-tokens/src/constants/css-variable-prefix.ts';
import type { DimensionDesignTokensCollectionToken } from '../../../../../token/types/base/dimension/dimension-design-tokens-collection-token.ts';
import { createCssVariableNameGenerator } from '../../../../css/token/name/create-css-variable-name-generator.ts';
import type { MarkdownRenderContext } from '../../markdown-render-context.ts';
import type { MarkdownTokenRow } from '../../markdown-token-row.ts';

/**
 * Configuration options for dimension markdown rendering
 */
export interface DimensionMarkdownRenderOptions {
  /**
   * Height of the dimension preview bar in pixels
   * @default "16px"
   */
  readonly previewHeight?: string;
}

/**
 * Renders a dimension design token to a markdown table row.
 *
 * Creates a visual preview with a green horizontal bar showing the dimension's size.
 * Useful for spacing, sizes, radii, and other dimensional tokens.
 *
 * @param token - The dimension design token to render
 * @param _context - The render context (unused for simple dimension tokens)
 * @param options - Rendering options for customizing the preview
 * @returns A markdown table row with dimension preview
 *
 * @example
 * Input: spacing.8 with value { value: 8, unit: 'px' }
 * Output: {
 *   preview: '<div style="background: #dcfce8; ...">8px</div>',
 *   name: 'spacing.8',
 *   cssVariable: '--esds-...',
 *   description: ''
 * }
 */
export function dimensionDesignTokensCollectionTokenToMarkdown(
  token: DimensionDesignTokensCollectionToken,
  _context: MarkdownRenderContext,
  options: DimensionMarkdownRenderOptions = {},
): MarkdownTokenRow {
  // Generate the CSS variable name for this token
  const cssVariable = createCssVariableNameGenerator({
    prefix: CSS_VARIABLE_PREFIX,
  })(token.name);

  const { previewHeight = '16px' } = options;

  // Display the resolved CSS value dynamically using data-preview-value
  // Works for both T1 (direct) and T2 (reference) tokens
  const displayValue = `<div data-preview-value="${cssVariable}"></div>`;

  // Create the dimension preview HTML using CSS variable directly
  // The browser resolves var(--esds-*) via the CSS cascade
  const preview = /* HTML */ `
    <div
      style="
      background: #dcfce8;
      height: ${previewHeight};
      width: var(${cssVariable});
      border-radius: 2px;
      border: 1px solid #86efad;
      position: relative;
      aspect-ratio: 1 / 1;
    "
    ></div>
    ${displayValue}
  `;

  return {
    preview,
    name: token.name.join('.'),
    cssVariable,
    description: token.description ?? '',
  };
}
