/**
 * Converts a string to snake_case.
 */
export function toSnakeCase(input: string): string {
  return (
    input
      // replace all non-alphanumeric or underscore characters with underscore
      .replace(/[^a-zA-Z0-9_]/g, '_')
      // remove starting and ending underscores
      .replace(/^_+|_+$/g, '')
      // remove consecutive underscores
      .replace(/__+/g, '_')
      // lowercase upper letters preceded by an underscore
      .replace(/_([A-Z])/g, (_: string, letter: string): string => `_${letter.toLowerCase()}`)
      // convert camelCase/PascalCase to snake_case
      .replace(
        /[A-Z]/g,
        (letter: string, offset: number): string =>
          `${offset > 0 ? '_' : ''}${letter.toLowerCase()}`,
      )
  );
}
