import { CSS_VARIABLE_PREFIX } from '../../../../../../../../scripts/build-tokens/src/constants/css-variable-prefix.ts';
import type { DimensionDesignTokensCollectionToken } from '../../../../../token/types/base/dimension/dimension-design-tokens-collection-token.ts';
import { createCssVariableNameGenerator } from '../../../../css/token/name/create-css-variable-name-generator.ts';
import { dimensionDesignTokensCollectionTokenValueToCssValue } from '../../../../css/token/types/base/dimension/value/dimension-design-tokens-collection-token-value-to-css-value.ts';
import type { MarkdownRenderContext } from '../../markdown-render-context.ts';
import type { MarkdownTokenRow } from '../../markdown-token-row.ts';
import { DEFAULT_SAMPLE_TEXT } from '../../shared/constants.ts';
import { createResolvedValueDisplay } from '../../shared/create-resolved-value-display.ts';

/**
 * Configuration options for letter-spacing markdown rendering
 */
export interface LetterSpacingMarkdownRenderOptions {
  /**
   * Sample text to display with the letter spacing
   */
  readonly sampleText?: string;

  /**
   * Font size for the sample display in pixels
   * @default 16
   */
  readonly sampleFontSize?: number;
}

/**
 * Renders a letter-spacing design token to a markdown table row.
 *
 * Creates a visual preview showing sample text rendered with the specified letter spacing.
 * The letter spacing value is displayed below the preview for both T1 and T2 tokens.
 *
 * @param token - The letter-spacing design token to render
 * @param context - The render context used for resolving token references
 * @param options - Rendering options for customizing the preview
 * @returns A markdown table row with letter-spacing preview
 *
 * @example
 * Input: font.letter-spacing.md with value { value: 0, unit: 'px' }
 * Output: {
 *   preview: Sample text with letter-spacing applied,
 *   name: 'font.letter-spacing.md',
 *   cssVariable: '--esds-font-letter-spacing-md',
 *   description: ''
 * }
 */
export function letterSpacingDesignTokensCollectionTokenToMarkdown(
  token: DimensionDesignTokensCollectionToken,
  context: MarkdownRenderContext,
  options: LetterSpacingMarkdownRenderOptions = {},
): MarkdownTokenRow {
  const { sampleText = DEFAULT_SAMPLE_TEXT, sampleFontSize = 16 } = options;

  // Generate the CSS variable name for this token
  const cssVariable = createCssVariableNameGenerator({
    prefix: CSS_VARIABLE_PREFIX,
  })(token.name);

  // Resolve the token (works for both T1 direct values and T2 references)
  const resolved = context.collection.resolve(token);

  // Resolve the concrete value text for both T1 and T2 tokens
  const displayValue = dimensionDesignTokensCollectionTokenValueToCssValue(resolved.value);

  // Create the letter-spacing preview HTML using CSS variable directly
  // The browser resolves var(--esds-*) via the CSS cascade
  const preview = /* HTML */ `
    <p
      style="
      letter-spacing: var(${cssVariable});
      font-size: ${sampleFontSize}px;
      margin: 0;
      padding: 8px;
      background: #f9fafb;
      border-radius: 4px;
      border: 1px solid #e5e7eb;
      line-height: 1.4;
    "
    >
      ${sampleText}
    </p>
    ${createResolvedValueDisplay(displayValue)}
  `;

  return {
    preview,
    name: token.name.join('.'),
    cssVariable,
    description: token.description ?? '',
  };
}
