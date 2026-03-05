import { CSS_VARIABLE_PREFIX } from '../../../../../../../../scripts/build-tokens/src/constants/css-variable-prefix.ts';
import { isCurlyReference } from '../../../../../../design-token/reference/types/curly/is-curly-reference.ts';
import { curlyReferenceToString } from '../../../../../../design-token/reference/types/curly/to/string/curly-reference-to-string.ts';
import type { DimensionDesignTokensCollectionToken } from '../../../../../token/types/base/dimension/dimension-design-tokens-collection-token.ts';
import type { DimensionDesignTokensCollectionTokenValue } from '../../../../../token/types/base/dimension/value/dimension-design-tokens-collection-token-value.ts';
import { createCssVariableNameGenerator } from '../../../../css/token/name/create-css-variable-name-generator.ts';
import { dimensionDesignTokensCollectionTokenValueToCssValue } from '../../../../css/token/types/base/dimension/value/dimension-design-tokens-collection-token-value-to-css-value.ts';
import type { MarkdownRenderContext } from '../../markdown-render-context.ts';
import type { MarkdownTokenRow } from '../../markdown-token-row.ts';

/**
 * Configuration options for breakpoint markdown rendering
 */
export type BreakpointMarkdownRenderOptions = object;

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
  // Generate the CSS variable name for this token
  const cssVariable = createCssVariableNameGenerator({
    prefix: CSS_VARIABLE_PREFIX,
  })(token.name);

  // Get the display value
  // For T1 (direct values): show the actual breakpoint value
  // For T2/T3 (references): show the referenced token name
  let displayValue: string;
  const value = token.value as DimensionDesignTokensCollectionTokenValue;
  if (isCurlyReference(token.value)) {
    displayValue = curlyReferenceToString(token.value);
  } else {
    displayValue = dimensionDesignTokensCollectionTokenValueToCssValue(value);
  }

  // Create a simple text-based preview using CSS variable directly
  // The browser resolves var(--esds-*) via the CSS cascade
  const preview = /* HTML */ `
    <div
      style="
      background: #f3f4f6;
      padding: 16px 24px;
      border-radius: 4px;
      border: 1px solid #e5e7eb;
      font-family: monospace;
      font-size: 24px;
      font-weight: 600;
      color: #374151;
      text-align: center;
      display: inline-block;
      min-width: 120px;
    "
    >
      ${displayValue}
    </div>
  `;

  return {
    preview,
    name: token.name.join('.'),
    value: displayValue,
    cssVariable,
    description: token.description ?? '',
  };
}
