import { CSS_VARIABLE_PREFIX } from '../../../../../../../../scripts/build-tokens/src/constants/css-variable-prefix.ts';
import { isCurlyReference } from '../../../../../../design-token/reference/types/curly/is-curly-reference.ts';
import { curlyReferenceToString } from '../../../../../../design-token/reference/types/curly/to/string/curly-reference-to-string.ts';
import type { FontFamilyDesignTokensCollectionToken } from '../../../../../token/types/base/font-family/font-family-design-tokens-collection-token.ts';
import { createCssVariableNameGenerator } from '../../../../css/token/name/create-css-variable-name-generator.ts';
import { fontFamilyDesignTokensCollectionTokenValueToCssValue } from '../../../../css/token/types/base/font-family/value/font-family-design-tokens-collection-token-value-to-css-value.ts';
import type { MarkdownRenderContext } from '../../markdown-render-context.ts';
import type { MarkdownTokenRow } from '../../markdown-token-row.ts';
import { DEFAULT_SAMPLE_TEXT } from '../../shared/constants.ts';

/**
 * Configuration options for font family markdown rendering
 */
export interface FontFamilyMarkdownRenderOptions {
  /**
   * Sample text to display with the font family
   * @default "Edelweiss prefers rocky limestone locations"
   */
  readonly sampleText?: string;

  /**
   * Font size for the sample display in pixels
   * @default 16
   */
  readonly sampleFontSize?: number;
}

/**
 * Renders a font family design token to a markdown table row.
 *
 * Creates a visual preview showing sample text rendered in the specified font family.
 * The font family values are displayed as a comma-separated list below the preview.
 *
 * @param token - The font family design token to render
 * @param _context - The render context
 * @param options - Rendering options for customizing the preview
 * @returns A markdown table row with font family preview
 *
 * @example
 * Input: font.family.sans with value ["Inter", "sans-serif"]
 * Output: {
 *   preview: Sample text with font applied,
 *   name: 'font.family.sans',
 *   value: 'Inter, sans-serif',
 *   description: ''
 * }
 */
export function fontFamilyDesignTokensCollectionTokenToMarkdown(
  token: FontFamilyDesignTokensCollectionToken,
  _context: MarkdownRenderContext,
  options: FontFamilyMarkdownRenderOptions = {},
): MarkdownTokenRow {
  const { sampleText = DEFAULT_SAMPLE_TEXT, sampleFontSize = 16 } = options;

  // Generate the CSS variable name for this token
  const cssVariable = createCssVariableNameGenerator({
    prefix: CSS_VARIABLE_PREFIX,
  })(token.name);

  // Get the display value
  // For T1 (direct values): show the actual font family list
  // For T2/T3 (references): show the CSS variable reference they point to
  let displayValue: string;
  if (isCurlyReference(token.value)) {
    displayValue = curlyReferenceToString(token.value);
  } else {
    // Token has a direct value - resolve it to show the actual font family
    displayValue = fontFamilyDesignTokensCollectionTokenValueToCssValue(token.value);
  }

  // Create the font family preview HTML
  // Shows sample text with the font family applied using CSS variable directly
  // The browser resolves var(--esds-*) via the CSS cascade
  const preview = /* HTML */ `
    <p
      style="
      font-family: var(${cssVariable});
      font-size: ${sampleFontSize}px;
      margin: 0;
      padding: 8px;
      background: #f9fafb;
      border-radius: 4px;
      border: 1px solid #e5e7eb;
    "
    >
      ${sampleText}
    </p>
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
