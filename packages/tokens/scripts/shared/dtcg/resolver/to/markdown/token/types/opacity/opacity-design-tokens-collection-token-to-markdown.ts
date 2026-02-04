import type { NumberDesignTokensCollectionToken } from '../../../../../token/types/base/number/number-design-tokens-collection-token.ts';
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
  const {
    boxSize = 100,
    overlayColor = '#22c55e',
  } = options;

  // Get the opacity value
  const opacity = token.value as unknown as number;

  // Format the display value
  const percentage = Math.round(opacity * 100);
  const displayValue = `${opacity} (${percentage}%)`;

  // Create the opacity preview HTML
  // Shows a checkerboard grid with a green overlay at the specified opacity
  const preview =
    `<div style="position: relative; width: ${boxSize}px; height: ${boxSize}px; display: inline-block; border-radius: 4px; overflow: hidden; border: 1px solid #e5e7eb;">` +
    `<div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-color: #f0f0f0; background-image: linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%); background-size: 12px 12px; background-position: 0 0, 0 6px, 6px -6px, -6px 0px;"></div>` +
    `<div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-color: ${overlayColor}; opacity: ${opacity};"></div>` +
    `<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-family: monospace; font-size: 14px; font-weight: 600; color: ${opacity > 0.5 ? '#fff' : '#374151'}; text-shadow: ${opacity > 0.5 ? '0 1px 2px rgba(0,0,0,0.3)' : 'none'}; z-index: 10;">${percentage}%</div>` +
    `</div>` +
    `<div style="margin-top: 8px; font-family: monospace; font-size: 12px; color: #6b7280;">${displayValue}</div>`;

  return {
    preview,
    name: token.name.join('.'),
    value: displayValue,
    description: token.description ?? '',
  };
}
