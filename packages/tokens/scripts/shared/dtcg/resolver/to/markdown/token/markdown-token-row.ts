/**
 * Represents a single row in the markdown token documentation table.
 * Each token is displayed as a table row with a visual preview, name, CSS variable, and description.
 */
export interface MarkdownTokenRow {
  /**
   * HTML visualization of the token value.
   * For colors: color swatch box
   * For dimensions: green size bar
   * For shadows: box with shadow
   * For typography: styled text sample
   * For text values: code block or formatted value
   */
  readonly preview: string;

  /**
   * Token name formatted as a code string (e.g., `color.red.500`)
   */
  readonly name: string;

  /**
   * The CSS variable name for web consumers.
   * Includes the esds prefix (e.g., `--esds-color-red-500`)
   */
  readonly cssVariable: string;

  /**
   * Optional token description from the token definition.
   * Empty string if no description is provided.
   */
  readonly description: string;
}
