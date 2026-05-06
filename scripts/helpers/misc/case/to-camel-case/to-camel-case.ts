/**
 * Converts a string to camelCase.
 */
export function toCamelCase(input: string): string {
  return (
    input
      // remove all non-alphanumeric characters and replace next letter by uppercase
      .replace(/[^a-zA-Z0-9]+(.|$)/g, (_: string, letter: string): string => letter.toUpperCase())
      // remove starting digits
      .replace(/^\d+/g, '')
      // remove starting uppercase letters by lowercase letters
      .replace(/^[A-Z]+/g, (letter: string): string => letter.toLowerCase())
  );
}
