import { CSS_VARIABLE_PREFIX } from '../../../../../../../../scripts/build-tokens/src/constants/css-variable-prefix.ts';
import { isCurlyReference } from '../../../../../../design-token/reference/types/curly/is-curly-reference.ts';
import type { NumberDesignTokensCollectionToken } from '../../../../../token/types/base/number/number-design-tokens-collection-token.ts';
import { createCssVariableNameGenerator } from '../../../../css/token/name/create-css-variable-name-generator.ts';
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
function createRatioPreview(ratio: number, _value: string, name: readonly string[]): string {
  // Base height for the preview box
  const baseHeight = 60;
  // Calculate width based on ratio: width = height * ratio
  // Round to avoid floating point precision issues in pixels
  const width = Math.round(baseHeight * ratio);

  // Format the ratio representation (e.g., "4:3", "16:9", "1:1")
  const ratioFormat = getRatioFormat(name);

  return /* HTML */ `
    <div
      style="
      display: inline-block;
      background: #f3f4f6;
      border-radius: 4px;
      border: 2px solid #374151;
      overflow: hidden;
      width: ${width}px;
      height: ${baseHeight}px;
      position: relative;
    "
    >
      <div
        style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-family: monospace;
        font-size: 12px;
        color: #374151;
        font-weight: 600;
        text-align: center;
      "
      >
        ${ratioFormat}
      </div>
    </div>
    <div
      style="
      margin-top: 4px;
      font-family: monospace;
      font-size: 12px;
      color: #6b7280;
    "
    >
      ${ratio}
    </div>
  `;
}

/**
 * Formats a numeric value for display with intelligent formatting
 */
function formatNumberValue(
  value: number,
  name: readonly string[],
  options: NumberMarkdownRenderOptions,
): string {
  const { decimalPlaces = 2, showPercentageForDecimals = true } = options;

  if (Number.isInteger(value)) {
    return value.toString();
  }

  const decimalFormatted = value.toFixed(decimalPlaces);
  // Check if this is likely an opacity value
  if (showPercentageForDecimals && isLikelyOpacity(name, value)) {
    const percentage = Math.round(value * 100);
    return `${decimalFormatted} (${percentage}%)`;
  }

  return decimalFormatted;
}

/**
 * Renders a numeric design token to a markdown table row.
 *
 * Creates a visual display of the numeric value with intelligent formatting.
 * For values between 0 and 1 (likely opacity), displays both decimal and percentage.
 * For other numeric values, displays with specified decimal places.
 * For T2 reference tokens, the value is resolved at build time via collection.resolve().
 *
 * @param token - The number design token to render
 * @param context - The render context used for resolving token references
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
  context: MarkdownRenderContext,
  options: NumberMarkdownRenderOptions = {},
): MarkdownTokenRow {
  const { showRawValue = false } = options;

  // Generate the CSS variable name for this token
  const cssVariable = createCssVariableNameGenerator({
    prefix: CSS_VARIABLE_PREFIX,
  })(token.name);

  // Resolve the token (works for both T1 direct values and T2 references)
  const resolved = context.collection.resolve(token);
  const resolvedValue = resolved.value as number;
  const isReference = isCurlyReference(token.value);

  let preview: string;

  if (isReference) {
    // For T2/T3 references, show a preview with the resolved value
    const displayValue = formatNumberValue(resolvedValue, token.name, options);
    preview = /* HTML */ `
      <div
        style="
        background: #f3f4f6;
        padding: 8px 12px;
        border-radius: 4px;
        border: 1px solid #e5e7eb;
        font-family: monospace;
        font-size: 14px;
        color: #1f2937;
        display: inline-block;
        min-width: 60px;
        text-align: center;
      "
      >
        ${displayValue}
      </div>
    `;
  } else {
    // Format the value for T1 (direct values)
    let formattedValue: string;
    if (Number.isInteger(resolvedValue)) {
      formattedValue = resolvedValue.toString();
    } else {
      const decimalFormatted = resolvedValue.toFixed(options.decimalPlaces ?? 2);
      // Check if this is likely an opacity value
      if (
        options.showPercentageForDecimals !== false &&
        isLikelyOpacity(token.name, resolvedValue)
      ) {
        const percentage = Math.round(resolvedValue * 100);
        formattedValue = `${decimalFormatted} (${percentage}%)`;
      } else {
        formattedValue = decimalFormatted;
      }
    }

    let displayValue: string;

    // Show raw value if requested and different from formatted
    displayValue = formattedValue;
    if (showRawValue && displayValue !== resolvedValue.toString()) {
      displayValue = `${displayValue} [raw: ${resolvedValue}]`;
    }

    // Create the preview
    if (isRatioToken(token.name)) {
      preview = createRatioPreview(resolvedValue, displayValue, token.name);
    } else {
      preview = /* HTML */ `
        <div
          style="
          background: #f3f4f6;
          padding: 8px 12px;
          border-radius: 4px;
          border: 1px solid #e5e7eb;
          font-family: monospace;
          font-size: 14px;
          color: #1f2937;
          display: inline-block;
          min-width: 60px;
          text-align: center;
        "
        >
          ${displayValue}
        </div>
      `;
    }
  }

  return {
    preview,
    name: token.name.join('.'),
    cssVariable,
    description: token.description ?? '',
  };
}
