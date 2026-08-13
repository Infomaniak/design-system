import { CSS_VARIABLE_PREFIX } from '../../../../../../../../scripts/build-tokens/src/constants/css-variable-prefix.ts';
import type { TypographyDesignTokensCollectionToken } from '../../../../../token/types/composite/typography/typography-design-tokens-collection-token.ts';
import { createCssVariableNameGenerator } from '../../../../css/token/name/create-css-variable-name-generator.ts';
import type { MarkdownRenderContext } from '../../markdown-render-context.ts';
import type { MarkdownTokenRow } from '../../markdown-token-row.ts';
import { DEFAULT_SAMPLE_TEXT } from '../../shared/constants.ts';

/**
 * Configuration options for typography markdown rendering
 */
export interface TypographyMarkdownRenderOptions {
  /**
   * Sample text to display with the typography settings
   * @default "Edelweiss prefers rocky limestone locations"
   */
  readonly sampleText?: string;
}

/**
 * Renders a typography design token to a markdown table row.
 *
 * Creates a visual preview showing styled text with all typographic properties
 * (font family, size, weight, letter spacing, line height) applied.
 * Displays the computed CSS font shorthand below the preview.
 *
 * This renderer attempts to resolve token references when possible, showing
 * actual computed values instead of just reference names.
 *
 * @param token - The typography design token to render
 * @param _context - The render context used for resolving token references
 * @param options - Rendering options for customizing the preview
 * @returns A markdown table row with typography preview
 *
 * @example
 * Input: typography.heading with composite value
 * Output: {
 *   preview: Styled text with font settings applied,
 *   name: 'typography.heading',
 *   cssVariable: '--esds-typography-heading',
 *   description: ''
 * }
 */
export function typographyDesignTokensCollectionTokenToMarkdown(
  token: TypographyDesignTokensCollectionToken,
  _context: MarkdownRenderContext,
  options: TypographyMarkdownRenderOptions = {},
): MarkdownTokenRow {
  const { sampleText = DEFAULT_SAMPLE_TEXT } = options;

  // Generate the CSS variable name for this token
  const cssVariable = createCssVariableNameGenerator({
    prefix: CSS_VARIABLE_PREFIX,
  })(token.name);

  const displayValue = `<div data-preview-value="${cssVariable}"></div>`;

  // Create the typography preview HTML using CSS shorthand variable directly
  // The browser resolves var(--esds-typography-*) via the CSS cascade
  const preview = /* HTML */ `
    <p
      style="
      font: var(${cssVariable});
      margin: 0;
      padding: 12px;
      background: #f9fafb;
      border-radius: 4px;
      border: 1px solid #e5e7eb;
      max-width: 300px;
    "
    >
      ${sampleText}
    </p>
    ${displayValue}
  `;

  return {
    preview,
    name: token.name.join('.'),
    cssVariable,
    description: token.description ?? '',
  };
}
