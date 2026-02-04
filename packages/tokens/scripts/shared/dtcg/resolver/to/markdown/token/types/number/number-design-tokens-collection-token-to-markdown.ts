import type { NumberDesignTokensCollectionToken } from '../../../../../token/types/base/number/number-design-tokens-collection-token.ts';
import type { MarkdownRenderContext } from '../../markdown-render-context.ts';
import type { MarkdownTokenRow } from '../../markdown-token-row.ts';

/**
 * Configuration options for number markdown rendering
 */
export interface NumberMarkdownRenderOptions {
  /**
   * Number of decimal places to display
   * @default 2
   */
  readonly decimalPlaces?: number;

  /**
   * Whether to show percentage for values between 0 and 1
   * Useful for opacity values
   * @default true
   */
  readonly showPercentageForDecimals?: boolean;

  /**
   * Whether to show raw value alongside formatted value
   * @default false
   */
  readonly showRawValue?: boolean;
}

/**
 * Detects if a value is likely an opacity value based on its name or value range
 */
function isLikelyOpacity(name: readonly string[], value: number): boolean {
  // Check if name contains opacity-related terms
  const nameStr = name.join('.').toLowerCase();
  if (nameStr.includes('opacity') || nameStr.includes('alpha')) {
    return true;
  }

  // Values between 0 and 1 are likely opacity
  return value >= 0 && value <= 1;
}

/**
 * Detects if a token is a ratio token based on its name
 */
function isRatioToken(name: readonly string[]): boolean {
  const nameStr = name.join('.').toLowerCase();
  return nameStr.includes('ratio');
}

/**
 * Extracts the aspect ratio format from token name
 * e.g., "1-1" -> "1:1", "4-3" -> "4:3", "16-9" -> "16:9"
 */
function getRatioFormat(name: readonly string[]): string {
  // Get the last part of the name (e.g., "ratio.16-9" -> "16-9")
  const lastPart = name[name.length - 1] ?? '';
  // Replace dashes with colons to get aspect ratio format
  return lastPart.replace(/-/g, ':');
}

/**
 * Creates a ratio preview box showing the aspect ratio visually
 * A ratio of 1 is a square, 1.33 is 4:3, etc.
 *
 * @param ratio - The aspect ratio value (width / height)
 * @param value - The display value text to show in the box
 * @param name - The token name array to extract ratio format
 * @returns HTML string for the ratio preview
 */
function createRatioPreview(ratio: number, value: string, name: readonly string[]): string {
  // Base height for the preview box
  const baseHeight = 60;
  // Calculate width based on ratio: width = height * ratio
  // Round to avoid floating point precision issues in pixels
  const width = Math.round(baseHeight * ratio);
  
  // Format the ratio representation (e.g., "4:3", "16:9", "1:1")
  const ratioFormat = getRatioFormat(name);

  return (
    `<div style="display: inline-block; background: #f3f4f6; border-radius: 4px; border: 2px solid #374151; overflow: hidden; width: ${width}px; height: ${baseHeight}px; position: relative;">` +
    `<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-family: monospace; font-size: 12px; color: #374151; font-weight: 600; text-align: center;">${ratioFormat}</div>` +
    `</div>` +
    `<div style="margin-top: 4px; font-family: monospace; font-size: 12px; color: #6b7280;">${ratio}</div>`
  );
}

/**
 * Renders a numeric design token to a markdown table row.
 *
 * Creates a visual display of the numeric value with intelligent formatting.
 * For values between 0 and 1 (likely opacity), displays both decimal and percentage.
 * For other numeric values, displays with specified decimal places.
 *
 * @param token - The number design token to render
 * @param _context - The render context
 * @param options - Rendering options for customizing the display
 * @returns A markdown table row with number display
 *
 * @example
 * Input: opacity.50 with value 0.5
 * Output: {
 *   preview: Code display showing '0.5 (50%)',
 *   name: 'opacity.50',
 *   value: '0.5 (50%)',
 *   description: ''
 * }
 *
 * @example
 * Input: line-height.normal with value 1.5
 * Output: {
 *   preview: Code display showing '1.5',
 *   name: 'line-height.normal',
 *   value: '1.5',
 *   description: ''
 * }
 */
export function numberDesignTokensCollectionTokenToMarkdown(
  token: NumberDesignTokensCollectionToken,
  _context: MarkdownRenderContext,
  options: NumberMarkdownRenderOptions = {},
): MarkdownTokenRow {
  const {
    decimalPlaces = 2,
    showPercentageForDecimals = true,
    showRawValue = false,
  } = options;

  // Get the numeric value
  const value = token.value as unknown as number;

  // Format the value
  let displayValue: string;

  if (Number.isInteger(value)) {
    // Integer value - show as-is
    displayValue = value.toString();
  } else {
    // Decimal value - format with specified decimal places
    const formattedValue = value.toFixed(decimalPlaces);

    // Check if this is likely an opacity value
    if (showPercentageForDecimals && isLikelyOpacity(token.name, value)) {
      const percentage = Math.round(value * 100);
      displayValue = `${formattedValue} (${percentage}%)`;
    } else {
      displayValue = formattedValue;
    }
  }

  // Show raw value if requested and different from formatted
  if (showRawValue && displayValue !== value.toString()) {
    displayValue = `${displayValue} [raw: ${value}]`;
  }

  // Create the number preview HTML
  // For ratio tokens, show a visual box representing the aspect ratio
  // For others, show a styled code block
  let preview: string;

  if (isRatioToken(token.name)) {
    preview = createRatioPreview(value, displayValue, token.name);
  } else {
    preview =
      `<div style="background: #f3f4f6; padding: 8px 12px; border-radius: 4px; border: 1px solid #e5e7eb; font-family: monospace; font-size: 14px; color: #1f2937; display: inline-block; min-width: 60px; text-align: center;">${displayValue}</div>`;
  }

  return {
    preview,
    name: token.name.join('.'),
    value: displayValue,
    description: token.description ?? '',
  };
}
