import type { DesignTokensCollectionTokenWithType } from '../../../token/design-tokens-collection-token.ts';
import type { MarkdownTokenRow } from './markdown-token-row.ts';
import type { MarkdownRenderContext } from './markdown-render-context.ts';

/**
 * Interface for token type-specific markdown renderers.
 * Each token type (color, dimension, shadow, etc.) has its own renderer
 * that knows how to create a visual preview and format the value.
 */
export interface MarkdownRenderer<GTokenType extends string> {
  /**
   * Array of token types supported by this renderer.
   * A renderer may handle multiple related types.
   */
  readonly supportedTypes: readonly GTokenType[];

  /**
   * Renders a design token into a markdown table row.
   *
   * @param token - The design token to render
   * @param context - Context containing the token collection for reference resolution
   * @returns A markdown table row with preview, name, value, and description
   */
  render(
    token: DesignTokensCollectionTokenWithType<GTokenType, any>,
    context: MarkdownRenderContext,
  ): MarkdownTokenRow;
}

/**
 * Generic markdown renderer type for any token type.
 */
export type GenericMarkdownRenderer = MarkdownRenderer<string>;
