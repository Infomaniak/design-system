/**
 * Shadow Design Token Markdown Renderer
 *
 * Handles rendering of shadow design tokens to markdown table rows.
 * Shadow tokens contain multiple dimensional components (x, y, blur, spread)
 * that need to be composed into a CSS box-shadow string.
 *
 * @module shadow-design-tokens-collection-token-to-markdown
 */

import type { ShadowDesignTokensCollectionToken } from '../../../../../token/types/composite/shadow/shadow-design-tokens-collection-token.ts';
import type { MarkdownRenderContext } from '../../markdown-render-context.ts';
import type { MarkdownTokenRow } from '../../markdown-token-row.ts';

/**
 * Configuration options for shadow markdown rendering
 */
export interface ShadowMarkdownRenderOptions {
  /**
   * Size of the shadow preview box in pixels (width and height)
   * @default 50
   */
  readonly boxSize?: number;

  /**
   * Default shadow color when not specified in token
   * @default "rgba(12, 12, 12, 0.09)"
   */
  readonly defaultShadowColor?: string;
}

/**
 * Extracts a dimension value from a shadow component
 * The value can be either a direct dimension object or resolved value
 */
function extractDimensionValue(component: unknown, defaultValue: number = 0): number {
  if (typeof component === 'number') {
    return component;
  }

  if (component && typeof component === 'object') {
    const obj = component as Record<string, unknown>;

    // Check for resolved value (direct number)
    if (typeof obj['value'] === 'number') {
      return obj['value'];
    }

    // Check for $value (raw token structure)
    if (obj['$value'] && typeof obj['$value'] === 'object') {
      const valueObj = obj['$value'] as Record<string, unknown>;
      if (typeof valueObj['value'] === 'number') {
        return valueObj['value'];
      }
    }
  }

  return defaultValue;
}

/**
 * Constructs a CSS box-shadow string from shadow token components
 */
function constructBoxShadow(value: unknown, defaultColor: string): string {
  // Handle array of shadows (multiple shadows)
  if (Array.isArray(value)) {
    return value.map((shadow) => constructSingleBoxShadow(shadow, defaultColor)).join(', ');
  }

  // Single shadow
  return constructSingleBoxShadow(value, defaultColor);
}

/**
 * Constructs a CSS box-shadow string from a single shadow object
 */
function constructSingleBoxShadow(shadow: unknown, defaultColor: string): string {
  if (!shadow || typeof shadow !== 'object') {
    return `0px 2px 4px 0px ${defaultColor}`;
  }

  const obj = shadow as Record<string, unknown>;

  // Extract dimension values
  // The token structure has x, y, blur, spread as properties
  const x = extractDimensionValue(obj['x'] ?? obj['offsetX'], 0);
  const y = extractDimensionValue(obj['y'] ?? obj['offsetY'], 0);
  const blur = extractDimensionValue(obj['blur'], 0);
  const spread = extractDimensionValue(obj['spread'], 0);

  // Check for color in the shadow object
  let color = defaultColor;
  if (obj['color']) {
    const colorValue = obj['color'];
    if (typeof colorValue === 'string') {
      color = colorValue;
    } else if (colorValue && typeof colorValue === 'object') {
      // Try to extract hex or rgba from color object
      const colorObj = colorValue as Record<string, unknown>;
      if (colorObj['hex'] && typeof colorObj['hex'] === 'string') {
        color = colorObj['hex'];
      }
    }
  }

  // Check for inset
  const inset = obj['inset'] === true ? 'inset ' : '';

  // Construct CSS box-shadow: x y blur spread color
  return `${inset}${x}px ${y}px ${blur}px ${spread}px ${color}`;
}

/**
 * Renders a shadow design token to a markdown table row.
 *
 * Creates a visual preview with a box displaying the shadow effect.
 * The shadow CSS value is displayed as text below the preview.
 *
 * @param token - The shadow design token to render
 * @param _context - The render context (unused for shadow tokens)
 * @param options - Rendering options for customizing the preview
 * @returns A markdown table row with shadow preview
 *
 * @example
 * Input: shadow.1 with composite value { x: 0px, y: 1px, blur: 2px, spread: 0px }
 * Output: {
 *   preview: Box with shadow effect displayed,
 *   name: 'shadow.1',
 *   value: '0px 1px 2px 0px rgba(12,12,12,0.09)',
 *   description: ''
 * }
 */
export function shadowDesignTokensCollectionTokenToMarkdown(
  token: ShadowDesignTokensCollectionToken,
  _context: MarkdownRenderContext,
  options: ShadowMarkdownRenderOptions = {},
): MarkdownTokenRow {
  const { boxSize = 50, defaultShadowColor = 'rgba(12, 12, 12, 0.09)' } = options;

  // Construct the CSS box-shadow value
  const cssShadowValue = constructBoxShadow(token.value, defaultShadowColor);

  // Create the shadow preview HTML
  // Shows a box with the shadow applied
  const preview =
    `<div style="width: ${boxSize}px; height: ${boxSize}px; background: white; border: 1px solid #e5e7eb; border-radius: 4px; box-shadow: ${cssShadowValue}; margin: 16px;"></div>` +
    `<div style="font-family: monospace; font-size: 11px; color: #6b7280; max-width: 200px; word-wrap: break-word;">${cssShadowValue}</div>`;

  return {
    preview,
    name: token.name.join('.'),
    value: cssShadowValue,
    description: token.description ?? '',
  };
}
