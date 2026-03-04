import { CSS_VARIABLE_PREFIX } from '../../../../../../../../scripts/build-tokens/src/constants/css-variable-prefix.ts';
import { isCurlyReference } from '../../../../../../design-token/reference/types/curly/is-curly-reference.ts';
import { curlyReferenceToString } from '../../../../../../design-token/reference/types/curly/to/string/curly-reference-to-string.ts';
import type { DimensionDesignTokensCollectionToken } from '../../../../../token/types/base/dimension/dimension-design-tokens-collection-token.ts';
import { createCssVariableNameGenerator } from '../../../../css/token/name/create-css-variable-name-generator.ts';
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
  // Generate the CSS variable name for this token
  const cssVariable = createCssVariableNameGenerator({
    prefix: CSS_VARIABLE_PREFIX,
  })(token.name);

  // Get the display value
  // For T1 (direct values): show the actual pixel value
  // For T2/T3 (references): show the referenced token name (e.g., "spacing.8")
  let displayValue: string;
  if (isCurlyReference(token.value)) {
    displayValue = curlyReferenceToString(token.value);
  } else {
    // Token has a direct value - resolve it to show the actual value
    displayValue = dimensionDesignTokensCollectionTokenValueToCssValue(token.value);
  }
  const { previewHeight = 16 } = options;

  // Create the dimension preview HTML using CSS variable directly
  // The browser resolves var(--esds-*) via the CSS cascade
  const preview = /* HTML */ `
    <div
      style="
      background: #dcfce8;
      height: ${previewHeight}px;
      width: var(${cssVariable});
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
