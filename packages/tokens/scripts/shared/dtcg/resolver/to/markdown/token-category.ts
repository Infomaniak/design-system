import type { ArrayDesignTokenName } from '../../token/name/array-design-token-name.ts';

/**
 * Extracts the semantic category from a token name.
 * The category is used to group tokens into markdown documentation files.
 *
 * Category extraction rules:
 * - By default, the first segment of the token name is the category
 * - All categories are normalized to lowercase for consistent file naming
 *
 * @param tokenName - The token name as an array of segments
 * @returns The category string (lowercase)
 *
 * @example
 * ```typescript
 * getTokenCategory(['color', 'red', '500']) // returns 'color'
 * getTokenCategory(['spacing', '8']) // returns 'spacing'
 * getTokenCategory(['font', 'size', '16']) // returns 'font'
 * getTokenCategory(['shadow', '1']) // returns 'shadow'
 * ```
 */
export function getTokenCategory(tokenName: ArrayDesignTokenName): string {
  if (tokenName.length === 0) {
    throw new Error('Token name cannot be empty');
  }

  // The category is always the first segment of the token name
  // This matches the file structure where tokens are grouped by category
  // e.g., color.tokens.json, spacing.tokens.json, font.tokens.json
  const category = tokenName[0]!;

  // Normalize to lowercase for consistent file naming
  return category.toLowerCase();
}
