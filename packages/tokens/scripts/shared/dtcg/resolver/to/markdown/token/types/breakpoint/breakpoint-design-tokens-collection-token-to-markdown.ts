import type { DimensionDesignTokensCollectionToken } from '../../../../../token/types/base/dimension/dimension-design-tokens-collection-token.ts';
import type { DimensionDesignTokensCollectionTokenValue } from '../../../../../token/types/base/dimension/value/dimension-design-tokens-collection-token-value.ts';
import { dimensionDesignTokensCollectionTokenValueToCssValue } from '../../../../css/token/types/base/dimension/value/dimension-design-tokens-collection-token-value-to-css-value.ts';
import type { MarkdownRenderContext } from '../../markdown-render-context.ts';
import type { MarkdownTokenRow } from '../../markdown-token-row.ts';

/**
 * Configuration options for breakpoint markdown rendering
 */
export interface BreakpointMarkdownRenderOptions {}

/**
 * Renders a breakpoint design token to a markdown table row.
 *
 * Creates a simple text-based display since breakpoints are typically
 * too large (640px, 768px, 1024px, etc.) to visualize as bars.
 *
 * @param token - The breakpoint design token to render
 * @param _context - The render context (unused for breakpoint tokens)
 * @param _options - Rendering options
 * @returns A markdown table row with breakpoint value display
 *
 * @example
 * Input: breakpoint.1024 with value { value: 1024, unit: 'px' }
 * Output: {
 *   preview: Large text showing "1024px",
 *   name: 'breakpoint.1024',
 *   value: '1024px',
 *   description: ''
 * }
 */
export function breakpointDesignTokensCollectionTokenToMarkdown(
  token: DimensionDesignTokensCollectionToken,
  _context: MarkdownRenderContext,
  _options: BreakpointMarkdownRenderOptions = {},
): MarkdownTokenRow {
  // Convert dimension value to CSS value (e.g. "1024px")
  const value = token.value as unknown as DimensionDesignTokensCollectionTokenValue;
  const cssValue = dimensionDesignTokensCollectionTokenValueToCssValue(value);

  // Create a simple text-based preview (breakpoints are too large to visualize)
  const preview =
    `<div style="background: #f3f4f6; padding: 16px 24px; border-radius: 4px; border: 1px solid #e5e7eb; font-family: monospace; font-size: 24px; font-weight: 600; color: #374151; text-align: center; display: inline-block; min-width: 120px;">${cssValue}</div>`;

  return {
    preview,
    name: token.name.join('.'),
    value: cssValue,
    description: token.description ?? '',
  };
}
