import type { DesignTokensCollection } from '../../../design-tokens-collection.ts';

/**
 * Context object passed to markdown renderers.
 * Provides access to the token collection for resolving references
 * and other shared utilities needed during rendering.
 */
export interface MarkdownRenderContext {
  /**
   * The complete collection of design tokens.
   * Used to resolve token references (e.g., {color.primary}) and
   * to look up related tokens when rendering composite types.
   */
  readonly collection: DesignTokensCollection;

  /**
   * The tier prefix of the token group being rendered.
   * One of: 't1', 't2', 't3', 'material'.
   */
  readonly tierPrefix: string;
}
