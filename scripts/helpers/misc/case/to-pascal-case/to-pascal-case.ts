/**
 * Converts a string to camelCase.
 */
export function toPascalCase(input: string): string {
  return (
    input
      // remove all non-alphanumeric characters and replace next letter by uppercase
      .replace(/[^a-zA-Z0-9]+(.|$)/g, (_: string, letter: string): string => letter.toUpperCase())
      // remove starting digits
      .replace(/^\d+/g, '')
      // remove starting lowercase letter by an uppercase letter
      .replace(/^[a-z]/g, (letter: string): string => letter.toUpperCase())
  );
}
