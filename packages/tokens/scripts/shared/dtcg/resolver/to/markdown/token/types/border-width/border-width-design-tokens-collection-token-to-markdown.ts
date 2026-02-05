import type { DimensionDesignTokensCollectionToken } from '../../../../../token/types/base/dimension/dimension-design-tokens-collection-token.ts';
import type { DimensionDesignTokensCollectionTokenValue } from '../../../../../token/types/base/dimension/value/dimension-design-tokens-collection-token-value.ts';
import { dimensionDesignTokensCollectionTokenValueToCssValue } from '../../../../css/token/types/base/dimension/value/dimension-design-tokens-collection-token-value-to-css-value.ts';
import type { MarkdownRenderContext } from '../../markdown-render-context.ts';
import type { MarkdownTokenRow } from '../../markdown-token-row.ts';

/**
 * Configuration options for border-width markdown rendering
 */
export interface BorderWidthMarkdownRenderOptions {
  /**
   * Size of the preview box in pixels
   * @default 50
   */
  readonly boxSize?: number;
}

/**
 * Renders a border-width design token to a markdown table row.
 *
 * Creates a visual preview with a square box showing the border-width.
 * This helps visualize how thick the border will actually appear.
 *
 * @param token - The border-width design token to render
 * @param _context - The render context (unused for border-width tokens)
 * @param options - Rendering options for customizing the preview
 * @returns A markdown table row with border-width preview
 *
 * @example
 * Input: border-width.2 with value { value: 2, unit: 'px' }
 * Output: {
 *   preview: Box with 2px border,
 *   name: 'border-width.2',
 *   value: '2px',
 *   description: ''
 * }
 */
export function borderWidthDesignTokensCollectionTokenToMarkdown(
  token: DimensionDesignTokensCollectionToken,
  _context: MarkdownRenderContext,
  options: BorderWidthMarkdownRenderOptions = {},
): MarkdownTokenRow {
  const { boxSize = 50 } = options;

  // Convert dimension value to CSS value (e.g. "2px")
  const value = token.value as DimensionDesignTokensCollectionTokenValue;
  const cssValue = dimensionDesignTokensCollectionTokenValueToCssValue(value);

  // Create the border-width preview HTML
  // Shows a square box with the border-width applied
  const preview = /* HTML */ `
    <div style="
      width: ${boxSize}px;
      height: ${boxSize}px;
      background: #f1f5f9;
      border: ${cssValue} solid #374151;
      display: inline-block;
    "></div>
    <div style="
      margin-top: 8px;
      font-family: monospace;
      font-size: 12px;
      color: #6b7280;
    ">${cssValue}</div>
  `;

  return {
    preview,
    name: token.name.join('.'),
    value: cssValue,
    description: token.description ?? '',
  };
}
