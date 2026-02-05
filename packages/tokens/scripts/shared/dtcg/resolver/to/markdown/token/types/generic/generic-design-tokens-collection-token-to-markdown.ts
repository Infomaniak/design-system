import type { DesignTokensCollectionTokenWithType } from '../../../../../token/design-tokens-collection-token.ts';
import type { MarkdownRenderContext } from '../../markdown-render-context.ts';
import type { MarkdownTokenRow } from '../../markdown-token-row.ts';

/**
 * Configuration options for generic markdown rendering
 */
export interface GenericMarkdownRenderOptions {
  /**
   * Maximum length of value preview before truncation
   * @default 100
   */
  readonly maxValueLength?: number;

  /**
   * Whether to format JSON values with indentation
   * @default false
   */
  readonly prettyPrintJson?: boolean;

  /**
   * Fallback preview HTML for completely unknown token types
   * @default undefined (uses default gray box)
   */
  readonly customPreviewTemplate?: string;
}

/**
 * Truncates a string to a maximum length with ellipsis
 */
function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) {
    return str;
  }
  return str.slice(0, maxLength - 3) + '...';
}

/**
 * Formats a value for display in markdown
 */
function formatValue(value: unknown, prettyPrint: boolean): string {
  if (value === null) {
    return 'null';
  }

  if (value === undefined) {
    return 'undefined';
  }

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  if (typeof value === 'object') {
    try {
      return JSON.stringify(value, null, prettyPrint ? 2 : 0);
    } catch {
      return '[Object]';
    }
  }

  return String(value);
}

/**
 * Creates an appropriate preview HTML based on the token type
 */
function createFallbackPreview(
  type: string,
  value: string,
  _options: GenericMarkdownRenderOptions,
): string {
  // Define colors for different token types
  const typeColors: Record<string, string> = {
    duration: '#dbeafe', // blue-100
    cubicBezier: '#fce7f3', // pink-100
    strokeStyle: '#fef3c7', // amber-100
    border: '#e0e7ff', // indigo-100
    gradient: '#ccfbf1', // teal-100
    transition: '#f3e8ff', // purple-100
  };

  const backgroundColor = typeColors[type] ?? '#f3f4f6';
  const borderColor = '#e5e7eb'; // gray-200

  return /* HTML */ `
    <div
      style="
      background: ${backgroundColor};
      padding: 12px;
      border-radius: 4px;
      border: 1px solid ${borderColor};
      font-family: monospace;
      font-size: 13px;
      color: #374151;
    "
    >
      <div
        style="
        font-weight: 600;
        margin-bottom: 4px;
        color: #4b5563;
      "
      >
        Type: ${type}
      </div>
      <div style="word-wrap: break-word;">${truncate(value, 80)}</div>
    </div>
    <div
      style="
      margin-top: 4px;
      font-family: monospace;
      font-size: 11px;
      color: #6b7280;
    "
    >
      ${type}
    </div>
  `;
}

/**
 * Generic renderer for any token type not handled by specialized renderers.
 *
 * This is the fallback renderer that handles token types like:
 * - duration
 * - cubicBezier
 * - strokeStyle
 * - border
 * - gradient
 * - transition
 * - Any other future token types
 *
 * The renderer creates a simple visualization showing the token type
 * and the JSON representation of the value.
 *
 * @param token - Any design token with a type
 * @param _context - The render context (unused but kept for interface consistency)
 * @param options - Rendering options
 * @returns A markdown table row with a generic preview
 *
 * @example
 * Input: duration.transition with value { duration: 300, unit: 'ms' }
 * Output: {
 *   preview: Box showing 'Type: duration' and JSON value,
 *   name: 'duration.transition',
 *   value: '{"duration":300,"unit":"ms"}',
 *   description: ''
 * }
 */
export function genericDesignTokensCollectionTokenToMarkdown(
  token: DesignTokensCollectionTokenWithType<string, unknown>,
  _context: MarkdownRenderContext,
  options: GenericMarkdownRenderOptions = {},
): MarkdownTokenRow {
  const { maxValueLength = 100, prettyPrintJson = false, customPreviewTemplate } = options;

  // Format the value for display
  const formattedValue = formatValue(token.value, prettyPrintJson);
  const displayValue = truncate(formattedValue, maxValueLength);

  // Create preview HTML
  let preview: string;
  if (customPreviewTemplate) {
    preview = customPreviewTemplate
      .replace('{{type}}', token.type)
      .replace('{{value}}', displayValue);
  } else {
    preview = createFallbackPreview(token.type, displayValue, options);
  }

  return {
    preview,
    name: token.name.join('.'),
    value: displayValue,
    description: token.description ?? '',
  };
}
