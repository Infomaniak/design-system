import { CSS_VARIABLE_PREFIX } from '../../../../../../../../scripts/build-tokens/src/constants/css-variable-prefix.ts';
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
 * @param context - The render context used for resolving token references
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
  context: MarkdownRenderContext,
  options: DimensionMarkdownRenderOptions = {},
): MarkdownTokenRow {
  // Resolve the token (works for both T1 direct values and T2 references)
  const resolved = context.collection.resolve(token);

  // Generate the CSS variable name for this token
  const cssVariable = createCssVariableNameGenerator({
    prefix: CSS_VARIABLE_PREFIX,
  })(token.name);

  const { previewHeight = '16px' } = options;

  // Resolve the value text for both T1 and T2 tokens
  const displayValue = dimensionDesignTokensCollectionTokenValueToCssValue(resolved.value);

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
    cssVariable,
    description: token.description ?? '',
  };
}
