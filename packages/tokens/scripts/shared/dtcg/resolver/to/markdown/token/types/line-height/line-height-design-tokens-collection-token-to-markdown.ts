import { CSS_VARIABLE_PREFIX } from '../../../../../../../../scripts/build-tokens/src/constants/css-variable-prefix.ts';
import type { NumberDesignTokensCollectionToken } from '../../../../../token/types/base/number/number-design-tokens-collection-token.ts';
import { createCssVariableNameGenerator } from '../../../../css/token/name/create-css-variable-name-generator.ts';
import type { MarkdownRenderContext } from '../../markdown-render-context.ts';
import type { MarkdownTokenRow } from '../../markdown-token-row.ts';
import { DEFAULT_SAMPLE_TEXT } from '../../shared/constants.ts';

/**
 * Configuration options for line-height markdown rendering
 */
export interface LineHeightMarkdownRenderOptions {
  /**
   * Sample text to display with the line height
   */
  readonly sampleText?: string;

  /**
   * Fallback font size in pixels when corresponding font-size token is not found
   * @default 16
   */
  readonly fallbackFontSize?: number;
}

/**
 * Extracts the size key from a line-height token name.
 * For example: font.line-height.2xl -> 2xl
 *              font.line-height.sm  -> sm
 */
function extractSizeKeyFromLineHeightName(name: readonly string[]): string | undefined {
  // Expected pattern: font.line-height.<size>
  if (name.length < 3 || name[0] !== 'font' || name[1] !== 'line-height') {
    return undefined;
  }
  return name[2];
}

/**
 * Attempts to find a corresponding font-size token for the given line-height token.
 * For example: font.line-height.2xl -> looks for font.size.2xl
 *
 * @param context - The render context containing the token collection
 * @param lineHeightName - The name of the line-height token (array format)
 * @returns The CSS variable name for the corresponding font-size, or undefined if not found
 */
function findCorrespondingFontSizeCssVariable(
  context: MarkdownRenderContext,
  lineHeightName: readonly string[],
): { cssVariable: string | undefined; found: boolean } {
  const sizeKey = extractSizeKeyFromLineHeightName(lineHeightName);

  if (sizeKey === undefined) {
    return { cssVariable: undefined, found: false };
  }

  // Look for matching font-size token: font.size.<sizeKey>
  const fontSizeTokenName = ['font', 'size', sizeKey];
  const cssVariable = createCssVariableNameGenerator({
    prefix: CSS_VARIABLE_PREFIX,
  })(fontSizeTokenName);

  // Check if the font-size token exists in the collection
  const fontSizeToken = context.collection.getOptional(fontSizeTokenName);

  return {
    cssVariable,
    found: fontSizeToken !== undefined,
  };
}

/**
 * Renders a line-height design token to a markdown table row.
 *
 * Creates a visual preview showing multi-line sample text with the specified line-height.
 * The renderer intelligently pairs the line-height with its corresponding font-size token
 * (e.g., font.line-height.2xl uses font.size.2xl) for accurate visual representation.
 * The line-height value is displayed below the preview for direct values.
 *
 * @param token - The line-height design token to render
 * @param context - The render context containing the token collection for finding matching font-size
 * @param options - Rendering options for customizing the preview
 * @returns A markdown table row with line-height preview
 *
 * @example
 * Input: font.line-height.2xl with value 32
 * Output: {
 *   preview: Multi-line sample text with line-height and paired font-size applied,
 *   name: 'font.line-height.2xl',
 *   cssVariable: '--esds-font-line-height-2xl',
 *   description: ''
 * }
 */
export function lineHeightDesignTokensCollectionTokenToMarkdown(
  token: NumberDesignTokensCollectionToken,
  context: MarkdownRenderContext,
  options: LineHeightMarkdownRenderOptions = {},
): MarkdownTokenRow {
  const { sampleText = DEFAULT_SAMPLE_TEXT, fallbackFontSize = 16 } = options;

  // Generate the CSS variable name for this token
  const cssVariable = createCssVariableNameGenerator({
    prefix: CSS_VARIABLE_PREFIX,
  })(token.name);

  // Find corresponding font-size token for pairing
  const fontSizeResult = findCorrespondingFontSizeCssVariable(context, token.name);
  const fontSizeCss = fontSizeResult.found
    ? `var(${fontSizeResult.cssVariable})`
    : `${fallbackFontSize}px`;

  // Display the resolved CSS value dynamically using data-preview-value
  // Works for both T1 (direct) and T2 (reference) tokens
  const displayValue = `<div data-preview-value="${cssVariable}"></div>`;

  // Create the line-height preview HTML using CSS variables directly
  // The browser resolves var(--esds-*) via the CSS cascade
  const preview = /* HTML */ `
    <p
      style="
      line-height: var(${cssVariable});
      font-size: ${fontSizeCss};
      margin: 0;
      padding: 8px;
      background: #f9fafb;
      border-radius: 4px;
      border: 1px solid #e5e7eb;
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
