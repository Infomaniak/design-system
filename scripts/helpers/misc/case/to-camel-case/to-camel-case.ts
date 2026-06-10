import numberToWords from 'number-to-words';

/**
 * Converts a string to camelCase.
 */
export function toCamelCase(input: string): string {
  return (
    input
      // remove all non-alphanumeric characters and replace next letter by uppercase
      .replace(/[^a-zA-Z0-9]+(.|$)/g, (_: string, letter: string): string => letter.toUpperCase())
      // handle leading digits
      .replace(/^(\d+)(.|$)/g, (_: string, digits: string, letter: string): string => {
        return toCamelCase(numberToWords.toWords(Number(digits))) + letter.toUpperCase();
      })
      // remove leading uppercase letters by lowercase letters
      .replace(/^[A-Z]+/g, (letter: string): string => letter.toLowerCase())
  );
}
