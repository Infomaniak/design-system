import type { DimensionDesignTokensCollectionToken } from '../../../../../token/types/base/dimension/dimension-design-tokens-collection-token.ts';
import type { DimensionDesignTokensCollectionTokenValue } from '../../../../../token/types/base/dimension/value/dimension-design-tokens-collection-token-value.ts';
import { dimensionDesignTokensCollectionTokenValueToCssValue } from '../../../../css/token/types/base/dimension/value/dimension-design-tokens-collection-token-value-to-css-value.ts';
import type { MarkdownRenderContext } from '../../markdown-render-context.ts';
import type { MarkdownTokenRow } from '../../markdown-token-row.ts';

/**
 * Configuration options for radius markdown rendering
 */
export interface RadiusMarkdownRenderOptions {
  /**
   * Size of the preview box in pixels
   * @default 100
   */
  readonly boxSize?: number;
}

/**
 * Renders a radius design token to a markdown table row.
 *
 * Creates a visual preview with a square box showing the border-radius effect.
 * This helps visualize how the radius value will actually look when applied.
 *
 * @param token - The radius design token to render
 * @param _context - The render context (unused for radius tokens)
 * @param options - Rendering options for customizing the preview
 * @returns A markdown table row with radius preview
 *
 * @example
 * Input: radius.8 with value { value: 8, unit: 'px' }
 * Output: {
 *   preview: Box with 8px border-radius applied,
 *   name: 'radius.8',
 *   value: '8px',
 *   description: ''
 * }
 */
export function radiusDesignTokensCollectionTokenToMarkdown(
  token: DimensionDesignTokensCollectionToken,
  _context: MarkdownRenderContext,
  options: RadiusMarkdownRenderOptions = {},
): MarkdownTokenRow {
  const { boxSize = 100 } = options;

  // Convert dimension value to CSS value (e.g. "8px")
  const value = token.value as DimensionDesignTokensCollectionTokenValue;
  const cssValue = dimensionDesignTokensCollectionTokenValueToCssValue(value);

  // Create the radius preview HTML
  // Shows a square box with the border-radius applied
  const preview = /* HTML */ `
    <div style="
      width: ${boxSize}px;
      height: ${boxSize}px;
      background: #dcfce8;
      border: 2px solid #374151;
      border-radius: ${cssValue};
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
