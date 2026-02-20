import type { DimensionDesignTokensCollectionToken } from '../../../../../token/types/base/dimension/dimension-design-tokens-collection-token.ts';
import { valueOrCurlyReferenceToCssVariableReference } from '../../../../css/reference/value-or-curly-reference-to-css-variable-reference.ts';
import { dimensionDesignTokensCollectionTokenValueToCssValue } from '../../../../css/token/types/base/dimension/value/dimension-design-tokens-collection-token-value-to-css-value.ts';
import type { MarkdownRenderContext } from '../../markdown-render-context.ts';
import type { MarkdownTokenRow } from '../../markdown-token-row.ts';

/**
 * Configuration options for dimension markdown rendering
 */
export interface DimensionMarkdownRenderOptions {
  /**
   * Height of the dimension preview bar in pixels
   * @default 16
   */
  readonly previewHeight?: number;
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
 *   value: '8px',
 *   description: ''
 * }
 */
export function dimensionDesignTokensCollectionTokenToMarkdown(
  token: DimensionDesignTokensCollectionToken,
  _context: MarkdownRenderContext,
  options: DimensionMarkdownRenderOptions = {},
): MarkdownTokenRow {
  // Convert dimension value to CSS value (e.g. "8px")
  const cssValue = valueOrCurlyReferenceToCssVariableReference(
    token.value,
    dimensionDesignTokensCollectionTokenValueToCssValue,
  );
  const { previewHeight = 16 } = options;

  // Create the dimension preview HTML
  // Shows the bar at the exact CSS value (e.g. width: 384px) with no scaling
  const preview = /* HTML */ `
    <div
      style="
      background: #dcfce8;
      height: ${previewHeight}px;
      width: ${cssValue};
      border-radius: 2px;
      border: 1px solid #86efad;
      position: relative;
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
