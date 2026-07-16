import { CSS_VARIABLE_PREFIX } from '../../../../../../../../scripts/build-tokens/src/constants/css-variable-prefix.ts';
import type { DimensionDesignTokensCollectionToken } from '../../../../../token/types/base/dimension/dimension-design-tokens-collection-token.ts';
import { createCssVariableNameGenerator } from '../../../../css/token/name/create-css-variable-name-generator.ts';
import type { MarkdownRenderContext } from '../../markdown-render-context.ts';
import type { MarkdownTokenRow } from '../../markdown-token-row.ts';
import { DEFAULT_SAMPLE_TEXT } from '../../shared/constants.ts';

export interface FontSizeMarkdownRenderOptions {
  readonly sampleText?: string;
}

/**
 * Renders a font-size design token to a markdown table row.
 *
 * Creates a visual preview showing sample text rendered in the specified font size.
 * The font size is displayed below the preview for direct values.
 *
 * @param token - The font-size design token to render
 * @param _context - The render context (unused for font-size tokens)
 * @param options - Rendering options for customizing the preview
 * @returns A markdown table row with font-size preview
 *
 * @example
 * Input: font.size.md with value { value: 16, unit: 'px' }
 * Output: {
 *   preview: Sample text with 16px font-size,
 *   name: 'font.size.md',
 *   cssVariable: '--esds-font-size-md',
 *   description: ''
 * }
 */
export function fontSizeDesignTokensCollectionTokenToMarkdown(
  token: DimensionDesignTokensCollectionToken,
  _context: MarkdownRenderContext,
  options: FontSizeMarkdownRenderOptions = {},
): MarkdownTokenRow {
  const { sampleText = DEFAULT_SAMPLE_TEXT } = options;

  // Generate the CSS variable name for this token
  const cssVariable = createCssVariableNameGenerator({
    prefix: CSS_VARIABLE_PREFIX,
  })(token.name);

  // Display the resolved CSS value dynamically using data-preview-value
  // Works for both T1 (direct) and T2 (reference) tokens
  const displayValue = `<div data-preview-value="${cssVariable}"></div>`;

  // Create the font-size preview HTML using CSS variable directly
  // The browser resolves var(--esds-*) via the CSS cascade
  const preview = /* HTML */ `
    <p
      style="
      font-size: var(${cssVariable});
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
    ${displayValue}
  `;

  return {
    preview,
    name: token.name.join('.'),
    cssVariable,
    description: token.description ?? '',
  };
}
