import { CSS_VARIABLE_PREFIX } from '../../../../../../../../scripts/build-tokens/src/constants/css-variable-prefix.ts';
import { isCurlyReference } from '../../../../../../design-token/reference/types/curly/is-curly-reference.ts';
import { curlyReferenceToString } from '../../../../../../design-token/reference/types/curly/to/string/curly-reference-to-string.ts';
import type { NumberDesignTokensCollectionToken } from '../../../../../token/types/base/number/number-design-tokens-collection-token.ts';
import { createCssVariableNameGenerator } from '../../../../css/token/name/create-css-variable-name-generator.ts';
import type { MarkdownRenderContext } from '../../markdown-render-context.ts';
import type { MarkdownTokenRow } from '../../markdown-token-row.ts';

/**
 * Configuration options for opacity markdown rendering
 */
export interface OpacityMarkdownRenderOptions {
  /**
   * Size of the preview box in pixels
   * @default 100
   */
  readonly boxSize?: number;

  /**
   * Color of the overlay (CSS color value)
   * @default "#22c55e" (green-500)
   */
  readonly overlayColor?: string;
}

/**
 * Renders an opacity design token to a markdown table row.
 *
 * Creates a visual preview with a transparent checkerboard grid background
 * and a colored overlay with the opacity value applied. This makes it easy
 * to visually compare different opacity levels and understand how transparent
 * each value is.
 *
 * @param token - The opacity design token to render
 * @param _context - The render context (unused for opacity tokens)
 * @param options - Rendering options for customizing the preview
 * @returns A markdown table row with opacity preview
 *
 * @example
 * Input: opacity.50 with value 0.5
 * Output: {
 *   preview: Checkerboard with semi-transparent green overlay,
 *   name: 'opacity.50',
 *   value: '0.5 (50%)',
 *   description: ''
 * }
 */
export function opacityDesignTokensCollectionTokenToMarkdown(
  token: NumberDesignTokensCollectionToken,
  _context: MarkdownRenderContext,
  options: OpacityMarkdownRenderOptions = {},
): MarkdownTokenRow {
  const { boxSize = 100, overlayColor = '#22c55e' } = options;

  // Get the opacity value
  const opacity = token.value;

  // Generate the CSS variable name for this token
  const cssVariable = createCssVariableNameGenerator({
    prefix: CSS_VARIABLE_PREFIX,
  })(token.name);

  // Get the display value
  // For T1 (direct values): show the actual value (e.g., "0.5 (50%)")
  // For T2/T3 (references): show the referenced token name
  let displayValue: string;
  if (isCurlyReference(opacity)) {
    displayValue = curlyReferenceToString(opacity);
  } else {
    // Format the display value for direct values
    const percentage = Math.round(opacity * 100);
    displayValue = `${opacity} (${percentage}%)`;
  }

  // Create the opacity preview HTML using CSS variable directly
  // The browser resolves var(--esds-*) via the CSS cascade
  let preview: string;
  if (isCurlyReference(opacity)) {
    // For references, show a simpler preview without the percentage overlay
    preview = /* HTML */ `
      <div
        style="
        position: relative;
        width: ${boxSize}px;
        height: ${boxSize}px;
        display: inline-block;
        border-radius: 4px;
        overflow: hidden;
        border: 1px solid #e5e7eb;
      "
      >
        <div
          style="
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #f0f0f0;
          background-image: linear-gradient(45deg, #ccc 25%, transparent 25%),
            linear-gradient(-45deg, #ccc 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #ccc 75%),
            linear-gradient(-45deg, transparent 75%, #ccc 75%);
          background-size: 12px 12px;
          background-position: 0 0, 0 6px, 6px -6px, -6px 0px;
        "
        ></div>
        <div
          style="
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: ${overlayColor};
          opacity: var(${cssVariable});
        "
        ></div>
      </div>
      <div
        style="
        margin-top: 8px;
        font-family: monospace;
        font-size: 12px;
        color: #6b7280;
      "
      >
        ${displayValue}
      </div>
    `;
  } else {
    // For direct values, show the full preview with percentage overlay
    const percentage = Math.round(opacity * 100);
    preview = /* HTML */ `
      <div
        style="
        position: relative;
        width: ${boxSize}px;
        height: ${boxSize}px;
        display: inline-block;
        border-radius: 4px;
        overflow: hidden;
        border: 1px solid #e5e7eb;
      "
      >
        <div
          style="
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #f0f0f0;
          background-image: linear-gradient(45deg, #ccc 25%, transparent 25%),
            linear-gradient(-45deg, #ccc 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #ccc 75%),
            linear-gradient(-45deg, transparent 75%, #ccc 75%);
          background-size: 12px 12px;
          background-position: 0 0, 0 6px, 6px -6px, -6px 0px;
        "
        ></div>
        <div
          style="
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: ${overlayColor};
          opacity: var(${cssVariable});
        "
        ></div>
        <div
          style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-family: monospace;
          font-size: 14px;
          font-weight: 600;
          color: ${opacity > 0.5 ? '#fff' : '#374151'};
          text-shadow: ${opacity > 0.5 ? '0 1px 2px rgba(0,0,0,0.3)' : 'none'};
          z-index: 10;
        "
        >
          ${percentage}%
        </div>
      </div>
      <div
        style="
        margin-top: 8px;
        font-family: monospace;
        font-size: 12px;
        color: #6b7280;
      "
      >
        ${displayValue}
      </div>
    `;
  }

  return {
    preview,
    name: token.name.join('.'),
    value: displayValue,
    cssVariable,
    description: token.description ?? '',
  };
}
