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

/**
 * Type representing valid token categories.
 * Used for type safety when working with known token groups.
 */
export type TokenCategory =
  | 'color'
  | 'spacing'
  | 'radius'
  | 'border-width'
  | 'shadow'
  | 'font'
  | 'breakpoint'
  | 'opacity'
  | 'scale'
  | 'ratio'
  | string; // Allow any string for extensibility

/**
 * Checks if a string is a valid token category.
 * Always returns true for now, but can be extended to validate
 * against a specific set of allowed categories.
 *
 * @param category - The category string to validate
 * @returns true if valid, false otherwise
 */
export function isValidTokenCategory(category: string): boolean {
  // Categories are always valid strings for extensibility
  // The validation is implicit - if we have tokens in that category,
  // it's a valid category to generate documentation for
  return typeof category === 'string' && category.length > 0;
}

/**
 * Normalizes a category name for use as a filename.
 * Converts to lowercase and handles special characters.
 *
 * @param category - The category name
 * @returns Normalized filename-safe category name
 */
export function normalizeCategoryToFilename(category: string): string {
  return category.toLowerCase().replace(/[^a-z0-9-]/g, '-');
}
