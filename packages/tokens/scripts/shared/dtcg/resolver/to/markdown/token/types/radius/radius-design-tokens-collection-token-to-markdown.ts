import { CSS_VARIABLE_PREFIX } from '../../../../../../../../scripts/build-tokens/src/constants/css-variable-prefix.ts';
import { isCurlyReference } from '../../../../../../design-token/reference/types/curly/is-curly-reference.ts';
import { curlyReferenceToString } from '../../../../../../design-token/reference/types/curly/to/string/curly-reference-to-string.ts';
import type { DimensionDesignTokensCollectionToken } from '../../../../../token/types/base/dimension/dimension-design-tokens-collection-token.ts';
import { createCssVariableNameGenerator } from '../../../../css/token/name/create-css-variable-name-generator.ts';
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
    displayValue = dimensionDesignTokensCollectionTokenValueToCssValue(token.value);
  }
  const { boxSize = 100 } = options;

  // Create the radius preview HTML using CSS variable directly
  // The browser resolves var(--esds-*) via the CSS cascade
  const preview = /* HTML */ `
    <div
      style="
      width: ${boxSize}px;
      height: ${boxSize}px;
      background: #dcfce8;
      border: 2px solid #374151;
      border-radius: var(${cssVariable});
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
