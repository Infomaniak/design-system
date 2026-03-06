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
  // Generate the CSS variable name for this token
  const cssVariable = createCssVariableNameGenerator({
    prefix: CSS_VARIABLE_PREFIX,
  })(token.name);

  // Get the display value
  // For T1 (direct values): show the actual pixel value
  // For T2/T3 (references): show the CSS variable reference they point to
  let displayValue: string;
  if (isCurlyReference(token.value)) {
    displayValue = curlyReferenceToString(token.value);
  } else {
    // Token has a direct value - resolve it to show the actual value
    const value = token.value as DimensionDesignTokensCollectionTokenValue;
    displayValue = dimensionDesignTokensCollectionTokenValueToCssValue(value);
  }
  const { boxSize = 50 } = options;

  // Create the border-width preview HTML using CSS variable directly
  // The browser resolves var(--esds-*) via the CSS cascade
  const preview = /* HTML */ `
    <div
      style="
      width: ${boxSize}px;
      height: ${boxSize}px;
      background: #f1f5f9;
      border: var(${cssVariable}) solid #374151;
      display: inline-block;
    "
    ></div>
    <div
      style="
      margin-top: 8px;
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
