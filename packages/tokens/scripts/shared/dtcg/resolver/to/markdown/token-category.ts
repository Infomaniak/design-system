/**
 * Extracts the semantic category from a token file path.
 * The category is used to group tokens into markdown documentation files.
 *
 * Category extraction rules:
 * - The file name defines the category
 * - All categories are normalized to lowercase for consistent file naming
 */
export function getTokenCategory(filePath: string): string {
  const path = filePath.toLowerCase();
  const match: RegExpMatchArray | null = path.match(/\/([^/]+)\.tokens\.json$/);

  if (match === null) {
    throw new Error(`Unable to extract category from file path: ${path}`);
  }

  return match[1].toLowerCase();
}
