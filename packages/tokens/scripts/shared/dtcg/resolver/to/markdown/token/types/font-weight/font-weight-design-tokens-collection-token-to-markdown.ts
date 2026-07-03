import { CSS_VARIABLE_PREFIX } from '../../../../../../../../scripts/build-tokens/src/constants/css-variable-prefix.ts';
import type { FontWeightDesignTokensCollectionToken } from '../../../../../token/types/base/font-weight/font-weight-design-tokens-collection-token.ts';
import { createCssVariableNameGenerator } from '../../../../css/token/name/create-css-variable-name-generator.ts';
import { fontWeightDesignTokensCollectionTokenValueToCssValue } from '../../../../css/token/types/base/font-weight/value/font-weight-design-tokens-collection-token-value-to-css-value.ts';
import type { MarkdownRenderContext } from '../../markdown-render-context.ts';
import type { MarkdownTokenRow } from '../../markdown-token-row.ts';
import { DEFAULT_SAMPLE_TEXT } from '../../shared/constants.ts';
import { createResolvedValueDisplay } from '../../shared/create-resolved-value-display.ts';

/**
 * Configuration options for font weight markdown rendering
 */
export interface FontWeightMarkdownRenderOptions {
  /**
   * Sample text to display with the font weight
   * @default "Edelweiss prefers rocky limestone locations"
   */
  readonly sampleText?: string;

  /**
   * Font size for the sample display in pixels
   * @default 16
   */
  readonly sampleFontSize?: number;

  /**
   * Fallback font family for the sample
   * @default "system-ui, sans-serif"
   */
  readonly sampleFontFamily?: string;
}

/**
 * Renders a font weight design token to a markdown table row.
 *
 * Creates a visual preview showing sample text rendered in the specified font weight.
 * Displays the raw weight value as provided by the token.
 *
 * @param token - The font weight design token to render
 * @param context - The render context used for resolving token references
 * @param options - Rendering options for customizing the preview
 * @returns A markdown table row with font weight preview
 *
 * @example
 * Input: font.weight.bold with value 700
 * Output: {
 *   preview: Bold sample text,
 *   name: 'font.weight.bold',
 *   value: '700 (Bold)',
 *   description: ''
 * }
 */
export function fontWeightDesignTokensCollectionTokenToMarkdown(
  token: FontWeightDesignTokensCollectionToken,
  context: MarkdownRenderContext,
  options: FontWeightMarkdownRenderOptions = {},
): MarkdownTokenRow {
  const {
    sampleText = DEFAULT_SAMPLE_TEXT,
    sampleFontSize = 16,
    sampleFontFamily = 'system-ui, sans-serif',
  } = options;

  // Generate the CSS variable name for this token
  const cssVariable = createCssVariableNameGenerator({
    prefix: CSS_VARIABLE_PREFIX,
  })(token.name);

  // Resolve the token (works for both T1 direct values and T2 references)
  const resolved = context.collection.resolve(token);

  // Resolve the concrete value text for both T1 and T2 tokens
  const displayValue = fontWeightDesignTokensCollectionTokenValueToCssValue(resolved.value);

  // Create the font weight preview HTML using CSS variable directly
  // The browser resolves var(--esds-*) via the CSS cascade
  const preview = /* HTML */ `
    <p
      style="
      font-weight: var(${cssVariable});
      font-size: ${sampleFontSize}px;
      font-family: ${sampleFontFamily};
      margin: 0;
      padding: 8px;
      background: #f9fafb;
      border-radius: 4px;
      border: 1px solid #e5e7eb;
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
