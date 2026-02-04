import type { FontWeightDesignTokensCollectionToken } from '../../../../../token/types/base/font-weight/font-weight-design-tokens-collection-token.ts';
import type { FontWeightDesignTokensCollectionTokenValue } from '../../../../../token/types/base/font-weight/value/font-weight-design-tokens-collection-token-value.ts';
import type { MarkdownRenderContext } from '../../markdown-render-context.ts';
import type { MarkdownTokenRow } from '../../markdown-token-row.ts';

/**
 * Configuration options for font weight markdown rendering
 */
export interface FontWeightMarkdownRenderOptions {
  /**
   * Sample text to display with the font weight
   * @default "The quick brown fox jumps over the lazy dog"
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
 * Maps numeric font weights to descriptive names
 */
const FONT_WEIGHT_NAMES: Record<number, string> = {
  100: 'Thin',
  200: 'Extra Light',
  300: 'Light',
  400: 'Regular',
  500: 'Medium',
  600: 'Semi Bold',
  700: 'Bold',
  800: 'Extra Bold',
  900: 'Black',
};

/**
 * Renders a font weight design token to a markdown table row.
 *
 * Creates a visual preview showing sample text rendered in the specified font weight.
 * Font weight can be either a numeric value (100-900) or a predefined string name.
 * The weight value and its descriptive name (if available) are displayed below.
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
    sampleText = 'The quick brown fox jumps over the lazy dog',
    sampleFontSize = 16,
    sampleFontFamily = 'system-ui, sans-serif',
  } = options;

  // Font weight can be number or string
  const value = token.value as unknown as FontWeightDesignTokensCollectionTokenValue;
  const weightValue = value.toString();

  // Get descriptive name for numeric weights
  let displayValue = weightValue;
  if (typeof value === 'number' && FONT_WEIGHT_NAMES[value]) {
    displayValue = `${value} (${FONT_WEIGHT_NAMES[value]})`;
  }

  // Create the font weight preview HTML
  const preview =
    `<p style="font-weight: ${weightValue}; font-size: ${sampleFontSize}px; font-family: ${sampleFontFamily}; margin: 0; padding: 8px; background: #f9fafb; border-radius: 4px; border: 1px solid #e5e7eb;">${sampleText}</p>` +
    `<div style="margin-top: 4px; font-family: monospace; font-size: 12px; color: #6b7280;">${displayValue}</div>`;

  return {
    preview,
    name: token.name.join('.'),
    value: displayValue,
    description: token.description ?? '',
  };
}
