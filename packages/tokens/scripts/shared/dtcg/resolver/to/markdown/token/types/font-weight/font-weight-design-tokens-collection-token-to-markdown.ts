import type { FontWeightDesignTokensCollectionToken } from '../../../../../token/types/base/font-weight/font-weight-design-tokens-collection-token.ts';
import type { MarkdownRenderContext } from '../../markdown-render-context.ts';
import type { MarkdownTokenRow } from '../../markdown-token-row.ts';
import { DEFAULT_SAMPLE_TEXT } from '../../shared/constants.ts';

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
 * @param _context - The render context
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
  _context: MarkdownRenderContext,
  options: FontWeightMarkdownRenderOptions = {},
): MarkdownTokenRow {
  const {
    sampleText = DEFAULT_SAMPLE_TEXT,
    sampleFontSize = 16,
    sampleFontFamily = 'system-ui, sans-serif',
  } = options;

  // Font weight can be number or string
  const weightValue = token.value.toString();

  // Create the font weight preview HTML
  const preview = /* HTML */ `
    <p style="
      font-weight: ${weightValue};
      font-size: ${sampleFontSize}px;
      font-family: ${sampleFontFamily};
      margin: 0;
      padding: 8px;
      background: #f9fafb;
      border-radius: 4px;
      border: 1px solid #e5e7eb;
    ">${sampleText}</p>
    <div style="
      margin-top: 4px;
      font-family: monospace;
      font-size: 12px;
      color: #6b7280;
    ">${weightValue}</div>
  `;

  return {
    preview,
    name: token.name.join('.'),
    value: weightValue,
    description: token.description ?? '',
  };
}
