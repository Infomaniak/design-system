import { CSS_VARIABLE_PREFIX } from '../../../../../../../../scripts/build-tokens/src/constants/css-variable-prefix.ts';
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
 *   cssVariable: '--esds-opacity-50',
 *   description: ''
 * }
 */
export function opacityDesignTokensCollectionTokenToMarkdown(
  token: NumberDesignTokensCollectionToken,
  _context: MarkdownRenderContext,
  options: OpacityMarkdownRenderOptions = {},
): MarkdownTokenRow {
  const { boxSize = 100, overlayColor = '#22c55e' } = options;

  // Generate the CSS variable name for this token
  const cssVariable = createCssVariableNameGenerator({
    prefix: CSS_VARIABLE_PREFIX,
  })(token.name);

  // Create the opacity preview HTML using CSS variable directly
  // The browser resolves var(--esds-*) via the CSS cascade
  const preview = /* HTML */ `
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
    <div data-preview-value="${cssVariable}"></div>
  `;

  return {
    preview,
    name: token.name.join('.'),
    cssVariable,
    description: token.description ?? '',
  };
}
