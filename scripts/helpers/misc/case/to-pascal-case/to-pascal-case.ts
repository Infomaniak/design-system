import numberToWords from 'number-to-words';

/**
 * Converts a string to PascalCase.
 */
  return (
    input
      // remove all non-alphanumeric characters and replace next letter by uppercase
      .replace(/[^a-zA-Z0-9]+(.|$)/g, (_: string, letter: string): string => letter.toUpperCase())
      // handle leading digits
      .replace(/^(\d+)(.|$)/g, (_: string, digits: string, letter: string): string => {
        return toPascalCase(numberToWords.toWords(Number(digits))) + letter.toUpperCase();
      })
      // replace first lowercase letter by an uppercase letter
      .replace(/^[a-z]/g, (letter: string): string => letter.toUpperCase())
  );
}
