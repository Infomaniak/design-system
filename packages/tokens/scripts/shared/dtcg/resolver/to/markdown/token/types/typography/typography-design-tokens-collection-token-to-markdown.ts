import { isCurlyReference } from '../../../../../../design-token/reference/types/curly/is-curly-reference.ts';
import type { TypographyDesignTokensCollectionToken } from '../../../../../token/types/composite/typography/typography-design-tokens-collection-token.ts';
import type { TypographyDesignTokensCollectionTokenValue } from '../../../../../token/types/composite/typography/value/typography-design-tokens-collection-token-value.ts';
import type { MarkdownRenderContext } from '../../markdown-render-context.ts';
import type { MarkdownTokenRow } from '../../markdown-token-row.ts';

/**
 * Configuration options for typography markdown rendering
 */
export interface TypographyMarkdownRenderOptions {
  /**
   * Sample text to display with the typography settings
   * @default "Edelweiss prefers rocky limestone locations"
   */
  readonly sampleText?: string;

  /**
   * Whether to resolve token references and show actual values
   * @default true
   */
  readonly resolveReferences?: boolean;
}

/**
 * Samples of text with different characters for better font testing
 */
const SAMPLE_TEXTS = [
  'Edelweiss prefers rocky limestone locations',
  'The quick brown fox jumps over the lazy dog',
  'Sphinx of black quartz, judge my vow',
  'Pack my box with five dozen liquor jugs',
];

/**
 * Resolves a token reference and returns its string value
 */
function resolveReference(
  context: MarkdownRenderContext,
  reference: string,
): string | null {
  try {
    const tokenName = reference
      .replace(/[{}]/g, '')
      .split('.')
      .filter(Boolean);
    const resolved = context.collection.resolve(
      context.collection.get(tokenName),
    );
    return String(resolved.value);
  } catch {
    return null;
  }
}

/**
 * Flattens a typography value, resolving references where possible
 */
function flattenTypographyValue(
  value: TypographyDesignTokensCollectionTokenValue,
  context: MarkdownRenderContext,
  resolve: boolean,
): TypographyDesignTokensCollectionTokenValue {
  if (!resolve) {
    return value;
  }

  const resolveValue = <T>(
    val: string | T,
  ): string | T => {
    if (isCurlyReference(val)) {
      const resolved = resolveReference(context, val);
      return resolved !== null ? (resolved as unknown as T) : val;
    }
    return val;
  };

  return {
    fontFamily: resolveValue(value.fontFamily),
    fontSize: resolveValue(value.fontSize),
    fontWeight: resolveValue(value.fontWeight),
    letterSpacing: resolveValue(value.letterSpacing),
    lineHeight: resolveValue(value.lineHeight),
  };
}

/**
 * Constructs a CSS font shorthand string from typography values
 */
function typographyToCssString(
  value: TypographyDesignTokensCollectionTokenValue,
): string {
  const parts: string[] = [];

  // Font weight
  if (value.fontWeight) {
    parts.push(String(value.fontWeight).replace(/[{}]/g, ''));
  }

  // Font size and line height
  if (value.fontSize) {
    const fontSize = String(value.fontSize).replace(/[{}]/g, '');
    if (value.lineHeight) {
      const lineHeight = String(value.lineHeight).replace(/[{}]/g, '');
      parts.push(`${fontSize}/${lineHeight}`);
    } else {
      parts.push(fontSize);
    }
  }

  // Font family
  if (value.fontFamily) {
    const fontFamily = String(value.fontFamily).replace(/[{}]/g, '');
    // Add quotes if not already present and contains spaces
    if (fontFamily.includes(' ') && !fontFamily.includes('"') && !fontFamily.includes("'")) {
      parts.push(`"${fontFamily}"`);
    } else {
      parts.push(fontFamily);
    }
  }

  return parts.join(' ');
}

/**
 * Renders a typography design token to a markdown table row.
 *
 * Creates a visual preview showing styled text with all typographic properties
 * (font family, size, weight, letter spacing, line height) applied.
 * Displays the computed CSS font shorthand below the preview.
 *
 * This renderer attempts to resolve token references when possible, showing
 * actual computed values instead of just reference names.
 *
 * @param token - The typography design token to render
 * @param context - The render context used for resolving token references
 * @param options - Rendering options for customizing the preview
 * @returns A markdown table row with typography preview
 *
 * @example
 * Input: typography.heading with composite value
 * Output: {
 *   preview: Styled text with font settings applied,
 *   name: 'typography.heading',
 *   value: '700 24px/1.5 "Inter"',
 *   description: ''
 * }
 */
export function typographyDesignTokensCollectionTokenToMarkdown(
  token: TypographyDesignTokensCollectionToken,
  context: MarkdownRenderContext,
  options: TypographyMarkdownRenderOptions = {},
): MarkdownTokenRow {
  const {
    sampleText = SAMPLE_TEXTS[0],
    resolveReferences = true,
  } = options;

  // Get the typography value
  const value = token.value as unknown as TypographyDesignTokensCollectionTokenValue;

  // Try to resolve references to get actual values
  const resolvedValue = flattenTypographyValue(value, context, resolveReferences);

  // Build the CSS style string for inline styles
  const styleParts: string[] = [];

  if (resolvedValue.fontFamily) {
    const fontFamily = String(resolvedValue.fontFamily).replace(/[{}]/g, '');
    styleParts.push(`font-family: ${fontFamily}`);
  }

  if (resolvedValue.fontSize) {
    const fontSize = String(resolvedValue.fontSize).replace(/[{}]/g, '');
    styleParts.push(`font-size: ${fontSize}`);
  }

  if (resolvedValue.fontWeight) {
    const fontWeight = String(resolvedValue.fontWeight).replace(/[{}]/g, '');
    styleParts.push(`font-weight: ${fontWeight}`);
  }

  if (resolvedValue.letterSpacing) {
    const letterSpacing = String(resolvedValue.letterSpacing).replace(/[{}]/g, '');
    styleParts.push(`letter-spacing: ${letterSpacing}`);
  }

  if (resolvedValue.lineHeight) {
    const lineHeight = String(resolvedValue.lineHeight).replace(/[{}]/g, '');
    styleParts.push(`line-height: ${lineHeight}`);
  }

  const cssString = typographyToCssString(resolvedValue);

  // Create the typography preview HTML
  const preview =
    `<p style="${styleParts.join('; ')}; margin: 0; padding: 12px; background: #f9fafb; border-radius: 4px; border: 1px solid #e5e7eb; max-width: 300px;">${sampleText}</p>` +
    `<div style="margin-top: 4px; font-family: monospace; font-size: 11px; color: #6b7280; max-width: 300px; word-wrap: break-word;">${cssString}</div>`;

  return {
    preview,
    name: token.name.join('.'),
    value: cssString,
    description: token.description ?? '',
  };
}
