import { CSS_VARIABLE_PREFIX } from '../../../../../../../../scripts/build-tokens/src/constants/css-variable-prefix.ts';
import type { DimensionDesignTokensCollectionToken } from '../../../../../token/types/base/dimension/dimension-design-tokens-collection-token.ts';
import { createCssVariableNameGenerator } from '../../../../css/token/name/create-css-variable-name-generator.ts';
import { dimensionDesignTokensCollectionTokenValueToCssValue } from '../../../../css/token/types/base/dimension/value/dimension-design-tokens-collection-token-value-to-css-value.ts';
import type { MarkdownRenderContext } from '../../markdown-render-context.ts';
import type { MarkdownTokenRow } from '../../markdown-token-row.ts';
import { createResolvedValueDisplay } from '../../shared/create-resolved-value-display.ts';

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
 * @param context - The render context used for resolving token references
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
  context: MarkdownRenderContext,
  options: RadiusMarkdownRenderOptions = {},
): MarkdownTokenRow {
  // Resolve the token (works for both T1 direct values and T2 references)
  const resolved = context.collection.resolve(token);

  // Generate the CSS variable name for this token
  const cssVariable = createCssVariableNameGenerator({
    prefix: CSS_VARIABLE_PREFIX,
  })(token.name);

  // Resolve the concrete value text for both T1 and T2 tokens
  const displayValue = dimensionDesignTokensCollectionTokenValueToCssValue(resolved.value);

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
    ${createResolvedValueDisplay(displayValue)}
  `;

  return {
    preview,
    name: token.name.join('.'),
    cssVariable,
    description: token.description ?? '',
  };
}
